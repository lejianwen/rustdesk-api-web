import { ref } from 'vue'
import { config } from '@/api/rustdesk'

export const toWebClientLink = (row) => {
  window.open(`${rustdeskConfig.value.api_server}/webclient/#/?id=${row.id}`)
}

export function loadRustdeskConfig () {
  const rustdeskConfig = ref({})
  const fetchConfig = async () => {
    const res = await config().catch(_ => false)
    if (res) {
      rustdeskConfig.value = res.data
      localStorage.setItem('custom-rendezvous-server', res.data.id_server)
      localStorage.setItem('key', res.data.key)
      localStorage.setItem('api-server', res.data.api_server)
    }
  }
  if (rustdeskConfig.value.id_server === undefined || rustdeskConfig.value.key === undefined) {
    fetchConfig()
  }
  return {
    rustdeskConfig,
  }
}
const { rustdeskConfig } = loadRustdeskConfig()
