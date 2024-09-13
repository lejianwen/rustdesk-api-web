<template>
  <div class="form-card">
    <el-form ref="root" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="小组" prop="group_id">
        <el-select v-model="form.group_id" placeholder="请选择小组">
          <el-option
              v-for="item in groupsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否是管理员" prop="is_admin">
        <el-switch v-model="form.is_admin"
                   :active-value="true"
                   :inactive-value="false"
        ></el-switch>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="form.status"
                   :active-value="ENABLE_STATUS"
                   :inactive-value="DISABLE_STATUS"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button @click="submit" type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { defineComponent, toRef } from 'vue'
  import { useRoute } from 'vue-router'
  import { useGetDetail, useSubmit } from '@/views/user/composables/edit'
  import { ENABLE_STATUS, DISABLE_STATUS } from '@/utils/common_options'

  export default defineComponent({
    name: 'UserEdit',
    props: {},
    setup (props, context) {

      const route = useRoute()
      const { form, item, getDetail, groupsList } = useGetDetail(route.params.id)

      const { root, rules, validate, submit, cancel } = useSubmit(form, route.params.id)

      return {
        form,
        item,
        getDetail,

        rules,
        validate,
        root,
        submit,
        cancel,
        groupsList,
        ENABLE_STATUS, DISABLE_STATUS,
      }
    },
  })
</script>

<style lang="scss" scoped>
.form-card {
}
</style>
