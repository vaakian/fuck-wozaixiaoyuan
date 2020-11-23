/*
用于晚签到
 */
const url = {
  doSign: 'https://student.wozaixiaoyuan.com/sign/doSign.json',
  getSignMessage: 'https://student.wozaixiaoyuan.com/sign/getSignMessage.json',
}
const method = 'POST'
const token = $prefs.valueForKey('wzxy_token')
const maxPage = 5

function doSign({ id, logId }) {
  const data = {
    signId: id,
    city: '黄石市',
    longitude: 115.018481,
    id: logId,
    country: '中国',
    district: '下陆区',
    township: '团城山街道',
    latitude: 30.205023,
    province: '湖北省',
  }
  const doSignRequest = {
    url: url.doSign,
    method: method, // Optional, default GET.
    headers: { token, 'Content-Type': 'application/json' }, // Optional.
    body: JSON.stringify(data), // Optional.
  }
  $task.fetch(doSignRequest).then(
    (response) => {
      const responseBody = JSON.parse(response.body)
      console.log('doSign: ' + response.body)
      $notify('晚签到结果', responseBody.code ? '失败' : '成功', response.body)
    },
    (reason) => {
      $notify('晚签到结果', '失败', reason.error)
    }
  )
}

function filterSignMessage(signMessages) {
  // 筛选可签到的列表
  for (let signMessage of signMessages)
    if (signMessage.state == 1) return signMessage
  return null
}

function getSignMessageByPage(page) {
  return new Promise((resolve, reject) => {
    const getSignMessageRequest = {
      url: url.getSignMessage,
      method: method,
      headers: { token, 'content-type': 'application/x-www-form-urlencoded' },
      body: `page=${page}&size=5`,
    }
    $task.fetch(getSignMessageRequest).then(
      (response) => {
        const responseBody = JSON.parse(response.body)
        console.log('getSignMessage: ' + response.body)
        if (responseBody.code == 0) {
          // 过滤未开始、已签到
          let signMessage = filterSignMessage(responseBody.data)
          signMessage ? resolve(signMessage) : reject(`第${page}页未找到`)
        } else {
          reject(`获取签到列表失败：代码${responseBody.code}`)
        }
      },
      (reason) => {
        reject(reason.error)
      }
    )
  })
}

function submitLocationByPage(currentPage) {
  getSignMessageByPage(currentPage)
    .then((signMessage) => {
      doSign(signMessage)
    })
    .catch((err) => {
      if (currentPage >= maxPage) {
        $notify('已达到最大页数', '未找到可签到sign', err)
        console.log('已达到最大页数')
      } else {
        submitLocationByPage(currentPage + 1)
      }
    })
}

if (!token) {
  $notify('尝试签到失败', '未找到token', token)
} else {
  submitLocationByPage(1)
}
/*
未开始：
{"code":0,"data":{"areas":[{"distance":1200,"latitude":"666.2090300000","longitude":"666.0258700000","name":"校本部"}],"date":"11-23 08:29","devices":[],"end":"11-29 23:00","id":"250900667593197568","phone":"**","qrcodeId":"0","start":"11-29 21:00","state":0,"studentId":"217018292841027584","studentName":"**","time":"8732分钟","title":"校区签到","type":3,"userName":"**","uuids":[]}}
未签到：

已签到：
{"code":0,"data":{"areas":[{"distance":1200,"latitude":"666.2090300000","longitude":"666.0258700000","name":"校本部"}],"date":"11-21 09:33","devices":[],"end":"11-22 23:00","id":"250192060723236864","phone":"**","qrcodeId":"0","start":"11-22 21:00","state":2,"studentId":"217018292841027584","studentName":"**","time":"---","title":"校区签到","type":1,"userName":"**","uuids":[]}}
* */
