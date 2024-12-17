import { reactive, ref } from 'vue'
import { create as admin_create, list as admin_list, remove as admin_remove, update as admin_update } from '@/api/address_book'
import { batchUpdateTags, list as my_list, create as my_create, update as my_update, remove as my_remove } from '@/api/my/address_book'
import { ElMessage, ElMessageBox } from 'element-plus'
import { T } from '@/utils/i18n'
import { useRepositories as useCollectionRepositories } from '@/views/address_book/collection'
import { useRepositories as useTagRepositories } from '@/views/tag/index'
import { simpleData } from '@/api/peer'

const apis = {
  admin: { list: admin_list, remove: admin_remove, update: admin_update, create: admin_create },
  my: { list: my_list, remove: my_remove, create: my_create, update: my_update },
}

export function useRepositories (api_type = 'my') {
  const {
    listRes: collectionListRes,
    listQuery: collectionListQuery,
    getList: getCollectionList,
  } = useCollectionRepositories(api_type)
  collectionListQuery.page_size = 9999

  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    id: null,
    user_id: null,
    username: null,
    hostname: null,
    collection_id: null,
  })

  const getList = async () => {
    listRes.loading = true
    const res = await apis[api_type].list(listQuery).catch(_ => false)
    listRes.loading = false
    if (res) {
      const ids = res.data.list.map(item => item.id)
      if (ids.length) {
        const peer_data = await simpleData({ ids }).catch(_ => false)
        if (peer_data) {
          res.data.list.forEach(item => {
            const peer = peer_data.data.list.find(peer => peer.id === item.id)
            if (peer) {
              item.peer = peer
            }
          })
        }
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

    const res = await apis[api_type].remove({ row_id: row.row_id }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  //创建或者修改
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
  const {
    listRes: collectionListResForUpdate,
    listQuery: collectionListQueryForUpdate,
    getList: getCollectionListForUpdate,
  } = useCollectionRepositories(api_type)
  collectionListQueryForUpdate.page_size = 9999
  const {
    listRes: tagListRes,
    listQuery: tagListQuery,
    getList: getTagList,
  } = useTagRepositories(api_type)
  tagListQuery.page_size = 9999

  const toEdit = (row) => {
    formVisible.value = true
    //将row中的数据赋值给formData
    Object.keys(formData).forEach(key => {
      formData[key] = row[key]
    })
    collectionListQueryForUpdate.user_id = row.user_id
    tagListQuery.collection_id = row.collection_id
    getCollectionListForUpdate()
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
    const api = formData.row_id ? apis[api_type].update : apis[api_type].create
    const res = await api(formData).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      formVisible.value = false
      getList()
    }
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
  const changeUserForUpdate = async (val) => {
    tagListRes.list = []
    formData.tags = []
    formData.collection_id = 0
    if (!val) {
      collectionListResForUpdate.list = []
    } else {
      collectionListQueryForUpdate.user_id = val
      getCollectionListForUpdate()
    }
  }
  const changeCollectionForUpdate = async (val) => {
    tagListRes.list = []
    formData.tags = []
    tagListQuery.user_id = formData.user_id
    tagListQuery.collection_id = val
    getTagList()
  }

  const fromPeer = (peer) => {
    formData.id = peer.id
    formData.username = peer.username
    formData.hostname = peer.hostname
    //匹配os
    if (peer.os.indexOf('windows') !== -1) {
      formData.platform = platformList.find(item => item.label === 'Windows').value
    } else if (peer.os.indexOf('linux') !== -1) {
      formData.platform = platformList.find(item => item.label === 'Linux').value
    } else if (peer.os.indexOf('android') !== -1) {
      formData.platform = platformList.find(item => item.label === 'Android').value
    } else if (peer.os.indexOf('mac') !== -1) {
      formData.platform = platformList.find(item => item.label === 'Mac OS').value
    }
    formData.uuid = peer.uuid
  }

  return {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    collectionListQuery,
    getCollectionList,
    collectionListRes,
    changeQueryUser,

    platformList,

    del,

    formVisible,
    formData,
    toEdit,
    toAdd,
    submit,
    getCollectionListForUpdate,
    collectionListResForUpdate,
    changeUserForUpdate,
    changeCollectionForUpdate,
    tagListQuery,
    getTagList,
    tagListRes,

    fromPeer,
  }
}

export function useBatchUpdateTagsRepositories () {
  const {
    listRes: tagListRes,
    listQuery: tagListQuery,
    getList: getTagList,
  } = useTagRepositories('my')
  tagListQuery.page_size = 9999

  const visible = ref(false)
  const show = () => {
    if (formData.value.row_ids.length === 0) {
      ElMessage.warning(T('PleaseSelectData'))
      return
    }
    visible.value = true
  }
  const formData = ref({
    tags: [],
    row_ids: [],
  })
  const submit = async () => {
    if (formData.value.row_ids.length === 0) {
      ElMessage.warning(T('PleaseSelectData'))
      return false
    }
    if (formData.value.tags.length === 0) {
      ElMessage.warning(T('PleaseSelectData'))
      return false
    }
    const res = await batchUpdateTags(formData.value).catch(_ => false)
    if (res) {
      ElMessage.success(T('Success'))
      visible.value = false
      return true
    }
    return false
  }

  return {
    tagListQuery,
    getTagList,
    tagListRes,

    visible,
    formData,
    show,
    submit,
  }
}
