<template>
  <div class="setting">
    <div>
      <el-button size="small" @click="changeLang" style="width: 100px">{{ T('ChangeLang') }}</el-button>
    </div>
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
          <el-dropdown-item @click="showChangePwd">{{T('ChangePassword')}}</el-dropdown-item>
          <el-dropdown-item @click="logout">{{ T('Logout')}}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <changePwdDialog v-model:visible="changePwdVisible"></changePwdDialog>
  </div>
</template>

<script setup>
  import { useUserStore } from '@/store/user'
  import { useAppStore } from '@/store/app'
  import changePwdDialog from '@/components/changePwdDialog.vue'
  import { ref } from 'vue'
  import { T } from '@/utils/i18n'

  const userStore = useUserStore()
  const user = userStore
  const appStore = useAppStore()

  const logout = () => {
    userStore.logout()
    window.location.reload()
  }

  const changePwdVisible = ref(false)
  const showChangePwd = () => {
    changePwdVisible.value = true
  }
  const changeLang = () => {
    appStore.changeLang()
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
