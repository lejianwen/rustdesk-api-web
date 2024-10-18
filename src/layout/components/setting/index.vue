<template>
  <div class="setting">
    <div class="menu-item">
      <el-button size="small" @click="changeLang" style="width: 100px">{{ T('ChangeLang') }}</el-button>
    </div>
    <div class="menu-item">
        <el-switch
            v-model="isDark"
            style="--el-switch-on-color:#18222c"
            >
          <template #active-action>
           <el-icon><Moon/></el-icon>
          </template>
          <template #inactive-action>
            <el-icon ><Sunny color="#000"/></el-icon>
          </template>
        </el-switch>
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
  import { useDark } from "@vueuse/core"
  import {Sunny, Moon} from '@element-plus/icons'

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
  const isDark = useDark();
  // const toggleDark = useToggle(isDark)
</script>

<style lang="scss" scoped>
.setting {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .menu-item {
    margin-left: 10px;
  }
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
