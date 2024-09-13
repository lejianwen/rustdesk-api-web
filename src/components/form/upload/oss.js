import { ossToken } from '@/api/file'
import { random_filename } from '@/utils/file'
import { reactive, ref } from 'vue'

export function useOss (beforeUp, multiple) {
  let fileUploadData = reactive({
    policy: '',
    OSSAccessKeyId: '',
    success_action_status: '200', // 让服务端返回200,不然，默认会返回204
    callback: '',
    signature: '',
    'x:dir': '',
  })
  const fileExpire = ref(0)
  const fileUploadHost = ref('')

  const beforeFileUpload = async (file) => {
    if (beforeUp) {
      const br = await beforeUp(file)
      if (!br) { return Promise.reject() }
    }

    const now = Date.parse(new Date()) / 1000
    if (fileExpire.value < now) {
      const res = await ossToken()
      const obj = JSON.parse(res.data)
      fileExpire.value = parseInt(obj['expire'])
      fileUploadData.policy = obj['policy']
      fileUploadData.OSSAccessKeyId = obj['accessid']
      fileUploadData.callback = obj['callback']
      fileUploadData.signature = obj['signature']
      fileUploadData['x:dir'] = obj['dir']
      fileUploadHost.value = obj['host']
    }
    //多选文件时需要这个，不然每个文件上传的都是一样的data
    if (multiple) {
      await new Promise(resolve => {
        setTimeout(() => { resolve() }, 50)
      })
    }
    fileUploadData['x:origin_filename'] = file.name
    fileUploadData.key = fileUploadData['x:dir'] + random_filename(file.name)
    return Promise.resolve()
  }

  return {
    fileUploadHost,
    fileUploadData,
    beforeFileUpload,
    headers: {},
  }
}
