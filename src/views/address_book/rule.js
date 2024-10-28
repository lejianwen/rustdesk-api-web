import { computed, reactive, ref } from 'vue'
import { create, list, remove, update } from '@/api/address_book_collection_rule'
import { groupUsers } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { T } from '@/utils/i18n'
import collection from '@element-plus/icons/lib/Collection'

export function useRepositories (is_my) {
  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    collection_id: null,
    is_my,
  })

  const getList = async () => {
    listRes.loading = true
    const res = await list(listQuery).catch(_ => false)
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

    const res = await remove({ id: row.id }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const rules = computed(_ => [
    { label: T('Read'), value: 1 },
    { label: T('ReadWrite'), value: 2 },
    { label: T('FullControl'), value: 3 },
  ])

  const formVisible = ref(false)
  const formData = reactive({
    id: 0,
    collection_id: null,
    type: 1,
    rule: 1,
    to_id: null,
    user_id: null,
  })

  const toEdit = (row) => {
    formVisible.value = true
    //将row中的数据赋值给formData
    Object.keys(formData).forEach(key => {
      formData[key] = row[key]
    })

  }
  const toAdd = () => {
    formVisible.value = true

  }
  const submit = async () => {
    const api = formData.id ? update : create
    const res = await api(formData).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      formVisible.value = false
      getList()
    }
  }
  const groupUsersList = ref([])
  const getGroupUsers = async () => {
    const res = await groupUsers({ user_id: formData.user_id }).catch(_ => false)
    if (res) {
      groupUsersList.value = res.data
    }
  }
  return {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
    formVisible,
    formData,
    toEdit,
    toAdd,
    submit,
    rules,
    groupUsersList,
    getGroupUsers,
  }
}
