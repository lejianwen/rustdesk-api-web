<template>
  <div class="login-container">
    <div class="login-card">
      <img src="@/assets/logo.png" alt="logo" class="login-logo" />

      <el-form label-position="top" class="login-form">
        <el-form-item :label="T('Username')">
          <el-input v-model="form.username" class="login-input"></el-input>
        </el-form-item>

        <el-form-item :label="T('Password')">
          <el-input v-model="form.password" type="password" @keyup.enter.native="login" show-password
            class="login-input"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="login" type="primary" class="login-button">{{ T('Login') }}</el-button>
          <el-button v-if="allowRegister" @click="register" class="login-button">{{ T('Register') }}</el-button>
        </el-form-item>
      </el-form>

      <div class="divider" v-if="options.length > 0">
        <span>{{ T('or login in with') }}</span>
      </div>

      <div class="oidc-options">
        <div v-for="(option, index) in options" :key="index" class="oidc-option">
          <el-button @click="handleOIDCLogin(option.name)" class="oidc-btn">
            <img :src="getProviderImage(option.name)" alt="provider" class="oidc-icon" />
            <span>{{ T(option.name) }}</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus';
import { T } from '@/utils/i18n';
import { useRoute, useRouter } from 'vue-router';
import { loginOptions } from '@/api/login';
import { getCode, removeCode } from '@/utils/auth'

const oauthInfo = ref({})
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const options = reactive([]); // 存储 OIDC 登录选项

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
const userAgent = navigator.userAgent;
let browser = 'Unknown Browser';
if (/chrome|crios/i.test(userAgent)) browser = 'Chrome';
else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
else if (/edg/i.test(userAgent)) browser = 'Edge';

const form = reactive({
  username: '',
  password: '',
  platform: platform,
})

const redirect = route.query?.redirect
const login = async () => {
  const res = await userStore.login(form)
  if (res) {
    ElMessage.success(T('LoginSuccess'))
    router.push({ path: redirect || '/', replace: true })
  }
}

const handleOIDCLogin = (provider) => {
  userStore.oidc(provider, platform, browser)
};

import googleImage from '@/assets/google.png';
import githubImage from '@/assets/github.png';
import oidcImage from '@/assets/oidc.png';
import webauthImage from '@/assets/webauth.png';
import defaultImage from '@/assets/oidc.png';

const providerImageMap = {
  google: googleImage,
  github: githubImage,
  oidc: oidcImage,
  // WebAuth: webauthImage,
  default: defaultImage,
};

const getProviderImage = (provider) => {
  return providerImageMap[provider.toLowerCase()] || providerImageMap.default;
};

const allowRegister = ref(false)
const loadLoginOptions = async () => {
  try {
    const res = await loginOptions().catch(_ => false);
    if(!res || !res.data) return console.error('No valid response received');
    res.data.ops.map(option => (options.push({ name: option }))); // 创建新的对象数组
    allowRegister.value = res.data.register
  } catch (error) {
    console.error('Error loading login options:', error.message);
  }
};

onMounted(async () => {
  const code = getCode();
  if (code) {
    // 如果code存在，进行query获取user info
    const res = await userStore.query(code)
    if (res) {
      // 删除code，确保跳转之前对code进行清楚
      removeCode()
      ElMessage.success(T('LoginSuccess'))
      router.push({ path: redirect || '/', replace: true })
    }
  } else {
    // 如果code不存在, 现实登陆页面
    loadLoginOptions(); // 组件挂载后调用登录选项加载函数
  }
});

const register = () => {
  router.push('/register')
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2d3a4b;
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  width: 360px;
  background-color: #283342;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.login-form {
  margin-bottom: 20px;
}

.login-input {
  width: 100%;
}

.login-button {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  margin-left: 0;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  font-size: 14px;
  color: #888;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #ddd;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
}

.oidc-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.oidc-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 50px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: black;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.oidc-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: block;
}

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
</style>
