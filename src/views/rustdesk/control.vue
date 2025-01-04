<template>
  <div>
    <h4 v-html="T('ServerCmdTips', {wiki: '<a target=\'_blank\' href=\'https://github.com/lejianwen/rustdesk-api/wiki/Rustdesk-Command\'>WIKI</a>'})"></h4>
    <h5>
      <span>ID {{ T('Status') }}: </span>
      <el-tag v-if="canSendIdServerCmd" type="success">{{ T('Available') }}</el-tag>
      <el-tag v-else type="danger">{{ T('NotAvailable') }}</el-tag>
      <el-button size="small" type="text" @click="refreshCanSendIdServerCmd">{{ T('Refresh') }}</el-button>
    </h5>
    <h5>
      <span>RELAY {{ T('Status') }}: </span>
      <el-tag v-if="canSendRelayServerCmd" type="success">{{ T('Available') }}</el-tag>
      <el-tag v-else type="danger">{{ T('NotAvailable') }}</el-tag>
      <el-button size="small" type="text" @click="refreshCanSendRelayServerCmd">{{ T('Refresh') }}</el-button>
    </h5>
    <el-tabs
        v-model="activeName"
        type="card"
    >
      <el-tab-pane :label="T('Simple')" name="Simple">
        <el-space>
          <el-card class="simple-card" shadow="hover" v-loading="rsForm.loading">
            <template #header>
              <div class="card-header">
                <span>RELAY_SERVERS</span>
              </div>
            </template>
            <el-form :disabled="!canSendCmd(rsForm.target)">
              <el-form-item>
                <el-input v-model="rsForm.option"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="getRS">{{ T('Refresh') }}</el-button>
                <el-button @click="saveRS" type="primary">{{ T('Save') }}</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="simple-card" shadow="hover" v-loading="aurForm.loading">
            <template #header>
              <div class="card-header">
                <span>ALWAYS_USE_RELAY</span>
              </div>
            </template>
            <el-form :disabled="!canSendCmd(aurForm.target)">
              <el-form-item>
                <el-switch v-model="aurForm.option" active-value="Y" inactive-value="N"></el-switch>
              </el-form-item>
              <el-form-item>
                <el-button @click="getAUR">{{ T('Refresh') }}</el-button>
                <el-button @click="saveAUR" type="primary">{{ T('Save') }}</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <blocklist :can-send="canSendCmd(RELAY_TARGET)"></blocklist>
          <blacklist :can-send="canSendCmd(RELAY_TARGET)"></blacklist>
        </el-space>


      </el-tab-pane>
      <el-tab-pane :label="T('Advanced')" name="Advanced">
        <el-card class="list-query" shadow="hover">
          <el-form inline label-width="80px">
            <el-form-item>
              <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
              <el-button type="danger" @click="toAdd">{{ T('Add') }}</el-button>
              <el-button type="success" :disabled="!canSendIdServerCmd" @click="showCmd({cmd:'',option:''})">{{ T('Send') }}</el-button>
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
                <el-button type="success" :disabled="!canSendCmd(row.target)" @click="showCmd(row)">{{ T('Send') }}</el-button>
                <el-button v-if="row.id" type="primary" @click="toUpdate(row)">{{ T('Edit') }}</el-button>
                <el-button v-if="row.id" type="danger" @click="del(row)">{{ T('Delete') }}</el-button>
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
              <el-form-item label="target">
                <el-radio-group v-model="formData.target">
                  <el-radio label="id_server" value="21115"></el-radio>
                  <el-radio label="relay_server" value="21117"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="explain">
                <el-input v-model="formData.explain"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit">{{ T('Submit') }}</el-button>
                <el-button @click="cancel">{{ T('Cancel') }}</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-dialog :title="T('SendCmd')" v-model="showCmdForm">
            <el-form label-width="150" :disabled="!canSendCmd(customCmd.target)">
              <el-form-item label="cmd">
                <el-input v-model="customCmd.cmd"></el-input>
              </el-form-item>
              <el-form-item label="option">
                <el-input v-model="customCmd.option"></el-input>
                <el-text v-if="customCmd.example.trim()" style="margin-top: 5px">Example:
                  <el-text type="primary">{{ customCmd.example }}</el-text>
                </el-text>
              </el-form-item>
              <!--              <el-form-item label="target">
                              <el-radio-group v-model="customCmd.target">
                                <el-radio label="id_server" value="21115"></el-radio>
                                <el-radio label="relay_server" value="21117"></el-radio>
                              </el-radio-group>
                            </el-form-item>-->
              <el-form-item>
                <el-button type="primary" @click="submitCmd">{{ T('Send') }}</el-button>
              </el-form-item>
              <el-form-item :label="T('Result')">
                <el-input type="textarea" readonly disabled v-model="customCmd.res" rows="15"></el-input>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-card>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>


