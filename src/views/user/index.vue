<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model="listQuery.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">筛选</el-button>
          <el-button type="danger" @click="toAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <el-table :data="listRes.list" v-loading="listRes.loading" border>
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center"/>
        <el-table-column prop="nickname" label="昵称" align="center"/>
        <el-table-column label="所在小组" align="center">
          <template #default="{row}">
            <span v-if="row.group_id"> <el-tag>{{ listRes.groups?.find(g => g.id === row.group_id)?.name }} </el-tag> </span>
            <span v-else> 未分组 </span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" align="center"/>
        <el-table-column prop="updated_at" label="更新时间" align="center"/>
        <el-table-column label="操作" align="center" width="550">
          <template #default="{row}">
            <el-button @click="toTag(row)">他的标签</el-button>
            <el-button @click="toAddressBook(row)">他的地址簿</el-button>
            <el-button @click="toEdit(row)">编辑</el-button>
            <el-button type="warning" @click="changePass(row)">重置密码</el-button>
            <el-button type="danger" @click="remove(row)">删除</el-button>
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
  import { useRepositories, useDel, useToEditOrAdd, useChangePwd } from '@/views/user/composables'

  //列表
  const {
    listRes,
    listQuery,
    handlerQuery,
    getList,
  } = useRepositories()

  const { toEdit, toAdd, toAddressBook, toTag } = useToEditOrAdd()

  const { changePass } = useChangePwd()

  //删除
  const { del } = useDel()
  const remove = async (row) => {
    const res = await del(row.id)
    if (res) {
      getList(listQuery)
    }
  }


</script>

<style scoped>
</style>
