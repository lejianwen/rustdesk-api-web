import { reactive } from 'vue'
import { list, remove, fileList, fileRemove, batchDelete, fileBatchDelete } from '@/api/audit'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatTime } from '@/utils/time'
import { T } from '@/utils/i18n'
import { downBlob, jsonToCsv } from '@/utils/file'

function parseToMs (v) {
  if (v === null || v === undefined || v === '') return 0

  // numbers: seconds or milliseconds
  if (typeof v === 'number') {
    if (v > 1e12) return v // ms
    if (v > 1e9) return v * 1000 // sec
    return 0
  }

  // strings:
  if (typeof v === 'string') {
    // "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
    const s = v.includes('T') ? v : v.replace(' ', 'T')
    const ms = new Date(s).getTime()
    return Number.isFinite(ms) ? ms : 0
  }

  return 0
}

function formatDurationMs (ms) {
  if (!ms || ms < 0) return '-'
  const totalSec = Math.floor(ms / 1000)
  const hh = Math.floor(totalSec / 3600)
  const mm = Math.floor((totalSec % 3600) / 60)
  const ss = totalSec % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`
}

export function useRepositories () {
  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    peer_id: null,
    from_peer: null,
  })

  const getList = async () => {
    listRes.loading = true
    const res = await list(listQuery).catch(_ => false)
    listRes.loading = false
    if (res) {
      const mapped = res.data.list.map(item => {
        // keep raw timestamps for duration/active sorting
        const createdMs = parseToMs(item.created_at)
        const closeMs = item.close_time ? (Number(item.close_time) * 1000) : 0

        item._created_ms = createdMs
        item._close_ms = closeMs
        item._active = !closeMs

        // keep original UI behavior
        item.close_time = item.close_time ? formatTime(item.close_time * 1000) : '-'

        // duration (active -> now)
        const endMs = closeMs || Date.now()
        item.duration = createdMs ? formatDurationMs(endMs - createdMs) : '-'

        return item
      })

      // Active always on top; within group newest first (id desc)
      mapped.sort((a, b) => {
        if (a._active !== b._active) return a._active ? -1 : 1
        return (b.id || 0) - (a.id || 0)
      })

      listRes.list = mapped
      listRes.total = res.data.total
    }
  }

  const handlerQuery = () => {
    if (listQuery.page === 1) {
      getList()
    } else {
      listQuery.page = 1
    }
  }

  const del = async (row) => {
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('Delete') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return false
    }

    const res = await remove({ id: row.id }).catch(_ => false)
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
    }).catch(_ => false)
    if (!cf) {
      return false
    }

    const res = await batchDelete({ ids }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const toExport = async () => {
    const q = { ...listQuery }
    q.page_size = 1000000
    q.page = 1
    const res = await list(q).catch(_ => false)
    if (res) {
      const csv = jsonToCsv(res.data.list)
      downBlob(csv, 'connectLog.csv')
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

/* file repositories unchanged */
export function useFileRepositories () {
  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    peer_id: null,
    from_peer: null,
  })

  const getList = async () => {
    listRes.loading = true
    const res = await fileList(listQuery).catch(_ => false)
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
    if (listQuery.page === 1) {
      getList()
    } else {
      listQuery.page = 1
    }
  }

  const del = async (row) => {
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('Delete') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return false
    }

    const res = await fileRemove({ id: row.id }).catch(_ => false)
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
    }).catch(_ => false)
    if (!cf) {
      return false
    }

    const res = await fileBatchDelete({ ids }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const toExport = async () => {
    const q = { ...listQuery }
    q.page_size = 1000000
    q.page = 1
    const res = await fileList(q).catch(_ => false)
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
