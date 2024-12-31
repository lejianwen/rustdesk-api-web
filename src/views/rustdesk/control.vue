<template>
  <div>
    <h2>此处功能为实验性质，更多说明请参考 <a target="_blank" href="https://github.com/lejianwen/rustdesk-api/wiki/Rustdesk-Command">WIKI</a></h2>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="80px">
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button type="danger" @click="toAdd">{{ T('Add') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">

      <el-table :data="listRes.list" v-loading="listRes.loading" border>
        <el-table-column prop="cmd" label="cmd" align="center"></el-table-column>
        <el-table-column prop="alias" label="alias" align="center"></el-table-column>
        <el-table-column prop="option" label="option" align="center"></el-table-column>
        <el-table-column prop="explain" label="explain" align="center"></el-table-column>
        <el-table-column label="actions" align="center">
          <template #default="{row}">
            <el-button type="success" @click="showCmd(row)">执行</el-button>
            <el-button v-if="row.id" type="primary" @click="toUpdate(row)">编辑</el-button>
            <el-button v-if="row.id" type="danger" @click="del(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="formVisible">
        <el-form label-width="150">
          <el-form-item label="cmd">
            <el-input v-model="formData.cmd"></el-input>
          </el-form-item>
          <el-form-item label="alias">
            <el-input v-model="formData.alias"></el-input>
          </el-form-item>
          <el-form-item label="option">
            <el-input v-model="formData.option"></el-input>
          </el-form-item>
          <el-form-item label="explain">
            <el-input v-model="formData.explain"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="发送指令" v-model="showCmdForm">
        <el-form label-width="300">
          <el-form-item label="cmd">
            <el-input v-model="customCmd.cmd"></el-input>
          </el-form-item>
          <el-form-item label="option">
            <el-input type="textarea" v-model="customCmd.option"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitCmd">发送</el-button>
          </el-form-item>
          <el-form-item label="执行结果">
            <el-input type="textarea" readonly disabled v-model="customCmd.res" rows="20"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>


<script setup>
  import { list, sendCmd, remove, create, update } from '@/api/rustdesk'
  import { onMounted, reactive, ref } from 'vue'
  import { T } from '@/utils/i18n'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
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
  onMounted(getList)
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
  const formData = reactive({
    cmd: '',
    alias: '',
    option: '',
    explain: '',
  })
  const formVisible = ref(false)
  const toAdd = () => {
    formVisible.value = true
    formData.cmd = ''
    formData.alias = ''
    formData.option = ''
    formData.explain = ''
  }
  const toUpdate = (row) => {
    formVisible.value = true
    formData.id = row.id
    formData.cmd = row.cmd
    formData.alias = row.alias
    formData.option = row.option
    formData.explain = row.explain
  }
  const submit = async () => {
    if (!formData.cmd) {
      ElMessage.error(T('ParamRequired', { param: 'cmd' }))
      return
    }
    const api = formData.id ? update : create
    const res = await api(formData).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      formVisible.value = false
      getList()
    }
  }
  const cancel = () => {
    formVisible.value = false
  }

  const showCmdForm = ref(false)
  const customCmd = reactive({
    cmd: '',
    option: '',
    res: '',
  })
  const showCmd = (row) => {
    showCmdForm.value = true
    customCmd.cmd = row.cmd
    customCmd.option = ''
    customCmd.res = ''
  }
  const submitCmd = async () => {
    sendCmd(customCmd).then(res => {
      console.log(res)
      customCmd.res = res.data
    })
  }

</script>

<style scoped lang="scss">

</style>
