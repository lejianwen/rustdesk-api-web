import { reactive } from 'vue'
import { list, remove } from '@/api/login_log'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'

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
    const cf = await ElMessageBox.confirm('确定删除么?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return false
    }

    const res = await remove({ id: row.id }).catch(_ => false)
    if (res) {
      ElMessage.success('操作成功')
      getList()
    }
  }

  return {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
  }
}
