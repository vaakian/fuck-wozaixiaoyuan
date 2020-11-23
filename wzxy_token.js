/*
 * 用于自动存储token
 * */
let headers = $request.headers

let token = headers.token
if (token) {
  let r = $prefs.setValueForKey(token, 'wzxy_token')
  $notify('got token', r, $prefs.valueForKey('wzxy_token'))
}
$done({})
