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
      <!--      <el-tag type="danger" style="margin-bottom: 10px">不建议在此操作地址簿，可能会造成数据不同步</el-tag>-->
      <el-table :data="listRes.list" v-loading="listRes.loading" border>
        <el-table-column prop="id" label="id" align="center"/>
        <el-table-column prop="username" label="用户名" align="center"/>
        <el-table-column prop="hostname" label="主机名" align="center"/>
        <el-table-column prop="alias" label="别名" align="center"/>
        <el-table-column prop="platform" label="平台" align="center"/>
        <el-table-column prop="hash" label="hash" align="center"/>
        <el-table-column prop="tags" label="标签" align="center"/>
        <!--        <el-table-column prop="created_at" label="创建时间" align="center"/>-->
        <!--        <el-table-column prop="updated_at" label="更新时间" align="center"/>-->
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
    <el-dialog v-model="formVisible" width="800" :title="!formData.row_id?'创建':'修改'">
      <el-form class="dialog-form" ref="form" :model="formData" label-width="120px">
        <el-form-item label="id" prop="id" required>
          <el-input v-model="formData.id"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="formData.alias"></el-input>
        </el-form-item>
        <el-form-item label="hash" prop="hash">
          <el-input v-model="formData.hash"></el-input>
        </el-form-item>
        <el-form-item label="主机名" prop="hostname">
          <el-input v-model="formData.hostname"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="login_name">
          <el-input v-model="formData.login_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-select v-model="formData.platform">
            <el-option
                v-for="item in platformList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-select v-model="formData.tags" multiple>
            <el-option
                v-for="item in tagList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="强制中继" prop="forceAlwaysRelay" required>
                 <el-switch v-model="formData.forceAlwaysRelay"></el-switch>
               </el-form-item>
          <el-form-item label="在线" prop="online">
                 <el-switch v-model="formData.online"></el-switch>
               </el-form-item>
               <el-form-item label="rdp端口" prop="rdpPort">
                 <el-input v-model="formData.rdpPort"></el-input>
               </el-form-item>
               <el-form-item label="rdp用户名" prop="rdpUsername">
                 <el-input v-model="formData.rdpUsername"></el-input>
               </el-form-item>
               <el-form-item label="同一服务器" prop="sameServer">
                 <el-switch v-model="formData.sameServer"></el-switch>
               </el-form-item>-->


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
  import { create, list, remove, update } from '@/api/address_book'
  import { list as fetchTagList } from '@/api/tag'
  import { useRepositories } from '@/views/address_book'
  import { toWebClientLink } from '@/utils/webclient'

  const tagList = ref([])
  const fetchTagListData = async () => {
    const res = await fetchTagList({ is_my: 1 }).catch(_ => false)
    if (res) {
      tagList.value = res.data.list
    }
  }
  fetchTagListData()

  const {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    del,
    formVisible,
    platformList,
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

  watch(() => listRes.list, () => {
        const peers = {}
        listRes.list.map(item => {
          peers[item.id] = {
            'view-style': 'shrink',
            tm: new Date().getTime(),
            info: {
              'id': item.id,
              'username': item.username,
              'hostname': item.hostname,
              'alias': item.alias,
              'platform': item.platform,
              'hash': item.hash,
              'tags': item.tags,
            },
          }
        })
        localStorage.setItem('peers', JSON.stringify(peers))
      },
      {
        immediate: true,
      })

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
