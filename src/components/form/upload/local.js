import { getToken } from '@/utils/auth'

export function useLocal (beforeUp, host) {
  const fileUploadData = {}
  const fileUploadHost = host
  const headers = { 'api-token': getToken() }
  const beforeFileUpload = async (file) => {
    if (beforeUp) {
      const br = await beforeUp(file)
      if (!br) { return Promise.reject() }
    }
    return Promise.resolve()
  }

  return {
    fileUploadData,
    fileUploadHost,
    beforeFileUpload,
    headers,
  }
}
