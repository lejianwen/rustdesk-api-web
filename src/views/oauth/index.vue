<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="60px">
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">筛选</el-button>
          <el-button type="danger" @click="toAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <el-table :data="listRes.list" v-loading="listRes.loading" border>
        <el-table-column prop="id" label="id" align="center"/>
        <el-table-column prop="op" label="名称" align="center"/>
        <el-table-column prop="auto_register" label="自动注册" align="center"/>
        <el-table-column prop="created_at" label="创建时间" align="center"/>
        <el-table-column prop="updated_at" label="更新时间" align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="{row}">
            <el-button @click="toEdit(row)">编辑</el-button>
            <el-button type="danger" @click="del(row)">删除</el-button>
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
    <el-dialog v-model="formVisible" :title="!formData.id?'创建':'修改'" width="800">
      <el-form class="dialog-form" ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="ClientId" prop="client_id">
          <el-input v-model="formData.client_id"></el-input>
        </el-form-item>
        <el-form-item label="ClientSecret" prop="client_secret">
          <el-input v-model="formData.client_secret"></el-input>
        </el-form-item>
        <el-form-item label="RedirectUrl" prop="redirect_url">
          <el-input v-model="formData.redirect_url"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="op" >
          <el-radio-group v-model="formData.op" :disabled="!!formData.id">
            <el-radio v-for="item in ops" :key="item.value" :label="item.value" style="display: block">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自动注册" prop="open_auto_register">
          <el-switch v-model="formData.auto_register"
                     :active-value="true"
                     :inactive-value="false"
          ></el-switch>
          <div style="display: block;margin-left: 10px">如果开启,当用户使用oauth登录而没绑定时,会自动注册一个账号</div>
        </el-form-item>
        <el-form-item>
          <el-button @click="formVisible = false">取消</el-button>
          <el-button @click="submit" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
  import { onMounted, reactive, watch, ref, onActivated } from 'vue'
  import { list, create, update, detail, remove } from '@/api/oauth'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
  })
  const ops = [
    { value: 'github', label: 'Github' },
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
    const cf = await ElMessageBox.confirm('确定删除么?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return false
    }

    const res = await remove({ id: row.id }).catch(_ => false)
    if (res) {
      ElMessage.success('操作成功')
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
    client_id: '',
    client_secret: '',
    redirect_url: '',
    auto_register: false,
  })
  const rules = {
    client_id: [{ required: true, message: '请输入ClientId', trigger: 'blur' }],
    client_secret: [{ required: true, message: '请输入ClientSecret', trigger: 'blur' }],
    redirect_url: [{ required: true, message: '请输入RedirectUrl', trigger: 'blur' }],
    op: [{ required: true, message: '请选择类型', trigger: 'blur' }],
  }
  const toEdit = (row) => {
    formVisible.value = true
    formData.id = row.id
    formData.op = row.op
    formData.client_id = row.client_id
    formData.client_secret = row.client_secret
    formData.redirect_url = row.redirect_url
    formData.auto_register = row.auto_register

  }
  const toAdd = () => {
    formVisible.value = true
    formData.id = 0
    formData.op = ''
    formData.client_id = ''
    formData.client_secret = ''
    formData.redirect_url = ''
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
      ElMessage.success('操作成功')
      formVisible.value = false
      getList()
    }
  }

</script>

<style scoped lang="scss">

</style>
