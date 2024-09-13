<template>
  <el-sub-menu v-if="route.children&&route.children.filter(c=>!c.meta?.hide).length>1&&route.children.some(r => !r.meta?.hide)"
               :key="route.name"
               :index="route.name"
  >
    <template #title>
      <el-icon v-if="route.meta?.icon">
        <component :is="`el-icon-${route.meta.icon}`"></component>
      </el-icon>
      <span>{{route.meta?.title||route.name}}</span>
    </template>
    <menu-item v-for="(_route,_index) in route.children"
               :route="_route"
               :key="_route.name">
    </menu-item>
  </el-sub-menu>
  <el-menu-item v-else-if="!parseRoute(route).meta?.hide" :route="parseRoute(route)" :index="parseRoute(route).name">
    <el-icon v-if="parseRoute(route).meta?.icon">
      <component :is="`el-icon-${parseRoute(route).meta.icon}`"></component>
    </el-icon>
    <span>{{parseRoute(route).meta?.title||parseRoute(route).name}}</span>
  </el-menu-item>
</template>

<script>
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'MenuItem',
    props: {
      route: {},
    },
    mounted () {
    },
    setup (props) {
      //判断仅有一个子项的route
      const parseRoute = (route) => {
        if (route.children && route.children.filter(c => !c.meta?.hide).length === 1) {
          return route.children.filter(c => !c.meta?.hide)[0]
        } else {
          return route
        }
      }
      return {
        parseRoute,
      }
    },
  })
</script>

<style lang="scss" scoped>
</style>
