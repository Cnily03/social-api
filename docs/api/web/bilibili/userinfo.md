# 用户信息

用于获取B站用户基本信息。已过滤掉较敏感信息，保留完全公开、不敏感的信息。

## **API 请求地址**

{==

``` http
GET /web/bilibili/userinfo
```

==}

## **参数**

  | 参数 | 类型   | 默认值 | 必要性                                   | 描述            |
  | ---- | ------ | ------ | ---------------------------------------- | --------------- |
  | mid  | Number |        | :material-checkbox-multiple-marked: 必要 | 用户 MID（UID） |

??? param-required text-xxl title-xxl "mid"

    :material-checkbox-multiple-marked: 必要 　
    :material-format-list-bulleted-type: 类型 `Number`

    用户MID（也称为UID），即用户空间地址后的一串数字。例如罗翔老师的B站个人空间地址为`https://space.bilibili.com/517327498`，则其 MID 为 `517327498`.

## **响应**

### Content-Type

!!! info text-xxl no-title no-list-dot no-list-margin ""

    `application/json; charset=utf-8`

### 响应数据

!!! info text-xxl no-title no-list-dot no-list-margin ""
  
    - **`status`** : `Number` - 客户端访问 API 服务器的状态码。
    - **`error`** : `JSON` - 出现错误时含有含有 KEY `code` 和 `message`.
    - **`data`** : `JSON` - 查询结果。
        - **`statusCode`** : `Number` - 服务器访问B站服务器的状态码。
        - **`mid`** : `Number` - 用户 MID.
        - **`nickname`** : `String` - 用户昵称。
        - **`sign`** : `String` - 用户个性签名。
        - **`sex`** : `String` - 用户性别。
            - :material-text: 值 `男`|`女`|`保密`
        - **`followers`** : `Number` - 用户的粉丝数。
        - **`following`** : `Number` - 用户的关注数。
        - **`archiveCount`** : `Number` - 用户有效稿件数。
        - **`level`** : `Number` - 用户等级。
            - :material-text: 值 `0`~`6`
        - **`verify`** : `String` - 认证信息。
            - **`role`** : `Number` - 认证类型。
                - :material-text: 值 `0` 　[](){.icon-bili-tv-pink} 普通用户
                - :material-text: 值 `1` 　[](){.icon-bili-official-personal} 知名UP主认证
                - :material-text: 值 `2` 　[](){.icon-bili-official-personal} 身份认证
                - :material-text: 值 `3` 　[](){.icon-bili-official-business} 企业认证
                - :material-text: 值 `4` 　[](){.icon-bili-official-business} 政府认证
                - :material-text: 值 `5` 　[](){.icon-bili-official-business} 媒体认证
                - :material-text: 值 `6` 　[](){.icon-bili-official-business} 组织认证
                - :material-text: 值 `9` 　[](){.icon-bili-official-personal} 社会名人认证
            - **`title`** : `String` - 认证信息。
            - **`description`** : `String` - 认证具体描述。
        -  **`vip`** : `String` - 大会员信息。
            - **`type`** : `Number` - 大会员类型。
                - :material-text: 值 `0` 　[](){.icon-bili-tv-blue} 普通用户
                - :material-text: 值 `1` 　[](){.icon-bili-vip} 月度大会员
                - :material-text: 值 `2` 　[](){.icon-bili-vip} 年度大会员
            - **`text`** : `String` - 大会员说明。

## **示例**

???+ success text-xxl title-xl "常规请求"

    === "请求"

        ``` http
        GET /web/bilibili/userinfo?mid=517327498
        ```

    === "响应"

        ``` json
        HTTP/1.1 200 OK
        Content-Type: application/json; charset=utf-8
        Content-Length: 525

        {
          "data": {
            "statusCode": 200,
            "mid": 517327498,
            "nickname": "罗翔说刑法",
            "sign": "厚大法考刑法独家授课老师，工作邮箱：**********@126.com",
            "sex": "保密",
            "followers": 20259480,
            "following": 13,
            "archiveCount": 220,
            "level": 6,
            "verify": {
              "role": 2,
              "title": "中国政法大学教授、2020年度最高人气UP主、bilibili 2020百大UP主",
              "description": "中国政法大学教授，代表作《刑法学讲义》《圆圈正义》《罗翔讲刑法》"
            },
            "vip": {
              "type": 2,
              "text": "年度大会员"
            }
          },
          "error": {},
          "status": 200
        }
        ```

???+ warning text-xxl title-xl "用户不存在"

    === "请求"

        ``` http
        GET /web/bilibili/userinfo?mid=0
        ```

    === "响应"

        ``` json
        HTTP/1.1 200 OK
        Content-Type: application/json; charset=utf-8
        Content-Length: 85

        {
          "data": {},
          "error": {
            "code": "NOTHING FOUND",
            "message": "啥都木有。"
          },
          "status": 200
        }
        ```

???+ failure text-xxl title-xl "错误请求"

    === "请求"

        ``` http
        GET /web/bilibili/userinfo?mid=abc
        ```

    === "响应"

        ``` json
        HTTP/1.1 200 OK
        Content-Type: application/json; charset=utf-8
        Content-Length: 85

        {
          "data": {},
          "error": {
            "code": "INVALID PARAM",
            "message": "参数错误。"
          },
          "status": 200
        }
        ```
