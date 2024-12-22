<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="80px">
        <el-form-item :label="T('User')">
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
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button type="danger" @click="toBatchDelete">{{ T('BatchDelete') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <el-table :data="listRes.list" v-loading="listRes.loading" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50"/>
        <el-table-column prop="id" label="id" align="center" width="100"/>
        <el-table-column :label="T('Owner')" align="center">
          <template #default="{row}">
            <span v-if="row.user_id"> <el-tag>{{ allUsers?.find(u => u.id === row.user_id)?.username }}</el-tag> </span>
          </template>
        </el-table-column>
        <el-table-column :label="T('Token')" align="center">
          <template #default="{row}">
            <span> {{ maskToken(row.token) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="T('CreatedAt')" align="center"/>
        <el-table-column :label="T('ExpireTime')" prop="expired_at" align="center">
          <template #default="{row}">
            <el-tag :type="expired(row)?'info':'success'">{{ row.expired_at ? new Date(row.expired_at * 1000).toLocaleString() : '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="T('Actions')" align="center" width="400">
          <template #default="{row}">
            <el-button type="danger" @click="del(row)">{{ T('Logout') }}</el-button>
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
  import { onActivated, onMounted, ref, watch } from 'vue'
  import { loadAllUsers } from '@/global'
  import { useRepositories } from '@/views/user/token.js'
  import { T } from '@/utils/i18n'

  const { allUsers, getAllUsers } = loadAllUsers()
  getAllUsers()

  const {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
    batchDelete,
  } = useRepositories()

  onMounted(getList)
  onActivated(getList)

  watch(() => listQuery.page, getList)

  watch(() => listQuery.page_size, handlerQuery)
  const maskToken = (token) => {
    return token.slice(0, 4) + '****' + token.slice(-4)
  }
  const expired = (row) => {
    const now = new Date().getTime()
    return row.expired_at * 1000 < now
  }

  const multipleSelection = ref([])
  const handleSelectionChange = (val) => {
    multipleSelection.value = val
  }
  const toBatchDelete = () => {
    if (multipleSelection.value.length === 0) {
      return
    }
    batchDelete(multipleSelection.value.map(v => v.id))
  }
</script>

<style scoped lang="scss">
.list-query .el-select {
  --el-select-width: 160px;
}


</style>
