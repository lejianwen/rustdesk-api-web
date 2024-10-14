export const connectByClient = (id) => {
  //不新开窗口打开url protocol ,格式是 rustdesk://<id>
  // window.open(`rustdesk://${row.id}`)
  let a = document.createElement('a')
  a.href = `rustdesk://${id}`
  a.target = '_self'
  a.click()

}
