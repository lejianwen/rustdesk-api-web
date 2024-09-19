<template>
  <el-dialog v-model="visible" width="50%">
    <el-form ref="cpwd" :model="changePwdForm" :rules="chagePwdRules" label-width="120px" style="margin-top: 20px">
      <el-form-item label="旧密码" prop="old_password">
        <el-input v-model="changePwdForm.old_password" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input v-model="changePwdForm.new_password" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input v-model="changePwdForm.confirmPwd" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancelChangePwd">取消</el-button>
        <el-button type="primary" @click="changePassword">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>

  import { reactive, ref } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import { changeCurPwd } from '@/api/user'
  import { useUserStore } from '@/store/user'

  const props = defineProps({
    visible: Boolean,
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
