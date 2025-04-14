import { computed, reactive, ref } from 'vue'
import { list as admin_list, create as admin_create, update as admin_update, remove as admin_remove } from '@/api/address_book_collection_rule'
import { list as my_list, create as my_create, update as my_update, remove as my_remove } from '@/api/my/address_book_collection_rule'
import { groupUsers } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { T } from '@/utils/i18n'

const apis = {
  admin: { list: admin_list, remove: admin_remove, update: admin_update, create: admin_create },
  my: { list: my_list, remove: my_remove, create: my_create, update: my_update },
}

export function useRepositories (api_type = 'my') {
  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    collection_id: null,
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

  const rules = computed(_ => [
    { label: T('Read'), value: 1 },
    { label: T('ReadWrite'), value: 2 },
    { label: T('FullControl'), value: 3 },
  ])
  const TYPE_U = 1
  const TYPE_G = 2
  const types = computed(_ => [
    { label: T('Group'), value: TYPE_G },
    { label: T('User'), value: TYPE_U },
  ])
  const formVisible = ref(false)
  const formData = reactive({
    id: 0,
    collection_id: null,
    type: TYPE_U,
    rule: 1,
    g_id: null,
    u_id: null,
    to_id: null,
    user_id: null,
  })

  const toEdit = (row) => {
    formVisible.value = true
    //将row中的数据赋值给formData
    Object.keys(formData).forEach(key => {
      formData[key] = row[key]
    })
    if (row.type === TYPE_U) {
      formData.u_id = row.to_id
      formData.g_id = users.value.find(u => u.id === row.to_id)?.group_id
    } else {
      formData.g_id = row.to_id
      formData.u_id = null
    }
  }
  const toAdd = () => {
    //初始化formData
    formData.id = 0
    formData.type = TYPE_U
    formData.rule = 1
    formData.g_id = null
    formData.u_id = null

    formVisible.value = true

  }
  const submit = async () => {
    const api = formData.id ? apis[api_type].update : apis[api_type].create
    const form = {
      ...formData,
    }
    form.to_id = form.type === TYPE_G ? form.g_id : form.u_id
    const res = await api(form).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      formVisible.value = false
      getList()
    }
  }
  const groups = ref([])
  const users = ref([])
  const getGroupUsers = async () => {
    const res = await groupUsers().catch(_ => false)
    if (res) {
      groups.value = res.data.groups.map(item => {
        if (!item.children) {
          item.children = []
        }
        res.data.users.map(u => {
          if (item.id === u.group_id) {
            item.children.push(u)
          }
        })
        return item
      })
      users.value = res.data.users
    }
  }
  const changeGId = () => {
    formData.u_id = null
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
    types,
    groups,
    users,
    getGroupUsers,
    TYPE_G,
    TYPE_U,
    changeGId,
  }
}
