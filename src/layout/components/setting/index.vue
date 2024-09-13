<template>
  <div class="setting">
    <el-dropdown class="menu-item">
      <div class="title">
        <!--        <el-image class="avatar" :src="user.avatar"></el-image>-->
        <span class="nickname">{{ user.username }}</span>
        <el-icon>
          <el-icon-arrow-down/>
        </el-icon>
      </div>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="showChangePwd">修改密码</el-dropdown-item>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dialog v-model="changePwdVisible" width="50%">
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
          <el-button @click="changePwdVisible=false">取消</el-button>
          <el-button type="primary" @click="changePassword">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
  import { useUserStore } from '@/store/user'
  import { changeCurPwd } from '@/api/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { reactive, ref } from 'vue'

  const userStore = useUserStore()
  const user = userStore

  const logout = () => {
    userStore.logout()
    window.location.reload()
  }

  const changePwdVisible = ref(false)
  const showChangePwd = () => {
    changePwdVisible.value = true
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
        logout()
      },
    })
  }
</script>

<style lang="scss" scoped>
.setting {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .title {
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .nickname {
      padding: 0 10px;
    }
  }
}
</style>
