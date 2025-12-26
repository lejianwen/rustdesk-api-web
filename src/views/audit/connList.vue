<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="80px">
        <el-form-item :label="T('Peer')">
          <el-input v-model="listQuery.peer_id" clearable></el-input>
        </el-form-item>
        <el-form-item :label="T('FromPeer')">
          <el-input v-model="listQuery.from_peer" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button type="danger" @click="toBatchDelete">{{ T('BatchDelete') }}</el-button>
          <el-button type="success" @click="toExport">{{ T('Export') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="list-body" shadow="hover">
      <el-table
          :data="listRes.list"
          v-loading="listRes.loading"
          border
          @selection-change="handleSelectionChange"
          :row-class-name="rowClassName"
      >
        <el-table-column type="selection" align="center" width="50"/>
        <el-table-column prop="id" label="ID" align="center" width="100"/>
        <el-table-column :label="T('Peer')" prop="peer_id" align="center" width="120"/>
        <el-table-column :label="T('FromPeer')" prop="from_peer" align="center" width="120"/>
        <el-table-column :label="T('FromName')" prop="from_name" align="center" width="120"/>
        <el-table-column :label="T('Ip')" prop="ip" align="center" width="120"/>

        <el-table-column pop="type" :label="T('Type')" align="center" width="120">
          <template #default="{row}">
            <el-tag v-if="row.type === 1" type="warning">{{ T('File') }}</el-tag>
            <el-tag v-else>{{ T('Common') }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="uuid" label="uuid" align="center" width="120" show-overflow-tooltip/>
        <el-table-column prop="created_at" :label="T('CreatedAt')" align="center"/>

        <!-- CloseTime with ACTIVE badge -->
        <el-table-column :label="T('CloseTime')" prop="close_time" align="center">
          <template #default="{row}">
            <el-tag v-if="row._active" type="success" effect="dark" class="active-tag">
              ACTIVE
            </el-tag>
            <span v-else>{{ row.close_time }}</span>
          </template>
        </el-table-column>

        <!-- Duration -->
        <el-table-column :label="T('Duration')" prop="duration" align="center" width="120">
          <template #default="{row}">
            <span :class="{ 'duration-active': row._active }">{{ row.duration }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="T('Actions')" align="center" width="150">
          <template #default="{row}">
            <el-button type="danger" @click="del(row)">{{ T('Delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="list-page" shadow="hover">
      <el-pagination
          background
          layout="prev, pager, next, sizes, jumper"
          :page-sizes="[10,20,50,100]"
          v-model:page-size="listQuery.page_size"
          v-model:current-page="listQuery.page"
          :total="listRes.total"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRepositories } from '@/views/audit/reponsitories'
import { T } from '@/utils/i18n'

const {
  listRes,
  listQuery,
  getList,
  handlerQuery,
  del,
  batchdel,
  toExport,
} = useRepositories()

// Row highlight for active connections
const rowClassName = ({ row }) => {
  return row && row._active ? 'row-active' : ''
}

// live duration update (only for active rows)
let timer = null
const pad = (n) => String(n).padStart(2, '0')
const formatDurationMs = (ms) => {
  if (!ms || ms < 0) return '-'
  const totalSec = Math.floor(ms / 1000)
  const hh = Math.floor(totalSec / 3600)
  const mm = Math.floor((totalSec % 3600) / 60)
  const ss = totalSec % 60
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`
}
const refreshDurations = () => {
  const now = Date.now()
  listRes.list.forEach(row => {
    if (row?._active && row._created_ms) {
      row.duration = formatDurationMs(now - row._created_ms)
    }
  })
}

const startTimer = () => {
  if (timer) return
  timer = setInterval(refreshDurations, 1000)
}
const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  getList()
  startTimer()
})
onActivated(() => {
  getList()
  startTimer()
})
onDeactivated(stopTimer)
onUnmounted(stopTimer)

watch(() => listQuery.page, getList)
watch(() => listQuery.page_size, handlerQuery)

const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const toBatchDelete = () => {
  if (multipleSelection.value.length === 0) return
  batchdel(multipleSelection.value)
}
</script>

<style scoped lang="scss">
/* Subtle highlight for active rows (professional, not noisy) */
:deep(.el-table .row-active td) {
  background: rgba(103, 194, 58, 0.10) !important; /* Element Plus success-ish */
}

.active-tag {
  letter-spacing: 0.5px;
}

.duration-active {
  font-weight: 600;
}
</style>
