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
      <el-table :data="listRes.list" v-loading="listRes.loading" border size="small">
        <el-table-column prop="id" label="id" align="center"/>
        <el-table-column prop="cpu" label="cpu" align="center"/>
        <el-table-column prop="hostname" label="主机名" align="center"/>
        <el-table-column prop="memory" label="内存" align="center"/>
        <el-table-column prop="os" label="系统" align="center"/>
        <el-table-column prop="username" label="username" align="center"/>
        <el-table-column prop="uuid" label="uuid" align="center"/>
        <el-table-column prop="version" label="版本号" align="center"/>
        <el-table-column prop="created_at" label="创建时间" align="center"/>
        <el-table-column prop="updated_at" label="更新时间" align="center"/>
        <el-table-column label="操作" align="center" width="400">
          <template #default="{row}">
            <el-button type="success" @click="toWebClientLink(row)">Web-Client</el-button>
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
    <el-dialog v-model="formVisible" :title="!formData.row_id?'创建':'修改'" width="800">
      <el-form class="dialog-form" ref="form" :model="formData" label-width="120px">
        <el-form-item label="id" prop="id" required>
          <el-input v-model="formData.id"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="主机名" prop="hostname">
          <el-input v-model="formData.hostname"></el-input>
        </el-form-item>
        <el-form-item label="cpu" prop="cpu">
          <el-input v-model="formData.cpu"></el-input>
        </el-form-item>
        <el-form-item label="内存" prop="memory">
          <el-input v-model="formData.memory"></el-input>
        </el-form-item>
        <el-form-item label="系统" prop="os">
          <el-input v-model="formData.os"></el-input>
        </el-form-item>
        <el-form-item label="uuid" prop="uuid">
          <el-input v-model="formData.uuid"></el-input>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="formData.version"></el-input>
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
  import { onActivated, onMounted, reactive, ref, watch } from 'vue'
  import { create, list, remove, update } from '@/api/peer'
  import { list as fetchTagList } from '@/api/tag'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { loadAllUsers } from '@/global'
  import { toWebClientLink } from '@/utils/webclient'

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

    const res = await remove({ row_id: row.row_id }).catch(_ => false)
    if (res) {
      ElMessage.success('操作成功')
      getList()
    }
  }
  onMounted(getList)
  onActivated(getList)

  watch(() => listQuery.page, getList)

  watch(() => listQuery.page_size, handlerQuery)

  const platformList = [
    { label: 'Windows', value: 'Windows' },
    { label: 'Linux', value: 'Linux' },
    { label: 'Mac OS', value: 'Mac OS' },
    { label: 'Android', value: 'Android' },
  ]
  const formVisible = ref(false)
  const formData = reactive({
    row_id: 0,
    cpu: '',
    hostname: '',
    id: '',
    memory: '',
    os: '',
    username: '',
    uuid: '',
    version: '',
  })

  const toEdit = (row) => {
    formVisible.value = true
    //将row中的数据赋值给formData
    Object.keys(formData).forEach(key => {
      formData[key] = row[key]
    })
  }
  const toAdd = () => {
    formVisible.value = true
    //重置formData
    formData.row_id = 0
    formData.cpu = ''
    formData.hostname = ''
    formData.id = ''
    formData.memory = ''
    formData.os = ''
    formData.username = ''
    formData.uuid = ''
    formData.version = ''
  }
  const submit = async () => {
    const api = formData.row_id ? update : create
    const res = await api(formData).catch(_ => false)
    if (res) {
      ElMessage.success('操作成功')
      formVisible.value = false
      getList()
    }
  }

</script>

<style scoped lang="scss">
.list-query .el-select {
  --el-select-width: 160px;
}

.colors {
  display: flex;
  justify-content: center;
  align-items: center;

  .colorbox {
    width: 50px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    .dot {
      width: 10px;
      height: 10px;
      display: block;
      border-radius: 50%;
    }
  }

}

</style>
