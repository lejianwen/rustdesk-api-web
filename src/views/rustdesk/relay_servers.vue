<template>
  <el-card class="simple-card" shadow="hover" v-loading="form.loading">
    <template #header>
      <div class="card-header">
        <span>RELAY_SERVERS</span>
      </div>
    </template>
    <el-form :disabled="!canSend">
      <el-form-item>
        <el-input v-model="form.option"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="get">{{ T('Refresh') }}</el-button>
        <el-button @click="save" type="primary">{{ T('Save') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup>

  import { T } from '@/utils/i18n'
  import { reactive, watch } from 'vue'
  import { sendCmd } from '@/api/rustdesk'
  import { ElMessage } from 'element-plus'
  import { ID_TARGET } from '@/views/rustdesk/options'

  const props = defineProps({
    canSend: Boolean,
  })


  const form = reactive({
    cmd: 'rs',
    option: '',
    target: ID_TARGET,
    loading: false,
  })
  const get = async () => {
    form.loading = true
    const res = await sendCmd({ cmd: 'rs', target: ID_TARGET }).catch(_ => false)
    form.loading = false
    if (res) {
      const data = res.data.split('\n').filter(i => i)
      form.option = data.join(',')
    }
  }
  const save = async () => {
    const res = await sendCmd(form).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
    }
  }
  watch(() => props.canSend, (v) => {
    if (v) {
      get()
    }
  })
  //为了在设置always_use_relay之后自动重新保存，防止被重置
  defineExpose({
    save,
  });
</script>
<style scoped lang="scss">

</style>
