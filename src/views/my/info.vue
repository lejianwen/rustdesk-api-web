<template>
  <div>
    <el-card title="个人信息">
      <el-form class="info-form" ref="form" label-width="120px" label-suffix="：">
        <el-form-item label="用户名">
          <div>{{ userStore.username }}</div>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-button type="danger" @click="showChangePwd">修改密码</el-button>
        </el-form-item>
        <el-form-item label="OIDC">
          <el-table :data="oidcData" border fit>
            <el-table-column label="平台" prop="third_type" align="center"></el-table-column>
            <el-table-column label="状态" prop="status" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.status === 1" type="success">已绑定</el-tag>
                <el-tag v-else type="danger">未绑定</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template #default="{ row }">
                <el-button v-if="row.status === 1" type="danger" size="small" @click="toUnBind(row)">解除绑定</el-button>
                <el-button v-else type="success" size="small" @click="toBind(row)">去绑定</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-card>
    <changePwdDialog v-model:visible="changePwdVisible"></changePwdDialog>
  </div>
</template>

<script setup>
  import changePwdDialog from '@/components/changePwdDialog.vue'
  import { ref } from 'vue'
  import { useUserStore } from '@/store/user'
  import { bind, unbind } from '@/api/oauth'
  import { myOauth } from '@/api/user'
  import { ElMessageBox } from 'element-plus'

  const userStore = useUserStore()
  const changePwdVisible = ref(false)
  const showChangePwd = () => {
    changePwdVisible.value = true
  }
  const oidcData = ref([])
  const getMyOauth = async () => {
    const res = await myOauth().catch(_ => false)
    if (res) {
      oidcData.value = res.data
    }

  }
  getMyOauth()
  const toBind = async (row) => {
    const res = await bind({ op: row.third_type }).catch(_ => false)
    if (res) {
      const { code, url } = res.data
      window.open(url)
    }
  }
  const toUnBind = async (row) => {
    const cf = await ElMessageBox.confirm('确定解除绑定么?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return false
    }
    const res = await unbind({ op: row.third_type }).catch(_ => false)
    if (res) {
      getMyOauth()
    }

  }
</script>

<style scoped lang="scss">
.info-form {
  width: 600px;
  margin: 0 auto;

}
</style>
