<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="80px" class="query-form">
        <el-form-item :label="T('Peer')">
          <el-input v-model="listQuery.peer_id" clearable />
        </el-form-item>

        <el-form-item :label="T('FromPeer')">
          <el-input v-model="listQuery.from_peer" clearable />
        </el-form-item>

        <!-- Date range (client-side filter) -->
        <el-form-item label="Date">
          <el-date-picker
              v-model="listQuery.date_range"
              type="daterange"
              range-separator="→"
              start-placeholder="From"
              end-placeholder="To"
              value-format="YYYY-MM-DD"
              clearable
          />
        </el-form-item>

        <!-- NEW: Active only -->
        <el-form-item label="Active">
          <el-switch v-model="listQuery.active_only" inline-prompt active-text="ON" inactive-text="OFF" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button type="danger" @click="toBatchDelete">{{ T('BatchDelete') }}</el-button>
          <el-button type="success" @click="toExport">{{ T('Export') }}</el-button>
        </el-form-item>

        <!-- Total duration (for current filtered dataset) -->
        <div class="total-hours" v-if="totalHoursText">
          {{ totalHoursText }}
        </div>
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
        <el-table-column type="selection" align="center" width="50" />
        <el-table-column prop="id" label="ID" align="center" width="100" />
        <el-table-column :label="T('Peer')" prop="peer_id" align="center" width="120" />
        <el-table-column :label="T('FromPeer')" prop="from_peer" align="center" width="120" />
        <el-table-column :label="T('FromName')" prop="from_name" align="center" width="120" />
        <el-table-column :label="T('Ip')" prop="ip" align="center" width="120" />

        <el-table-column pop="type" :label="T('Type')" align="center" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.type === 1" type="warning">{{ T('File') }}</el-tag>
            <el-tag v-else>{{ T('Common') }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="uuid" label="uuid" align="center" width="120" show-overflow-tooltip />
        <el-table-column prop="created_at" :label="T('CreatedAt')" align="center" />

        <!-- CloseTime with ACTIVE badge -->
        <el-table-column :label="T('CloseTime')" prop="close_time" align="center">
          <template #default="{ row }">
            <el-tag v-if="row._active" type="success" effect="dark" class="active-tag">ACTIVE</el-tag>
            <span v-else>{{ row.close_time }}</span>
          </template>
        </el-table-column>

        <!-- Duration -->
        <el-table-column :label="T('Duration')" prop="duration" align="center" width="120">
          <template #default="{ row }">
            <span :class="{ 'duration-active': row._active }">{{ row.duration }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="T('Actions')" align="center" width="150">
          <template #default="{ row }">
            <el-button type="danger" @click="del(row)">{{ T('Delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="list-page" shadow="hover">
      <el-pagination
          background
          layout="prev, pager, next, sizes, jumper"
          :page-sizes="[10, 20, 50, 100]"
          v-model:page-size="listQuery.page_size"
          v-model:current-page="listQuery.page"
          :total="listRes.total"
      />
    </el-card>
  </div>
</template>

<script setup>
import { computed, onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue'
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
  totalSeconds,
  tickActiveDurations,
} = useRepositories()

const totalHoursText = computed(() => {
  const s = totalSeconds.value || 0
  if (!s) return ''
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `Total Hours: ${h}h ${m}m`
})

// Active row highlight
const rowClassName = ({ row }) => (row && row._active ? 'row-active' : '')

// Fetch on entry
onMounted(getList)
onActivated(getList)

// Server/local pagination reactions
watch(() => listQuery.page, getList)
watch(() => listQuery.page_size, handlerQuery)

// Dynamic filters -> reset page + refresh
watch(
    () => [listQuery.peer_id, listQuery.from_peer, listQuery.date_range, listQuery.active_only],
    () => handlerQuery()
)

// Selection
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const toBatchDelete = () => {
  if (!multipleSelection.value.length) return
  batchdel(multipleSelection.value)
}

// Smooth real-time duration updates (no refetch)
let timer = null
const startTimer = () => {
  if (timer) return
  timer = setInterval(() => {
    tickActiveDurations()
  }, 1000)
}
const stopTimer = () => {
  if (!timer) return
  clearInterval(timer)
  timer = null
}

onMounted(startTimer)
onActivated(startTimer)
onDeactivated(stopTimer)
onUnmounted(stopTimer)
</script>

<style scoped lang="scss">
/* Subtle highlight for active rows */
:deep(.el-table .row-active td) {
  background: rgba(103, 194, 58, 0.10) !important;
}

.active-tag {
  letter-spacing: 0.5px;
}

.duration-active {
  font-weight: 600;
}

.query-form {
  position: relative;
  align-items: center;
}

.total-hours {
  margin-left: auto;
  padding-right: 6px;
  font-weight: 700;
  color: #63e06a;
  text-shadow: 0 0 6px rgba(99, 224, 106, 0.35);
}
</style>
