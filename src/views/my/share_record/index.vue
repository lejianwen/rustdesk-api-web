<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="80px">
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button type="danger" @click="toBatchDelete">{{ T('BatchDelete') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <el-table :data="listRes.list" v-loading="listRes.loading" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50"/>
        <el-table-column prop="id" label="ID" align="center" width="100"/>
        <el-table-column prop="peer_id" :label="T('Peer')" align="center"/>
        <el-table-column prop="created_at" :label="T('CreatedAt')" align="center"/>
        <el-table-column :label="`${T('ExpireTime')} (${T('Second')})`" prop="expire" align="center">
          <template #default="{row}">
            <el-tag :type="expired(row)?'info':'success'">{{ row.expire ? row.expire : T('Forever') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="T('Actions')" align="center" width="400">
          <template #default="{row}">
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
  </div>
</template>

<script setup>
  import { onActivated, onMounted, watch } from 'vue'
  import { T } from '@/utils/i18n'
  import { useRepositories } from '@/views/share_record'

  const {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
    multipleSelection,
    toBatchDelete,
    expired,
  } = useRepositories('my')

  onMounted(getList)
  onActivated(getList)

  watch(() => listQuery.page, getList)

  watch(() => listQuery.page_size, handlerQuery)
  const handleSelectionChange = (val) => {
    multipleSelection.value = val
  }


</script>

<style scoped lang="scss">
.list-query .el-select {
  --el-select-width: 160px;
}


</style>
