import { reactive, ref } from 'vue'
import { list, remove, fileList, fileRemove, batchDelete, fileBatchDelete } from '@/api/audit'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatTime } from '@/utils/time'
import { T } from '@/utils/i18n'
import { downBlob, jsonToCsv } from '@/utils/file'

function parseCreatedAtMs (v) {
  if (!v) return 0
  if (typeof v === 'number') return v * 1000 // backend usually seconds
  const iso = String(v).includes('T') ? String(v) : String(v).replace(' ', 'T')
  const ms = Date.parse(iso)
  return Number.isNaN(ms) ? 0 : ms
}

function inDateRange (createdAtMs, range) {
  if (!range || !range[0] || !range[1]) return true
  const start = Date.parse(range[0] + 'T00:00:00')
  const end = Date.parse(range[1] + 'T23:59:59')
  return createdAtMs >= start && createdAtMs <= end
}

function formatDuration (seconds) {
  const s = Math.max(0, Math.floor(seconds))
  const hh = String(Math.floor(s / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export function useRepositories () {
  const listRes = reactive({ list: [], total: 0, loading: false })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    peer_id: null,
    from_peer: null,
    date_range: null,      // ["YYYY-MM-DD","YYYY-MM-DD"]
    active_only: false,    // NEW
  })

  const totalSeconds = ref(0)

  // Cache of the currently filtered/sorted dataset (used for local pagination + ticking)
  const dataset = ref([])

  const buildApiParams = (override = {}) => ({
    page: override.page ?? listQuery.page,
    page_size: override.page_size ?? listQuery.page_size,
    peer_id: listQuery.peer_id || undefined,
    from_peer: listQuery.from_peer || undefined,
  })

  const getList = async () => {
    listRes.loading = true
    totalSeconds.value = 0

    const hasRange = Array.isArray(listQuery.date_range) && listQuery.date_range?.length === 2
    const useLocalFilter = hasRange || !!listQuery.active_only

    // For client-side filters (date range / active only), fetch a big page once and paginate locally
    const params = useLocalFilter
        ? buildApiParams({ page: 1, page_size: 1000000 })
        : buildApiParams()

    const res = await list(params).catch(() => false)
    listRes.loading = false
    if (!res) return

    let rows = (res.data.list || []).map((item) => {
      const createdAtMs = parseCreatedAtMs(item.created_at)
      const closeRawSec = item.close_time ? Number(item.close_time) : 0
      const active = !closeRawSec

      const endMs = closeRawSec ? closeRawSec * 1000 : Date.now()
      const durSec = createdAtMs ? Math.max(0, Math.floor((endMs - createdAtMs) / 1000)) : 0

      return {
        ...item,
        _created_at_ms: createdAtMs,
        _close_raw_sec: closeRawSec,
        _active: active,
        _duration_seconds: durSec,
        duration: formatDuration(durSec),
        close_time: closeRawSec ? formatTime(closeRawSec * 1000) : '-',
      }
    })

    // Client-side date range filter (by created_at)
    if (hasRange) {
      rows = rows.filter(r => inDateRange(r._created_at_ms, listQuery.date_range))
    }

    // Client-side active only filter
    if (listQuery.active_only) {
      rows = rows.filter(r => r._active)
    }

    // Active always on top, then newest ID
    rows.sort((a, b) => {
      if (a._active !== b._active) return a._active ? -1 : 1
      return (b.id || 0) - (a.id || 0)
    })

    dataset.value = rows
    totalSeconds.value = rows.reduce((acc, r) => acc + (r._duration_seconds || 0), 0)

    if (useLocalFilter) {
      // Local pagination
      listRes.total = rows.length
      const start = (listQuery.page - 1) * listQuery.page_size
      const end = start + listQuery.page_size
      listRes.list = rows.slice(start, end)
    } else {
      // Original server pagination behavior
      listRes.list = rows
      listRes.total = res.data.total
    }
  }

  const handlerQuery = () => {
    if (listQuery.page === 1) getList()
    else listQuery.page = 1
  }

  const del = async (row) => {
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('Delete') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(() => false)
    if (!cf) return false

    const res = await remove({ id: row.id }).catch(() => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const batchdel = async (rows) => {
    const ids = rows.map(r => r.id)
    if (!ids.length) {
      ElMessage.warning(T('PleaseSelectData'))
      return false
    }

    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('BatchDelete') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(() => false)
    if (!cf) return false

    const res = await batchDelete({ ids }).catch(() => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const toExport = async () => {
    const q = buildApiParams({ page: 1, page_size: 1000000 })
    const res = await list(q).catch(() => false)
    if (res) {
      const csv = jsonToCsv(res.data.list)
      downBlob(csv, 'connectLog.csv')
    }
  }

  // Smooth tick update for ACTIVE rows (no refetch)
  const tickActiveDurations = () => {
    const nowMs = Date.now()

    // Update whole dataset so totals stay correct even when locally paginated
    if (Array.isArray(dataset.value) && dataset.value.length) {
      let total = 0
      for (const r of dataset.value) {
        if (r?._created_at_ms) {
          const endMs = r._active ? nowMs : (r._close_raw_sec ? r._close_raw_sec * 1000 : nowMs)
          const durSec = Math.max(0, Math.floor((endMs - r._created_at_ms) / 1000))
          r._duration_seconds = durSec
          r.duration = formatDuration(durSec)
        }
        total += (r._duration_seconds || 0)
      }
      totalSeconds.value = total

      // Refresh current page view (keeps same object references)
      const hasRange = Array.isArray(listQuery.date_range) && listQuery.date_range?.length === 2
      const useLocalFilter = hasRange || !!listQuery.active_only
      if (useLocalFilter) {
        const start = (listQuery.page - 1) * listQuery.page_size
        const end = start + listQuery.page_size
        listRes.list = dataset.value.slice(start, end)
      } else {
        // Non-local mode: listRes.list already points to mapped objects; no need to slice
      }
      return
    }

    // Fallback: if dataset empty, update visible list only
    let total = 0
    for (const r of listRes.list) {
      if (r?._active && r?._created_at_ms) {
        const durSec = Math.max(0, Math.floor((nowMs - r._created_at_ms) / 1000))
        r._duration_seconds = durSec
        r.duration = formatDuration(durSec)
      }
      total += (r?._duration_seconds || 0)
    }
    totalSeconds.value = total
  }

  return {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
    batchdel,
    toExport,
    totalSeconds,
    tickActiveDurations,
  }
}

/* file repositories unchanged */
export function useFileRepositories () {
  const listRes = reactive({ list: [], total: 0, loading: false })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    peer_id: null,
    from_peer: null,
  })

  const getList = async () => {
    listRes.loading = true
    const res = await fileList(listQuery).catch(() => false)
    listRes.loading = false
    if (res) {
      listRes.list = res.data.list.map(item => {
        item.info = item.info ? JSON.parse(item.info) : '-'
        return item
      })
      listRes.total = res.data.total
    }
  }

  const handlerQuery = () => {
    if (listQuery.page === 1) getList()
    else listQuery.page = 1
  }

  const del = async (row) => {
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('Delete') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(() => false)
    if (!cf) return false

    const res = await fileRemove({ id: row.id }).catch(() => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const batchdel = async (rows) => {
    const ids = rows.map(r => r.id)
    if (!ids.length) {
      ElMessage.warning(T('PleaseSelectData'))
      return false
    }

    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('BatchDelete') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(() => false)
    if (!cf) return false

    const res = await fileBatchDelete({ ids }).catch(() => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const toExport = async () => {
    const q = { ...listQuery, page: 1, page_size: 1000000 }
    const res = await fileList(q).catch(() => false)
    if (res) {
      const csv = jsonToCsv(res.data.list)
      downBlob(csv, 'fileTransformLog.csv')
    }
  }

  return {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
    batchdel,
    toExport,
  }
}
