import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'
import { T } from '@/utils/i18n'

export function handleClipboard (text, event) {
  const clipboard = new Clipboard(event.target.toString(), {
    text: () => text,
  })
  clipboard.on('success', () => {
    ElMessage.success(T('CopySuccess'))
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    ElMessage.error(T('CopyFailed'))
    clipboard.destroy()
  })
  clipboard.onClick(event)
}

export function copyImage (targetNode) {
  if (window.getSelection) {
    // chrome等主流浏览器
    var selection = window.getSelection()
    selection.removeAllRanges()
    var range = document.createRange()
    range.selectNode(targetNode)
    selection.addRange(range)
  } else if (document.body.createTextRange) {
    console.log('IE')
    // ie
    const range = document.body.createTextRange()
    range.moveToElementText(targetNode)
    range.select()
  }
  document.execCommand('copy')
}
