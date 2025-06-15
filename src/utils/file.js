export function get_suffix (filename) {
  var pos = filename.lastIndexOf('.')
  var suffix = ''
  if (pos !== -1) {
    suffix = filename.substring(pos)
  }
  return suffix
}

export function random_string (len) {
  len = len || 32
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var maxPos = chars.length
  var pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export function random_filename (filename) {
  var suffix = get_suffix(filename)
  var time = new Date()
  var time2 = new Date('2020/01/01')
  return Math.ceil((time.getTime() - time2.getTime()) / 1000) + '_' + random_string(10) + suffix
}

export function utf8_to_b64 (str) {
  return window.btoa(unescape(encodeURIComponent(str)))
}

export function b64_to_utf8 (str) {
  return decodeURIComponent(escape(window.atob(str)))
}

export function jsonToCsv (data) {
  let csv = ''
  let keys = Object.keys(data[0])
  csv += keys.join(',') + '\n'
  data.forEach(row => {
    csv += keys.map(key => `"${row[key].toString().replaceAll('"', '""')}"`).join(',') + '\n'
  })
  return new Blob([csv], { type: 'text/csv' })
}

export function downBlob (blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  })
}

export function sizeFormat (size) {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + 'MB'
  } else {
    return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
  }
}
