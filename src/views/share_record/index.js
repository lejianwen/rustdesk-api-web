import { reactive, ref } from 'vue'
import { batchDelete as admin_batchDelete, list as admin_list, remove as admin_remove } from '@/api/share_record'
import { batchDelete as my_batchDelete, list as my_list, remove as my_remove } from '@/api/my/share_record'
import { ElMessage, ElMessageBox } from 'element-plus'
import { T } from '@/utils/i18n'

const apis = {
  admin: { batchDelete: admin_batchDelete, list: admin_list, remove: admin_remove },
  my: { batchDelete: my_batchDelete, list: my_list, remove: my_remove },
}

export function useRepositories (api_type = 'my') {
  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
  })

  const getList = async () => {
    listRes.loading = true
    const res = await apis[api_type].list(listQuery).catch(_ => false)
    listRes.loading = false
    if (res) {
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

  const multipleSelection = ref([])
  const toBatchDelete = async () => {
    if (multipleSelection.value.length === 0) {
      return
    }

    const ids = multipleSelection.value.map(r => r.id)
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

  const expired = (row) => {
    if (row.expire === 0) {
      return false
    }
    const now = new Date().getTime()
    const created_at = new Date(row.created_at).getTime()
    return row.expire * 1000 + created_at < now
  }

  return {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
    multipleSelection,
    toBatchDelete,
    expired,
  }
}
