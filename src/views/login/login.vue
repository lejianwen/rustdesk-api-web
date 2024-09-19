<template>
  <div class="login">
    <el-card class="login-card">
      <h1>登录</h1>
      <el-form label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" @keyup.enter.native="login" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue'
  import { useUserStore } from '@/store/user'
  import { ElMessage } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'

  export default defineComponent({
    setup (props) {
      const userStore = useUserStore()
      const route = useRoute()
      const router = useRouter()

      let platform = window.navigator.platform
      if (navigator.platform.indexOf('Mac') === 0) {
        platform = 'mac'
      } else if (navigator.platform.indexOf('Win') === 0) {
        platform = 'windows'
      } else if (navigator.platform.indexOf('Linux armv') === 0) {
        platform = 'android'
      } else if (navigator.platform.indexOf('Linux') === 0) {
        platform = 'linux'
      }

      const form = reactive({
        username: '',
        password: '',
        platform: platform,
      })
      const redirect = route.query?.redirect
      const login = async () => {
        const res = await userStore.login(form)
        if (res) {
          ElMessage.success('登录成功')
          router.push({ path: redirect || '/', replace: true })
        }
      }
      return {
        redirect,
        form,
        login,
      }
    },
  })
</script>

<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  background-color: #2d3a4b;
  padding-top: 25vh;
  box-sizing: border-box;

  .tips {
    font-size: 12px;
    color: #fff;
    margin-left: 60px;
  }

  .login-card {
    max-width: 500px;
    background-color: #283342;
    color: #fff;
    border: none;
    margin: 0 auto;

    .el-form-item {

      ::v-deep(.el-form-item__label) {
        color: #fff;
      }

      .el-input {

        ::v-deep(.el-input__wrapper) {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
        }

        ::v-deep(input) {
          color: #fff;
        }
      }
    }
  }
}
</style>
