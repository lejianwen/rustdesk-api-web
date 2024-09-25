import { onActivated, onMounted, reactive, ref, watch } from 'vue'
import { create, list, remove, update } from '@/api/tag'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { T } from '@/utils/i18n'

export function useRepositories () {
  //获取query
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

  const flutterColor2rgba = (color) => {
    // color 是十进制的数字,先转成16进制
    let hex = color.toString(16)
    console.log('hex', hex)
    //前两位是透明度
    let alpha = hex.slice(0, 2)
    //后六位是颜色
    let rgba = hex.slice(2)
    return `rgba(${parseInt(rgba.slice(0, 2), 16)}, ${parseInt(rgba.slice(2, 4), 16)}, ${parseInt(rgba.slice(4, 6), 16)}, ${parseInt(alpha, 16) / 255})`
  }

  const rgba2flutterColor = (color) => {
    console.log('color', color)
    //rgba(133, 33, 33, 0.81)
    let rgba = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(\.\d+)?)\)/)
    console.log('rgba', rgba)
    let alpha = Math.round(parseFloat(rgba[4]) * 255).toString(16)
    let r = parseInt(rgba[1]).toString(16)
    let g = parseInt(rgba[2]).toString(16)
    let b = parseInt(rgba[3]).toString(16)
    //如果是1位要补位
    if (alpha.length === 1) {
      alpha = '0' + alpha
    }
    if (r.length === 1) {
      r = '0' + r
    }
    if (g.length === 1) {
      g = '0' + g
    }
    if (b.length === 1) {
      b = '0' + b
    }
    return parseInt(alpha + r + g + b, 16)
  }

  const getList = async () => {
    listRes.loading = true
    const res = await list(listQuery).catch(_ => false)
    listRes.loading = false
    if (res) {
      listRes.list = res.data.list.map(item => {
        item.color = flutterColor2rgba(item.color)
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

    const res = await remove({ id: row.id }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }
  onMounted(getList)
  onActivated(getList)

  watch(() => listQuery.page, getList)

  watch(() => listQuery.page_size, handlerQuery)

  const formVisible = ref(false)
  const formData = reactive({
    id: 0,
    name: '',
    color: 0,
    user_id: 0,
  })
  const currentColor = ref('')
  const activeChange = (c) => {
    console.log(c)
    currentColor.value = c
  }
  const toEdit = (row) => {
    console.log('row', row)
    formVisible.value = true
    formData.id = row.id
    formData.name = row.name
    formData.color = row.color
    formData.user_id = row.user_id
  }
  const toAdd = () => {
    formVisible.value = true
    formData.id = 0
    formData.name = ''
    formData.color = 0
    formData.user_id = 0
  }
  const submit = async () => {
    console.log(formData)
    const api = formData.id ? update : create
    const data = {
      ...formData,
      color: rgba2flutterColor(formData.color),
    }
    console.log(data)
    const res = await api(data).catch(_ => false)
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
    formVisible,
    formData,
    toEdit,
    toAdd,
    submit,
    activeChange,
    currentColor,
  }
}
