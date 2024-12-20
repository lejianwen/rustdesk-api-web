<template>

  <el-form class="dialog-form" ref="form" :model="ABFormData" label-width="120px">
    <el-form-item :label="T('Owner')" prop="user_ids" required>
      <el-select v-model="ABFormData.user_ids" multiple @change="changeUser">
        <el-option
            v-for="item in allUsers"
            :key="item.id"
            :label="item.username"
            :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="T('AddressBookName')" v-if="ABFormData.user_ids.length<=1" required prop="collection_id">
      <el-select v-model="ABFormData.collection_id" clearable @change="changeCollectionForUpdate">
        <el-option :value="0" :label="T('MyAddressBook')"></el-option>
        <el-option v-for="c in collectionListResForUpdate.list" :key="c.id" :label="c.name" :value="c.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="ID" prop="id" required>
      <el-input v-model="ABFormData.id"></el-input>
    </el-form-item>
    <el-form-item :label="T('Username')" prop="username">
      <el-input v-model="ABFormData.username"></el-input>
    </el-form-item>
    <el-form-item :label="T('Alias')" prop="alias">
      <el-input v-model="ABFormData.alias"></el-input>
    </el-form-item>
    <el-form-item :label="T('Hostname')" prop="hostname">
      <el-input v-model="ABFormData.hostname"></el-input>
    </el-form-item>
    <el-form-item :label="T('Platform')" prop="platform">
      <el-select v-model="ABFormData.platform">
        <el-option
            v-for="item in ABPlatformList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item :label="T('Tags')" prop="tags" v-if="ABFormData.user_ids.length<=1">
      <el-select v-model="ABFormData.tags" multiple>
        <el-option
            v-for="item in tagListRes.list"
            :key="item.name"
            :label="item.name"
            :value="item.name"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="cancel">{{ T('Cancel') }}</el-button>
      <el-button @click="ABSubmit" type="primary">{{ T('Submit') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>

  import { T } from '@/utils/i18n'
  import { loadAllUsers } from '@/global'
  import { onMounted, defineProps, defineEmits, onActivated } from 'vue'
  import { useRepositories as useABRepositories } from '@/views/address_book'
  import { batchCreate } from '@/api/address_book'
  import { ElMessage } from 'element-plus'

  const emits = defineEmits(['cancel', 'success'])
  const props = defineProps({
    peer: {
      type: Object,
      required: true,
    },
  })
  const { allUsers, getAllUsers } = loadAllUsers()
  onMounted(getAllUsers)
  const {
    platformList: ABPlatformList,
    formData: ABFormData,
    changeUserForUpdate,
    changeCollectionForUpdate,
    collectionListResForUpdate,
    tagListRes,
    fromPeer,
  } = useABRepositories('admin')
  onMounted(() => {
    fromPeer(props.peer)
    console.log(collectionListResForUpdate)
  })

  const changeUser = async (val) => {
    ABFormData.collection_id = 0
    ABFormData.tags = []
    if (val.length === 1) {
      changeUserForUpdate(val[0])
    }
    if (val.length === 0) {
      collectionListResForUpdate.list = []
    }
  }

  const ABSubmit = async () => {
    if (ABFormData.user_ids.length === 0) {
      ElMessage.error(T('ParamRequired', { param: T('Owner') }))
      return
    }
    if (!ABFormData.id) {
      ElMessage.error(T('ParamRequired', { param: 'ID' }))
      return
    }
    if (ABFormData.user_ids.length > 1) {
      ABFormData.collection_id = 0
      ABFormData.tags = []
    }
    const res = await batchCreate(ABFormData).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      emits('success')
    }
  }
  const cancel = () => {
    emits('cancel')
  }

</script>

<style scoped lang="scss">

</style>
