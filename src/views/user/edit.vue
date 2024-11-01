<template>
  <div class="form-card">
    <el-form ref="root" label-width="120px" :model="form" :rules="rules">
      <el-form-item :label="T('Username')" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item :label="T('Email')" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item :label="T('Nickname')" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item :label="T('Group')" prop="group_id">
        <el-select v-model="form.group_id">
          <el-option
              v-for="item in groupsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="T('IsAdmin')" prop="is_admin">
        <el-switch v-model="form.is_admin"
                   :active-value="true"
                   :inactive-value="false"
        ></el-switch>
      </el-form-item>
      <el-form-item :label="T('Status')" prop="status">
        <el-switch v-model="form.status"
                   :active-value="ENABLE_STATUS"
                   :inactive-value="DISABLE_STATUS"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">{{ T('Cancel') }}</el-button>
        <el-button @click="submit" type="primary">{{ T('Submit') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { useRoute } from 'vue-router'
  import { useGetDetail, useSubmit } from '@/views/user/composables/edit'
  import { ENABLE_STATUS, DISABLE_STATUS } from '@/utils/common_options'
  import { T } from '@/utils/i18n'

  const route = useRoute()
  const { form, item, getDetail, groupsList } = useGetDetail(route.params.id)

  const { root, rules, validate, submit, cancel } = useSubmit(form, route.params.id)

</script>

<style lang="scss" scoped>
.form-card {
}
</style>
