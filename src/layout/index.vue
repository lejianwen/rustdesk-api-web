<template>
  <el-container>
    <el-aside :width="leftWidth" class="app-left">
      <g-aside></g-aside>
    </el-aside>
    <el-container class="app-container ">
      <el-header class="app-header">
        <g-header></g-header>
      </el-header>
      <div class="header-tags">
        <tags></tags>
      </div>

      <el-main class="app-main">
        <router-view v-slot="{ Component }">
          <transition mode="out-in" name="el-fade-in-linear">
            <keep-alive :include="[...cachedTags]">
              <component :is="Component"/>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import { useUserStore } from '@/store/user'
  import { useRouteStore } from '@/store/router'
  import { useAppStore } from '@/store/app'
  import { useTagsStore } from '@/store/tags'
  import LayerHeader from '@/layout/components/header.vue'
  import { defineComponent, ref, onMounted, watch, reactive, computed, toRef } from 'vue'
  import Tags from '@/layout/components/tags/index.vue'
  import GAside from '@/layout/components/aside.vue'
  import GHeader from '@/layout/components/header.vue'

  export default defineComponent({
    name: 'Layout',
    components: { LayerHeader, Tags, GAside, GHeader },
    setup (props) {
      const userStore = useUserStore()
      const appStore = useAppStore()
      const tagStore = useTagsStore()

      const leftWidth = computed(() => appStore.setting.sideIsCollapse ? '64px' : '210px')

      const cachedTags = ref([])

      cachedTags.value = tagStore.cached

      return {
        cachedTags,
        leftWidth,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .app-header {
    background-color: #3f454b;
    color: var(--basicWhite);
    display: flex;
    height: 50px;
  }

  .header-tags {
    height: auto;
    border-bottom: 1px solid #eee;
    display: flex;
    padding: 0;
  }

  .app-left {
    height: 100%;
    transition: width 0.5s;
  }

  .app-container {
    min-height: 100vh;
  }
</style>


