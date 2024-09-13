<template>
  <el-form-item ref="formAddress" :label="label" :prop="prop">
    <el-select v-model="currentProvince" clearable placeholder="省" @change="changeProvince">
      <el-option v-for="(_, name) in pca" :key="name" :label="name" :value="name"/>
    </el-select>
    <el-select v-model="currentCity" clearable placeholder="市" @change="changeCity">
      <el-option v-for="(_, name) in cities" :key="name" :label="name" :value="name"/>
    </el-select>
    <el-select v-model="currentCounty" clearable placeholder="区" @change="changeCounty">
      <el-option v-for="item in counties" :key="item" :label="item" :value="item"/>
    </el-select>
  </el-form-item>
</template>

<script>
  import { defineComponent, ref, computed } from 'vue'
  import pca from '@/utils/pca.json'

  export default defineComponent({
    name: 'FormAddress',
    props: {
      prop: {
        type: String,
        default: '',
      },
      label: {
        type: String,
        default: '省/市/区',
      },
      province: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        default: '',
      },
      county: {
        type: String,
        default: '',
      },
    },
    setup (props, context) {
      const cities = computed(() => pca[props.province] || [])
      const counties = computed(() => pca[props.province] && pca[props.province][props.city] ? pca[props.province][props.city] : [])

      let currentProvince = computed({
        get: () => props.province,
        set: (val) => {
          context.emit('update:province', val)
        },
      })
      let currentCity = computed({
        get: () => props.city,
        set: (val) => {
          context.emit('update:city', val)
        },
      })
      let currentCounty = computed({
        get: () => props.county,
        set: (val) => {
          context.emit('update:county', val)
        },
      })

      const changeProvince = (val) => {
        currentCity = ''
        currentCounty = ''
        context.emit('changeProvince', val)
      }
      const changeCity = (val) => {
        currentCounty = ''
        context.emit('changeCity', val)
      }
      const changeCounty = (val) => {
        context.emit('changeCounty', val)
      }

      return {
        pca,
        cities,
        counties,

        currentProvince,
        currentCity,
        currentCounty,

        changeProvince,
        changeCity,
        changeCounty,
      }
    },

  })
</script>

<style scoped>

</style>
