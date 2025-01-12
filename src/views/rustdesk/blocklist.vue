<template>
  <el-card class="simple-card" shadow="hover" v-loading="form.loading">
    <template #header>
      <div class="card-header">
        <span>BLOCK_LIST</span>
      </div>
    </template>
    <el-form :disabled="!canSend">
      <el-form-item>
        <el-input type="textarea" :model-value="form.list.join('|')" :rows="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getList">{{ T('Refresh') }}</el-button>
        <el-button @click="showForm('add')" type="primary">{{ T('Add') }}</el-button>
        <el-button @click="showForm('delete')" type="danger">{{ T('Delete') }}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="form.form_visible" :title="form.form_type">
      <el-form label-width="100px">
        <el-form-item label="IP">
          <el-input v-model="form.form_input"></el-input>
          <div>多个IP以 | 分割</div>
          <div v-if="form.form_type==='delete'">, 全部填 <strong>all</strong></div>
        </el-form-item>
        <el-form-item>
          <el-button @click="form.form_visible=false">{{ T('Cancel') }}</el-button>
          <el-button @click="form.form_type === 'add' ? add() : remove()" type="primary">{{ T('Submit') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>
<script setup>

  import { T } from '@/utils/i18n'
  import { reactive, watch } from 'vue'
  import { sendCmd } from '@/api/rustdesk'
  import { ElMessage } from 'element-plus'
  import { RELAY_TARGET } from '@/views/rustdesk/options'

  const props = defineProps({
    canSend: Boolean,
  })

  const form = reactive({
    get_cmd: 'blocklist',
    add_cmd: 'blocklist-add',
    remove_cmd: 'blocklist-remove',
    list: [],
    target: RELAY_TARGET,
    loading: false,
    form_visible: false,
    form_input: '',
    form_type: '',
  })
  const getList = async () => {
    form.loading = true
    const res = await sendCmd({ cmd: form.get_cmd, target: RELAY_TARGET }).catch(_ => false)
    form.loading = false
    if (res) {
      form.list = res.data.split('\n').filter(i => i)
    }
  }
  const showForm = (type) => {
    form.form_visible = true
    form.form_input = ''
    form.form_type = type
  }
  const add = async () => {
    const res = await sendCmd({ cmd: form.add_cmd, option: form.form_input, target: RELAY_TARGET }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }
  const remove = async () => {
    const res = await sendCmd({ cmd: form.remove_cmd, option: form.form_input, target: RELAY_TARGET }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }
  watch(() => props.canSend, (v) => {
    if (v) {
      getList()
    }
  })


</script>
<style scoped lang="scss">

</style>
