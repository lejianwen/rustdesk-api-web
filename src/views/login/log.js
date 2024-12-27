import { reactive, ref } from 'vue'
import { list as admin_fetchPeers } from '@/api/peer'
import { list as my_fetchPeers } from '@/api/my/peer'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { T } from '@/utils/i18n'
import { batchDelete as admin_batchDelete, list as admin_list, remove as admin_remove } from '@/api/login_log'
import { batchDelete as my_batchDelete, list as my_list, remove as my_remove } from '@/api/my/login_log'

const apis = {
  admin: { batchDelete: admin_batchDelete, list: admin_list, remove: admin_remove, fetchPeers: admin_fetchPeers },
  my: { batchDelete: my_batchDelete, list: my_list, remove: my_remove, fetchPeers: my_fetchPeers },
}

export function useRepositories (api_type = 'my') {

  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    is_my: 0,
    user_id: null,
  })

  const getList = async () => {
    listRes.loading = true
    const res = await apis[api_type].list(listQuery).catch(_ => false)
    listRes.loading = false
    if (res) {
      const uuids = res.data.list.filter(item => item.uuid).map(item => item.uuid)
      const peers = await apis[api_type].fetchPeers({ uuids }).catch(_ => false)
      if (peers?.data?.list) {
        res.data.list.forEach(item => {
          if (item.uuid) {
            item.peer = peers.data.list.find(peer => peer.uuid === item.uuid)
          }
        })
      }
      listRes.list = res.data.list
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

    const res = await apis[api_type].remove({ id: row.id }).catch(_ => false)
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

    const res = await apis[api_type].batchDelete({ ids }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  return {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
    batchdel,
  }
}
