import { ref } from 'vue'
import { config } from '@/api/rustdesk'
import Websock from '@/utils/webclient/websock'
import * as rendezvous from '@/utils/webclient/rendezvous'
import * as message from '@/utils/webclient/message'
import { ElMessageBox } from 'element-plus'
import { T } from '@/utils/i18n'

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

export const { rustdeskConfig } = loadRustdeskConfig()
export async function getPeerSlat (id) {
  const [addr, port] = rustdeskConfig.value.id_server.split(':')
  if (!addr) {
    return
  }
  const scheme = location.protocol === 'https:' ? 'wss' : 'ws'
  const ws = new Websock(`${scheme}://${addr}:21118`, true)
  await ws.open()
  const conn_type = rendezvous.ConnType.DEFAULT_CONN
  const nat_type = rendezvous.NatType.SYMMETRIC
  const punch_hole_request = rendezvous.PunchHoleRequest.fromPartial({
    id,
    licence_key: rustdeskConfig.value.key || undefined,
    conn_type,
    nat_type,
    token: undefined,
  })
  ws.sendRendezvous({ punch_hole_request })
  //rendezvous.RendezvousMessage
  const msg = (await ws.next())
  ws.close()
  console.log(new Date() + ': Got relay response', msg)
  const phr = msg.punch_hole_response
  const rr = msg.relay_response
  if (phr) {
    if (phr?.other_failure) {
      this.msgbox('error', 'Error', phr?.other_failure)
      return
    }
    if (phr.failure != rendezvous.PunchHoleResponse_Failure.UNRECOGNIZED) {
      switch (phr?.failure) {
        case rendezvous.PunchHoleResponse_Failure.ID_NOT_EXIST:
          ElMessageBox.alert(T('IDNotExist'), T('Error'))
          break
        case rendezvous.PunchHoleResponse_Failure.OFFLINE:
          ElMessageBox.alert(T('RemoteDesktopOffline'), T('Error'))
          break
        case rendezvous.PunchHoleResponse_Failure.LICENSE_MISMATCH:
          ElMessageBox.alert(T('KeyMismatch'), T('Error'))
          break
        case rendezvous.PunchHoleResponse_Failure.LICENSE_OVERUSE:
          ElMessageBox.alert(T('KeyOveruse'), T('Error'))
          break
      }
    }
    return false
  } else if (rr) {
    const uuid = rr.uuid
    console.log(new Date() + ': Connecting to relay server')

    const _ws = new Websock(`${scheme}://${addr}:21119`, false)
    await _ws.open()
    console.log(new Date() + ': Connected to relay server')
    const request_relay = rendezvous.RequestRelay.fromPartial({
      licence_key: rustdeskConfig.value.key || undefined,
      uuid,
    })
    _ws.sendRendezvous({ request_relay })

    //暂不支持pk
    const public_key = message.PublicKey.fromPartial({})
    _ws?.sendMessage({ public_key })
    // const secure = (await this.secure(pk)) || false;
    // globals.pushEvent("connection_ready", { secure, direct: false });
    while (true) {
      const msg = (await _ws?.next())
      console.log('msg', msg)
      if (msg?.hash) {
        console.log('hash msg.....', msg.hash)
        _ws.close()
        return msg.hash
      }
    }
    return false
  }

}
