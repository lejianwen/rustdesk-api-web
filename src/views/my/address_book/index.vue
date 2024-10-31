<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="120px">
        <el-form-item :label="T('AddressBookName')">
          <el-select v-model="listQuery.collection_id" clearable>
            <el-option :value="0" :label="T('MyAddressBook')"></el-option>
            <el-option v-for="c in collectionListRes.list" :key="c.id" :label="c.name" :value="c.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="T('Id')">
          <el-input v-model="listQuery.id" clearable></el-input>
        </el-form-item>
        <el-form-item :label="T('Username')">
          <el-input v-model="listQuery.username" clearable></el-input>
        </el-form-item>
        <el-form-item :label="T('Hostname')">
          <el-input v-model="listQuery.hostname" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button type="danger" @click="toAdd">{{ T('Add') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <!--      <el-tag type="danger" style="margin-bottom: 10px">不建议在此操作地址簿，可能会造成数据不同步</el-tag>-->
      <el-table :data="listRes.list" v-loading="listRes.loading" border>
        <el-table-column prop="id" label="ID" align="center" width="200">
          <template #default="{row}">
            <div>
              <PlatformIcons :name="platformList.find(p=>p.label===row.platform)?.icon" style="width: 20px;height: 20px;display: inline-block" color="var(--basicBlack)"/>
              {{ row.id }}
              <el-icon @click="handleClipboard(row.id, $event)">
                <CopyDocument/>
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="collection_id" :label="T('AddressBookName')" align="center" width="150">
          <template #default="{row}">
            <span v-if="row.collection_id === 0">{{ T('MyAddressBook') }}</span>
            <span v-else>{{ collectionListRes.list.find(c => c.id === row.collection_id)?.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" :label="T('Username')" align="center" width="150"/>
        <el-table-column prop="hostname" :label="T('Hostname')" align="center" width="150"/>
        <!--        <el-table-column prop="platform" :label="T('Platform')" align="center" width="120"/>-->
        <el-table-column prop="tags" :label="T('Tags')" align="center"/>
        <!--        <el-table-column prop="created_at" label="创建时间" align="center"/>-->
        <!--        <el-table-column prop="updated_at" label="更新时间" align="center"/>-->
        <el-table-column prop="alias" :label="T('Alias')" align="center" width="150"/>
        <el-table-column prop="peer.version" :label="T('Version')" align="center" width="100"/>
        <el-table-column prop="hash" :label="T('Hash')" align="center" width="150" show-overflow-tooltip/>
        <el-table-column :label="T('Actions')" align="center" class-name="table-actions" width="600" fixed="right">
          <template #default="{row}">
            <el-button type="success" @click="connectByClient(row.id)">{{ T('Link') }}</el-button>
            <el-button v-if="appStore.setting.appConfig.web_client" type="success" @click="toWebClientLink(row)">Web Client</el-button>
            <el-button v-if="appStore.setting.appConfig.web_client" type="primary" @click="toShowShare(row)">{{ T('ShareByWebClient') }}</el-button>
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
    <el-dialog v-model="formVisible" width="800" :title="!formData.row_id?T('Create') :T('Update') ">
      <el-form class="dialog-form" ref="form" :model="formData" label-width="120px">
        <el-form-item :label="T('AddressBookName')" required prop="collection_id">
          <el-select v-model="formData.collection_id" clearable @change="changeCollection">
            <el-option :value="0" :label="T('MyAddressBook')"></el-option>
            <el-option v-for="c in collectionListRes.list" :key="c.id" :label="c.name" :value="c.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ID" prop="id" required>
          <el-input v-model="formData.id"></el-input>
        </el-form-item>
        <el-form-item :label="T('Username')" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item :label="T('Alias')" prop="alias">
          <el-input v-model="formData.alias"></el-input>
        </el-form-item>
        <el-form-item :label="T('Hash')" prop="hash">
          <el-input v-model="formData.hash"></el-input>
        </el-form-item>
        <el-form-item :label="T('Hostname')" prop="hostname">
          <el-input v-model="formData.hostname"></el-input>
        </el-form-item>
        <!--        <el-form-item :label="T('LoginName')" prop="loginName">
                  <el-input v-model="formData.loginName"></el-input>
                </el-form-item>-->
        <!--        <el-form-item :label="T('Password')" prop="password">
                          <el-input v-model="formData.password"></el-input>
                        </el-form-item>-->
        <el-form-item :label="T('Platform')" prop="platform">
          <el-select v-model="formData.platform">
            <el-option
                v-for="item in platformList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="T('Tags')" prop="tags">
          <el-select v-model="formData.tags" multiple>
            <el-option
                v-for="item in tagListRes.list"
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
          <el-button @click="formVisible = false">{{ T('Cancel') }}</el-button>
          <el-button @click="submit" type="primary">{{ T('Submit') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="shareToWebClientVisible" width="900" :close-on-click-modal="false">
      <shareByWebClient :id="shareToWebClientForm.id"
                        :hash="shareToWebClientForm.hash"
                        @cancel="shareToWebClientVisible=false"
                        @success=""/>
    </el-dialog>
  </div>
</template>

<script setup>
  import { onActivated, onMounted, ref, watch } from 'vue'
  import { list as fetchTagList } from '@/api/tag'
  import { useRepositories } from '@/views/address_book'
  import { toWebClientLink } from '@/utils/webclient'
  import { T } from '@/utils/i18n'
  import shareByWebClient from '@/views/address_book/components/shareByWebClient.vue'
  import { useAppStore } from '@/store/app'
  import { connectByClient } from '@/utils/peer'
  import { handleClipboard } from '@/utils/clipboard'
  import { CopyDocument } from '@element-plus/icons'
  import PlatformIcons from '@/components/icons/platform.vue'

  const is_my = 1
  const appStore = useAppStore()

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
    shareToWebClientVisible,
    shareToWebClientForm,
    toShowShare,
    // collectionListQuery,
    collectionListRes,
    getCollectionList,
    tagListRes,
    changeCollection,
  } = useRepositories(is_my)

  onMounted(getCollectionList)
  onMounted(getList)
  onActivated(getList)

  watch(() => listQuery.page, getList)

  watch(() => listQuery.page_size, handlerQuery)
</script>

<style scoped lang="scss">

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
