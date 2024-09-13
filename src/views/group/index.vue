<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="60px">
        <!--        <el-form-item label="名称">
                  <el-input v-model="listQuery.name"></el-input>
                </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">筛选</el-button>
          <el-button type="danger" @click="toAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <el-table :data="listRes.list" v-loading="listRes.loading" border>
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" align="center"/>
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
      <el-form class="dialog-form" ref="form" :model="formData" label-width="120px">
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" required>
          <el-radio-group v-model="formData.type">
            <el-radio v-for="item in groupTypes" :key="item.value" :label="item.value" style="display: block">
              {{ item.label }}
            <span style="font-size: 12px;color: #999">{{item.note}}</span>
            </el-radio>
          </el-radio-group>
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
  import { list, create, update, detail, remove } from '@/api/group'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
  })

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

  const groupTypes = [
    { label: '普通组', value: 1, note: '只有管理员能看到小组成员和成员地址簿' },
    { label: '共享组', value: 2, note: '所有用户都能看到小组成员和成员地址簿' },
  ]
  const formVisible = ref(false)
  const formData = reactive({
    id: 0,
    name: '',
    type: 1
  })

  const toEdit = (row) => {
    formVisible.value = true
    formData.id = row.id
    formData.name = row.name
    formData.type = row.type
  }
  const toAdd = () => {
    formVisible.value = true
    formData.id = 0
    formData.name = ''
    formData.type = 1
  }
  const submit = async () => {
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
