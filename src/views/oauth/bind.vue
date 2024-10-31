<template>
  <div class="oauth">
    <el-card class="card">
      <h2>{{ T('OauthBinding') }}</h2>
      <el-form class="info" label-width="100px">
        <el-form-item :label="T('Op')">
          <div class="impt">{{ oauthInfo.op }}</div>
        </el-form-item>
        <el-form-item :label="T('ThirdName')">
          <div class="impt">{{ oauthInfo.third_name }}</div>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button style="width: 100%" v-if="!resStatus" type="success" size="large" @click="toConfirm">{{ T('Bind') }}</el-button>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button style="width: 100%" size="large" @click="out">{{ T('Close') }}</el-button>
        </el-form-item>
      </el-form>
      {{ T('OauthCloseNote') }}
    </el-card>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { info, confirm, bindConfirm } from '@/api/oauth'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { T } from '@/utils/i18n'

  const oauthInfo = ref({})
  const route = useRoute()
  const router = useRouter()
  const code = route.params?.code
  if (!code) {
    router.push('/')
  }
  const getInfo = async () => {
    const res = await info({ code }).catch(_ => false)
    if (res) {
      oauthInfo.value = res.data
    } else {
      router.push('/')
    }
  }
  getInfo()
  const resStatus = ref(0)
  const toConfirm = async () => {
    const res = await bindConfirm({ code }).catch(_ => false)
    if (res) {
      resStatus.value = 1
      if (res.data.device_type === 'webadmin') {
        ElMessage.success(T('OperationSuccess'))
        //后台登录
        router.push('/')
      } else {
        ElMessage.success(T('OperationSuccessAndCloseAfter3Seconds'))
        setTimeout(_ => {
          out()
        }, 3000)
      }

    }
  }
  const out = () => {
    window.close()
  }
</script>

<style scoped lang="scss">
.oauth {
  width: 100vw;
  height: 100vh;
  background-color: #2d3a4b;
  padding-top: 25vh;
  box-sizing: border-box;

  .card {
    max-width: 500px;
    background-color: #283342;
    color: #fff;
    border: none;
    margin: 0 auto;
    text-align: center;

    .info {
      display: block;
      line-height: 30px;
      margin-bottom: 50px;

      ::v-deep(.el-form-item__label) {
        color: #fff;
      }
    }

    .impt {
      font-weight: bold;
      font-size: 20px;
    }
  }
}
</style>
