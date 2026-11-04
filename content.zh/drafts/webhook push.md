---
weight: 10
title: "Webhook 消息推送"
description: Webhook 消息推送
bookFlatSection: false
bookCollapseSection: false
bookHidden: false
---

# Webhook 消息推送

{{< tabs "uniqueid" >}}
{{< tab "Telegram" >}}
## Telegram

### POST

> https://core.telegram.org/bots/api#sendmessage

获取 Telegram Bot 相关 `chat_id`

```
https://api.telegram.org/bot{token}/getUpdates
```

URL

```
https://api.telegram.org/bot{token}/
```

body

``` json
{
   "method":"sendMessage",
   "chat_id":{chat_id},
   "text":"<Message Content>",
   "parse_mode":"Markdown",
   "disable_web_page_preview":true
}
```

### Python

> https://python-telegram-bot.org/

安装 Python Telegram Bot API

``` console
pip install python-telegram-bot
```

发送信息

``` python
import telegram

def main():
    # 代理请求
    proxy = telegram.utils.request.Request(proxy_url='socks5://127.0.0.1:1080')
    bot = telegram.Bot({token}, request=proxy)
    bot.send_message(chat_id={chat_id}, text="<Message Content>")

if __name__ == '__main__':
    main()
```
{{< /tab >}}

{{< tab "Lark" >}}

## Lark

> [https://open.larksuite.com/document/](https://open.larksuite.com/document/uAjLw4CM/ukTMukTMukTM/bot-v3/use-custom-bots-in-a-group)

URL

```
https://open.larksuite.com/open-apis/bot/v2/hook/{token}
```

head

```
Content-Type: application/json
```

body

*text*

``` json
{
   "msg_type":"text",
   "content":{
      "text":"<Message Content>"
   }
}
```

*rich text*

``` json
{
  "msg_type": "post",
  "content": {
    "post": {
      "zh-CN": {
        "title": "<Title>",
        "content": [
          [
            {
              "tag": "text",
              "text": "<Text Content>"
            },
            {
              "tag": "a",
              "text": "<Text Content>",
              "href": "<URL>"
            }
          ]
        ]
      }
    }
  }
}
```

curl

``` console
curl -X POST -H "Content-Type: application/json" \
        -d '{"msg_type":"text","content":{"text":"<Message Content>"}}' \
  ​https://open.larksuite.com/open-apis/bot/v2/hook/{token}​ 
```
{{< /tab >}}

{{< tab "Dingtalk" >}}

## Dingtalk

> https://www.dingtalk.com/qidian/help-detail-20781541.html

URL

```
https://oapi.dingtalk.com/robot/send?access_token={token}
```

head

```
Content-Type: application/json;charset=utf-8
```

body

``` json
{
   "msgtype":"text",
   "text":{
      "content":"Message Content"
   }
}
```
{{< /tab >}}
{{< /tabs >}}
