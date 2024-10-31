<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="80px">
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button type="danger" @click="toAdd">{{ T('Add') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <el-table :data="listRes.list" v-loading="listRes.loading" border>
        <el-table-column prop="id" label="ID" align="center"/>
        <el-table-column prop="op" :label="T('Platform')" align="center"/>
        <el-table-column prop="auto_register" :label="T('AutoRegister')" align="center"/>
        <el-table-column prop="created_at" :label="T('CreatedAt')" align="center"/>
        <el-table-column prop="updated_at" :label="T('UpdatedAt')" align="center"/>
        <el-table-column :label="T('Actions')" align="center">
          <template #default="{row}">
            <el-button @click="toEdit(row)">{{ T('Edit') }}</el-button>
            <el-button type="danger" @click="del(row)">{{ T('Delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="list-page" shadow="hover">
      <el-pagination background
                     layout="prev, pager, next, sizes, jumper"
                     :page-sizes="[10,20,50,100]"
                     v-model:page-size="listQuery.page_size"
                     v-model:current-page="listQuery.page"
                     :total="listRes.total">
      </el-pagination>
    </el-card>
    <el-dialog v-model="formVisible" :title="!formData.id?T('Create') :T('Update')" width="800">
      <el-form class="dialog-form" ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="Type" prop="op">
          <el-radio-group v-model="formData.op" :disabled="!!formData.id">
            <el-radio v-for="item in ops" :key="item.value" :value="item.value" style="display: block">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.op === 'oidc'" label="Issuer" prop="issuer">
          <el-input v-model="formData.issuer" :placeholder="`${T('Check your IdP docs, without')} '/.well-known/openid-configuration'`"></el-input>
        </el-form-item>
        <el-form-item v-show="formData.op === 'oidc'" label="Scopes" prop="scopes">
          <el-input v-model="formData.scopes" :placeholder="`${T('Optional, default is')} 'openid,profile,email'`" ></el-input>
        </el-form-item>
        <el-form-item label="ClientId" prop="client_id">
          <el-input v-model="formData.client_id"></el-input>
        </el-form-item>
        <el-form-item label="ClientSecret" prop="client_secret">
          <el-input v-model="formData.client_secret"></el-input>
        </el-form-item>
        <el-form-item label="RedirectUrl" prop="redirect_url">
          <el-input v-model="formData.redirect_url"></el-input>
        </el-form-item>
        <el-form-item :label="T('AutoRegister')" prop="auto_register">
          <el-switch v-model="formData.auto_register"
                     :active-value="true"
                     :inactive-value="false"
          ></el-switch>
          <div style="display: block;margin-left: 10px">{{ T('AutoRegisterNote') }}</div>
        </el-form-item>
        <el-form-item>
          <el-button @click="formVisible = false">{{ T('Cancel') }}</el-button>
          <el-button @click="submit" type="primary">{{ T('Submit') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
  import { onMounted, reactive, watch, ref, onActivated } from 'vue'
  import { list, create, update, detail, remove } from '@/api/oauth'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { T } from '@/utils/i18n'

  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
  })
  const ops = [
    { value: 'github', label: 'Github' },
    { value: 'google', label: 'Google' },
    { value: 'oidc',   label: 'OIDC'   }
  ]
  const getList = async () => {
    listRes.loading = true
    const res = await list(listQuery).catch(_ => false)
    listRes.loading = false
    if (res) {
      listRes.list = res.data.list
      listRes.total = res.data.total
    }
  }
  const handlerQuery = () => {
    if (listQuery.page === 1) {
      getList()
    } else {
      listQuery.page = 1
    }
  }

  const del = async (row) => {
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('Delete') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return false
    }

    const res = await remove({ id: row.id }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }
  onMounted(getList)
  onActivated(getList)

  watch(() => listQuery.page, getList)

  watch(() => listQuery.page_size, handlerQuery)

  const formVisible = ref(false)
  const formData = reactive({
    id: 0,
    op: '',
    issuer: '',
    client_id: '',
    client_secret: '',
    redirect_url: '',
    scopes: '',
    auto_register: false,
  })
  const rules = {
    client_id: [{ required: true, message: T('ParamRequired', { param: 'client_id' }), trigger: 'blur' }],
    client_secret: [{ required: true, message: T('ParamRequired', { param: 'client_secret' }), trigger: 'blur' }],
    redirect_url: [{ required: true, message: T('ParamRequired', { param: 'redirect_url' }), trigger: 'blur' }],
    op: [{ required: true, message: T('ParamRequired', { param: 'op' }), trigger: 'blur' }],
    issuer: [{ required: true, message: T('ParamRequired', { param: 'issuer' }), trigger: 'blur' }],
  }
  const toEdit = (row) => {
    formVisible.value = true
    formData.id = row.id
    formData.op = row.op
    formData.issuer = row.issuer
    formData.client_id = row.client_id
    formData.client_secret = row.client_secret
    formData.redirect_url = row.redirect_url
    formData.scopes = row.scopes
    formData.auto_register = row.auto_register

  }
  const toAdd = () => {
    formVisible.value = true
    formData.id = 0
    formData.op = ''
    formData.issuer = ''
    formData.client_id = ''
    formData.client_secret = ''
    formData.redirect_url = ''
    formData.scopes = ''
    formData.auto_register = false
  }
  const form = ref(null)
  const submit = async () => {
    const v = await form.value.validate().catch(err => false)
    if (!v) {
      return
    }
    const api = formData.id ? update : create
    const res = await api(formData).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      formVisible.value = false
      getList()
    }
  }

</script>

<style scoped lang="scss">

</style>
