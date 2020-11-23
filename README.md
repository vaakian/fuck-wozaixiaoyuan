# 我在校园 quantumult x 自动签到脚本

quantumult x 需要配置 https。

token 有效期为 4 天，每 4 天之内进入一次签到列表，脚本自动更新 tokne，更新成功会有消息提示。

不同地区，不同设置，参数不同。自行分析并修改。

具体有：

1、`wzxy_loc.js`文件的`data`参数

2、`wzxy_tmp.js`文件的`params`参数

## crontab

我校是每天提交一次早中晚体温，晚上 9 点后定位签到一次。

```crontab
晚定位签到，每天21:01分
1 21 * * *

体温打卡，每天00:01分
01 0 * * *
```

## quantumult x 配置文件

```ini
[task_local]
1 21 * * * https://raw.githubusercontent.com/NomadJohn/fuck-wozaixiaoyuan/main/wzxy_loc.js, tag=定位签到, enabled=true
01 0 * * * https://raw.githubusercontent.com/NomadJohn/fuck-wozaixiaoyuan/main/wzxy_tmp.js, tag=体温提交, enabled=true


[rewrite_local]
student\.wozaixiaoyuan\.com\/sign\/getSignMessage\.json url script-request-header https://raw.githubusercontent.com/NomadJohn/fuck-wozaixiaoyuan/main/wzxy_token.js
```

## 配置 MitM，启用 HTTPS 解析

1. 按照软件配置 MitM，信任证书等等。

2. 添加主机名：student.wozaixiaoyuan.com

   或手动编辑配置文件，在 hostname 后面添加一项：

   ```
   hostname = ..., student.wozaixiaoyuan.com
   ```
