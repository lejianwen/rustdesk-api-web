import { reactive, ref, watch } from 'vue'
import { create, list, remove, update } from '@/api/address_book'
import { ElMessage, ElMessageBox } from 'element-plus'
import { T } from '@/utils/i18n'
import { useRepositories as useCollectionRepositories } from '@/views/address_book/collection'
import { useRepositories as useTagRepositories } from '@/views/tag/index'
import { loadAllUsers } from '@/global'

export function useRepositories (is_my = 0) {

  const { allUsers, getAllUsers } = loadAllUsers()

  const {
    listRes: collectionListRes,
    listQuery: collectionListQuery,
    getList: getCollectionList,
  } = useCollectionRepositories(is_my)
  collectionListQuery.page_size = 9999
  const {
    listRes: tagListRes,
    listQuery: tagListQuery,
    getList: getTagList,
  } = useTagRepositories(is_my)
  tagListQuery.page_size = 9999

  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    is_my,
    id: null,
    user_id: null,
    username: null,
    hostname: null,
    collection_id: null,
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
    { label: 'Windows', value: 'Windows', icon: 'windows' },
    { label: 'Linux', value: 'Linux', icon: 'linux' },
    { label: 'Mac OS', value: 'Mac OS', icon: 'mac' },
    { label: 'Android', value: 'Android', icon: 'android' },
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
    user_ids: [],
    'username': '',
    collection_id: null,
  })

  const toEdit = (row) => {
    formVisible.value = true
    //将row中的数据赋值给formData
    Object.keys(formData).forEach(key => {
      formData[key] = row[key]
    })
    collectionListQuery.user_id = row.user_id
    getCollectionList()
    tagListQuery.collection_id = row.collection_id
    getTagList()

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
  const shareToWebClientVisible = ref(false)
  const shareToWebClientForm = reactive({
    id: '',
    hash: '',
  })
  const toShowShare = (row) => {
    shareToWebClientForm.id = row.id
    shareToWebClientForm.hash = row.hash
    shareToWebClientVisible.value = true
  }

  const changeQueryUser = async (val) => {
    tagListRes.list = []
    listQuery.collection_id = null
    if (!val) {
      collectionListRes.list = []
    } else {
      collectionListQuery.user_id = val
      getCollectionList()
    }
  }
  const changeUser = async (val) => {
    tagListRes.list = []
    formData.tags = []
    formData.collection_id = 0
    if (!val) {
      collectionListRes.list = []
    } else {
      collectionListQuery.user_id = val
      getCollectionList()
    }
  }
  const changeCollection = async (val) => {
    tagListRes.list = []
    formData.tags = []
    tagListQuery.user_id = formData.user_id
    tagListQuery.collection_id = val
    getTagList()
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
    shareToWebClientVisible,
    shareToWebClientForm,
    toShowShare,

    collectionListQuery,
    getCollectionList,
    collectionListRes,

    tagListQuery,
    getTagList,
    tagListRes,

    allUsers,
    getAllUsers,

    changeQueryUser,
    changeUser,
    changeCollection,
  }
}
