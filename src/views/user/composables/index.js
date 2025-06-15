import { reactive } from 'vue'
import { list, remove, changePwd } from '@/api/user'
import { list as groups } from '@/api/group'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { T } from '@/utils/i18n'
import { downBlob, jsonToCsv } from '@/utils/file'

export function useRepositories () {

  const listRes = reactive({
    list: [], total: 0, loading: false,
    groups: [],
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
    username: '',
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
      //由watch 触发
    }
  }

  const getGroups = async () => {
    const res = await groups({ page_size: 9999 }).catch(_ => false)
    if (res) {
      listRes.groups = res.data.list
    }
  }

  const toExport = async () => {
    const q = { ...listQuery }
    q.page_size = 1000000
    q.page = 1
    const res = await list(q).catch(_ => false)
    if (res) {
      const csv = jsonToCsv(res.data.list)
      downBlob(csv, 'users.csv')
    }
  }
  return {
    listRes,
    listQuery,
    handlerQuery,
    getList,
    getGroups,
    toExport,
  }
}

export function useToEditOrAdd () {
  const router = useRouter()
  const toEdit = (row) => {
    router.push('/user/edit/' + row.id)
  }
  const toAdd = () => {
    router.push('/user/add')
  }
  const toTag = (row) => {
    router.push('/user/tag/?user_id=' + row.id)
  }
  const toAddressBook = (row) => {
    router.push('/user/addressBook/?user_id=' + row.id)
  }
  return {
    toAdd,
    toEdit,
    toTag,
    toAddressBook,
  }
}

export function useDel () {
  const del = async (id) => {
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('Delete') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return false
    }

    const res = remove({ id }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
    }
    return res
  }
  return {
    del,
  }
}

export function useChangePwd () {
  const changePass = async (admin) => {
    const input = await ElMessageBox.prompt(T('PleaseInputNewPassword'), T('ResetPassword'), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
    }).catch(_ => false)
    if (!input) {
      return
    }
    const confirm = await ElMessageBox.confirm(T('Confirm?', { param: T('ResetPassword') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
    }).catch(_ => false)
    if (!confirm) {
      return
    }
    const res = await changePwd({ id: admin.id, password: input.value }).catch(_ => false)
    if (!res) {
      return
    }
    ElMessage.success(T('OperationSuccess'))
  }

  return { changePass }
}
