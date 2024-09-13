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
        <el-table-column prop="name" label="名称" align="center"/>
        <el-table-column prop="color" label="颜色" align="center">
          <template #default="{row}">
            <div class="colors">
              <div style="background-color: #efeff2" class="colorbox">
                <div :style="{backgroundColor: row.color}" class="dot">
                </div>
              </div>
              <div style="background-color: #24252b" class="colorbox">
                <div :style="{backgroundColor: row.color}" class="dot">
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
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
        <el-form-item label="颜色" prop="color" required>
          <el-color-picker v-model="formData.color" show-alpha @active-change="activeChange"></el-color-picker>
          <br>
          <div class="colors">
            <div style="background-color: #efeff2" class="colorbox">
              <div :style="{backgroundColor: currentColor}" class="dot">
              </div>
            </div>
            <div style="background-color: #24252b" class="colorbox">
              <div :style="{backgroundColor: currentColor}" class="dot">
              </div>
            </div>
          </div>
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
  import { onMounted, watch, onActivated } from 'vue'
  import { useRepositories } from '@/views/tag'

  const {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
    formVisible,
    formData,
    toEdit,
    toAdd,
    submit,
    activeChange,
    currentColor,
  } = useRepositories()

  listQuery.is_my = 1

  onMounted(getList)
  onActivated(getList)

  watch(() => listQuery.page, getList)

  watch(() => listQuery.page_size, handlerQuery)

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
