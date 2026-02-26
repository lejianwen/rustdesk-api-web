<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="120px">
        <el-form-item :label="T('User')">
          <el-select v-model="state.user_id" filterable clearable @change="load">
            <el-option
              v-for="u in state.users"
              :key="u.id"
              :label="u.username"
              :value="u.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="T('MaxDevices')">
          <el-input-number v-model="state.max_devices" :min="1" />
          <el-button type="primary" style="margin-left: 10px" @click="saveLimit">
            {{ T('Save') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="list-body" shadow="hover">
      <el-table :data="state.list" v-loading="state.loading" border>
        <el-table-column prop="device_id" :label="T('DeviceId')" align="center" width="140"/>
        <el-table-column prop="device_uuid" :label="T('Uuid')" align="center" />
        <el-table-column prop="device_name" :label="T('DeviceName')" align="center" width="180"/>
        <el-table-column prop="device_os" :label="T('DeviceOs')" align="center" width="120"/>
        <el-table-column prop="device_type" :label="T('DeviceType')" align="center" width="120"/>

        <el-table-column prop="first_login_at" :label="T('FirstLoginAt')" align="center" width="170">
          <template #default="{row}">{{ fmtUnix(row.first_login_at) }}</template>
        </el-table-column>
        <el-table-column prop="last_login_at" :label="T('LastLoginAt')" align="center" width="170">
          <template #default="{row}">{{ fmtUnix(row.last_login_at) }}</template>
        </el-table-column>
        <el-table-column prop="last_login_ip" :label="T('LastLoginIp')" align="center" width="150"/>

        <!-- 集成 peer 信息 -->
        <el-table-column prop="peer_hostname" :label="T('Hostname')" align="center" width="160"/>
        <el-table-column prop="peer_version" :label="T('Version')" align="center" width="120"/>
        <el-table-column prop="peer_last_online_time" :label="T('LastOnlineTime')" align="center" width="170">
          <template #default="{row}">{{ fmtUnix(row.peer_last_online_time) }}</template>
        </el-table-column>
        <el-table-column prop="peer_last_online_ip" :label="T('LastOnlineIp')" align="center" width="150"/>

        <el-table-column :label="T('Actions')" align="center" width="140">
          <template #default="{row}">
            <el-button type="danger" @click="unbind(row)">{{ T('UnBind') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { T } from '@/utils/i18n'
import { list as listUsers } from '@/api/user'
import { listUserDevices, setUserMaxDevices, unbindUserDevice } from '@/api/userDevice'
import { ElMessageBox, ElMessage } from 'element-plus'

const route = useRoute()

const state = reactive({
  users: [],
  user_id: null,
  max_devices: 1,
  list: [],
  loading: false,
})

const fmtUnix = (ts) => {
  if (!ts || ts <= 0) return '-'
  const d = new Date(ts * 1000)
  const pad = (n) => (n < 10 ? '0' + n : '' + n)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const loadUsers = async () => {
  const res = await listUsers({ page: 1, page_size: 9999 }).catch(_ => false)
  if (res) state.users = res.data.list || []
}

const load = async () => {
  if (!state.user_id) {
    state.list = []
    state.max_devices = 1
    return
  }
  state.loading = true
  const res = await listUserDevices({ user_id: state.user_id }).catch(_ => false)
  state.loading = false
  if (res) {
    state.max_devices = res.data.max_devices || 1
    state.list = res.data.list || []
  }
}

const saveLimit = async () => {
  if (!state.user_id) return
  const ok = await ElMessageBox.confirm(T('Confirm?', { param: T('Save') }), {
    confirmButtonText: T('Confirm'),
    cancelButtonText: T('Cancel'),
  }).catch(_ => false)
  if (!ok) return
  const res = await setUserMaxDevices({ user_id: state.user_id, max_devices: state.max_devices }).catch(_ => false)
  if (res) {
    ElMessage.success(T('OperationSuccess'))
    load()
  }
}

const unbind = async (row) => {
  const ok = await ElMessageBox.confirm(T('Confirm?', { param: T('UnBind') }), {
    confirmButtonText: T('Confirm'),
    cancelButtonText: T('Cancel'),
    type: 'warning',
  }).catch(_ => false)
  if (!ok) return
  const res = await unbindUserDevice({ user_id: state.user_id, device_uuid: row.device_uuid }).catch(_ => false)
  if (res) {
    ElMessage.success(T('OperationSuccess'))
    load()
  }
}

onMounted(async () => {
  await loadUsers()
  const qid = route.query.user_id
  if (qid) {
    state.user_id = Number(qid)
  }
  load()
})
</script>