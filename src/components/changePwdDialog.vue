<template>
  <el-dialog v-model="v" width="50%" :show-close="false">
    <el-form ref="cpwd" :model="changePwdForm" :rules="chagePwdRules" label-width="150px" label-position="left" style="margin-top: 20px">
      <el-form-item :label="T('OldPassword')" prop="old_password">
        <el-input v-model="changePwdForm.old_password" :placeholder="T('For OIDC login without a password, enter any 4-20 letters')" show-password></el-input>
      </el-form-item>
      <el-form-item :label="T('NewPassword')" prop="new_password">
        <el-input v-model="changePwdForm.new_password" show-password></el-input>
      </el-form-item>
      <el-form-item :label="T('ConfirmPassword')" prop="confirmPwd">
        <el-input v-model="changePwdForm.confirmPwd" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancelChangePwd">{{ T('Cancel') }}</el-button>
        <el-button type="primary" @click="changePassword">{{ T('Confirm') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>

  import { computed, reactive, ref } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import { changeCurPwd } from '@/api/user'
  import { useUserStore } from '@/store/user'
  import { T } from '@/utils/i18n'

  const props = defineProps({
    visible: Boolean,
  })
  const v = computed({
    get: () => props.visible,
    set: (val) => {
      emit('update:visible', val)
    },
  })
  const emit = defineEmits(['update:visible'])

  // Watch for changes to the prop and emit an event if necessary
  // watch(() => props.visible, (newVal) => {
  //   emit('update:visible', newVal);
  // });
  const showChangePwd = () => {
    emit('update:visible', true)
    changePwdForm.old_password = ''
    changePwdForm.new_password = ''
    changePwdForm.confirmPwd = ''
  }
  const changePwdForm = reactive({
    old_password: '',
    new_password: '',
    confirmPwd: '',
  })
  const chagePwdRules = reactive({
    old_password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    new_password: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value === changePwdForm.old_password) {
            callback(new Error('新密码不能与旧密码相同'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
      }],
    confirmPwd: [
      { required: true, message: '请再次输入新密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== changePwdForm.new_password) {
            callback(new Error('两次输入密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
      },
    ],
  })
  const cpwd = ref(null)
  const cancelChangePwd = () => {
    emit('update:visible', false)
  }

  const userStore = useUserStore()

  const changePassword = async () => {
    //验证
    const valid = await cpwd.value.validate().catch(_ => false)
    if (!valid) {
      return
    }
    console.log('changePassword')
    const confirm = await ElMessageBox.confirm('确定修改密码么？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).catch(_ => false)
    if (!confirm) {
      return
    }
    const res = await changeCurPwd(changePwdForm).catch(_ => false)
    if (!res) {
      return
    }
    ElMessageBox.alert('修改成功', '修改密码', {
      autofocus: true,
      confirmButtonText: 'OK',
      callback: (action) => {
        userStore.logout()
        window.location.reload()
      },
    })
  }
</script>

<style scoped lang="scss">

</style>
