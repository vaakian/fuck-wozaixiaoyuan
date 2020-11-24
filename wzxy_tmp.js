/*
用于每日体温提交
 */
const url = 'https://student.wozaixiaoyuan.com/health/save.json'
const method = 'POST'
const token = $prefs.valueForKey('wzxy_token')
const headers = { token }

function randTemperature() {
  let t = 36 + Math.random() * 0.8
  return t.toFixed(1)
}

if (!token) {
  $notify('尝试提交体温失败', '未找到token', token)
} else {
  const params = `answers=%5B%220%22%2C%22${randTemperature()}%22%2C%22${randTemperature()}%22%2C%22${randTemperature()}%22%5D&latitude=30.205023&longitude=115.018481&country=%E4%B8%AD%E5%9B%BD&city=%E9%BB%84%E7%9F%B3%E5%B8%82&district=%E4%B8%8B%E9%99%86%E5%8C%BA&province=%E6%B9%96%E5%8C%97%E7%9C%81&township=%E5%9B%A2%E5%9F%8E%E5%B1%B1%E8%A1%97%E9%81%93&street=%E5%9B%A2%E5%9F%8E%E5%B1%B1&areacode=420204`
  const myRequest = {
    url: url,
    method: method, // Optional, default GET.
    headers: headers, // Optional.
    body: params, // Optional.
  }

  $task.fetch(myRequest).then(
    (response) => {
      // response.statusCode, response.headers, response.body
      let respnseBody = JSON.parse(response.body)
      console.log(respnseBody)
      $notify(
        '每日体温提交',
        respnseBody.code == 0 ? '成功' : '失败',
        response.body
      ) // Success!
    },
    (reason) => {
      $notify('每日体温提交error', '提交失败', reason.error) // Error!
    }
  )
}