<script setup>
  import { list, sendCmd, remove, create, update } from '@/api/rustdesk'
  import { onMounted, reactive, ref } from 'vue'
  import { T } from '@/utils/i18n'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import blocklist from '@/views/rustdesk/blocklist.vue'
  import blacklist from '@/views/rustdesk/blacklist.vue'

  const ID_TARGET = '21115'
  const RELAY_TARGET = '21117'
  const activeName = ref('Simple')

  const canSendIdServerCmd = ref(false)
  const checkCanSendIdServerCmd = async () => {
    const res = await sendCmd({ cmd: 'h', target: ID_TARGET }).catch(_ => false)
    canSendIdServerCmd.value = !!res.data
  }
  const refreshCanSendIdServerCmd = () => {
    checkCanSendIdServerCmd().then(_ => {
      if (canSendIdServerCmd.value) {
        getAUR()
        getRS()
      }
    })
  }
  onMounted(refreshCanSendIdServerCmd)

  const canSendRelayServerCmd = ref(false)
  const checkCanSendRelayServerCmd = async () => {
    const res = await sendCmd({ cmd: 'h', target: RELAY_TARGET }).catch(_ => false)
    canSendRelayServerCmd.value = !!res.data
  }
  const refreshCanSendRelayServerCmd = () => {
    checkCanSendRelayServerCmd().then(_ => {
      if (canSendRelayServerCmd.value) {
      }
    })
  }
  onMounted(refreshCanSendRelayServerCmd)

  const canSendCmd = (target) => {
    if (target === ID_TARGET) {
      return canSendIdServerCmd.value
    }
    if (target === RELAY_TARGET) {
      return canSendRelayServerCmd.value
    }
    return false
  }

  const rsForm = reactive({
    cmd: 'rs',
    option: '',
    target: ID_TARGET,
    loading: false,
  })
  const getRS = async () => {
    rsForm.loading = true
    const res = await sendCmd({ cmd: 'rs', target: ID_TARGET }).catch(_ => false)
    rsForm.loading = false
    if (res) {
      const data = res.data.split('\n').filter(i => i)
      rsForm.option = data.join(',')
    }
  }
  const saveRS = async () => {
    const res = await sendCmd(rsForm).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
    }
  }

  const aurForm = reactive({
    cmd: 'aur',
    option: '',
    target: ID_TARGET,
    value: 0,
    loading: false,
  })
  const getAUR = async () => {
    aurForm.loading = true
    const res = await sendCmd({ cmd: 'aur', target: ID_TARGET }).catch(_ => false)
    aurForm.loading = false
    if (res) {
      if (res.data === 'ALWAYS_USE_RELAY: true' || res.data === 'ALWAYS_USE_RELAY: true\n') {
        aurForm.option = 'Y'
      } else {
        aurForm.option = 'N'
      }
    }
  }
  const saveAUR = async () => {
    const res = await sendCmd(aurForm).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
    }
  }

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
    target: '',
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
    formData.target = row.target
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
    target: '',
    res: '',
    example: '',
  })
  const showCmd = (row) => {
    showCmdForm.value = true
    customCmd.cmd = row.cmd
    customCmd.option = ''
    customCmd.res = ''
    customCmd.target = row.target
    customCmd.example = `${row.cmd} ${row.option}`
  }
  const submitCmd = async () => {
    sendCmd(customCmd).then(res => {
      console.log(res)
      customCmd.res = res.data
      ElMessage.success(T('OperationSuccess'))
    })
  }

</script>

<style scoped lang="scss">
.simple-card {
  width: 300px;
  margin: 10px;
  min-height: 300px;
}
</style>
