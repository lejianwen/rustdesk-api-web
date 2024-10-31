<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="80px">
        <el-form-item label="用户">
          <el-select v-model="listQuery.user_id" clearable>
            <el-option
                v-for="item in allUsers"
                :key="item.id"
                :label="item.username"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">筛选</el-button>
          <el-button type="danger" @click="toAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <!--      <el-tag type="danger" style="margin-bottom: 10px">不建议在此操作地址簿，可能会造成数据不同步</el-tag>-->
      <el-table :data="listRes.list" v-loading="listRes.loading" border>
        <el-table-column prop="id" label="ID" align="center" width="100"/>
        <el-table-column label="所属用户" align="center" width="120">
          <template #default="{row}">
            <span v-if="row.user_id"> <el-tag>{{ allUsers?.find(u => u.id === row.user_id)?.username }}</el-tag> </span>
          </template>
        </el-table-column>
        <el-table-column prop="client" label="client" align="center" width="120"/>
        <el-table-column prop="uuid" label="uuid" align="center"/>
        <el-table-column prop="ip" label="ip" align="center" width="150"/>
        <el-table-column prop="type" label="type" align="center" width="100"/>
        <el-table-column prop="platform" label="platform" align="center" width="120"/>
        <el-table-column prop="created_at" label="时间" align="center"/>
        <el-table-column label="操作" align="center" width="400">
          <template #default="{row}">
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
  </div>
</template>

<script setup>
  import { onActivated, onMounted, watch } from 'vue'
  import { loadAllUsers } from '@/global'
  import { useRepositories } from '@/views/login/log.js'

  const { allUsers, getAllUsers } = loadAllUsers()
  getAllUsers()

  const {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
  } = useRepositories()

  onMounted(getList)
  onActivated(getList)

  watch(() => listQuery.page, getList)

  watch(() => listQuery.page_size, handlerQuery)

</script>

<style scoped lang="scss">
.list-query .el-select {
  --el-select-width: 160px;
}


</style>
