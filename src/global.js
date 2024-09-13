import { ref, reactive, watch } from 'vue'
import { list as fetchUsers } from '@/api/user'

export function loadAllUsers () {
  const allUsers = ref([])
  const getAllUsers = async () => {
    const res = await fetchUsers({ page_size: 9999 }).catch(_ => false)
    if (res) {
      allUsers.value = res.data.list
    }
  }

  return {
    allUsers,
    getAllUsers,
  }

}

