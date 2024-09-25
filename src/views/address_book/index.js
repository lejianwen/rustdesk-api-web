import { reactive, ref } from 'vue'
import { create, list, remove, update } from '@/api/address_book'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { T } from '@/utils/i18n'

export function useRepositories () {
  const route = useRoute()
  const user_id = route.query?.user_id

  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    is_my: 0,
    user_id: user_id ? parseInt(user_id) : null,
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

    const res = await remove({ row_id: row.row_id }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const platformList = [
    { label: 'Windows', value: 'Windows' },
    { label: 'Linux', value: 'Linux' },
    { label: 'Mac OS', value: 'Mac OS' },
    { label: 'Android', value: 'Android' },
  ]
  const formVisible = ref(false)
  const formData = reactive({
    'row_id': 0,
    'alias': '',
    'forceAlwaysRelay': false,
    'hash': '',
    'hostname': '',
    'id': '',
    'loginName': '',
    'online': false,
    'password': '',
    'platform': '',
    'rdpPort': '',
    'rdpUsername': '',
    'sameServer': false,
    'tags': [],
    'user_id': null,
    'username': '',
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
    //重置formData
    formData.row_id = 0
    formData.alias = ''
    formData.forceAlwaysRelay = false
    formData.hash = ''
    formData.hostname = ''
    formData.id = ''
    formData.loginName = ''
    formData.online = false
    formData.password = ''
    formData.platform = ''
    formData.rdpPort = ''
    formData.rdpUsername = ''
    formData.sameServer = false
    formData.tags = []
    formData.user_id = null
    formData.username = ''

  }
  const submit = async () => {
    const api = formData.row_id ? update : create
    const res = await api(formData).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      formVisible.value = false
      getList()
    }
  }

  return {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
    platformList,
    formVisible,
    formData,
    toEdit,
    toAdd,
    submit,
  }
}
