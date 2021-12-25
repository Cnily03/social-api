# 汉语拼音

用于根据词语获取汉语拼音，可作为拼音词典使用。

## **API 请求地址**

{==

``` http
GET /util/pinyin
```

==}

## **参数**

  | 参数 | 类型   | 默认值 | 必要性                                          | 描述       |
  | ---- | ------ | ------ | ----------------------------------------------- | ---------- |
  | wd   | String |        | :material-checkbox-multiple-marked: 必要        | 查询的词语 |
  | dict | String | auto   | :material-checkbox-multiple-blank-outline: 可选 | 词典       |

??? param-required text-xxl title-xxl tight tight-start "wd"

    :material-checkbox-multiple-marked: 必要 　
    :material-format-list-bulleted-type: 类型 `String`

    查询的词语。

??? param-optional text-xxl title-xxl tight tight-end "dict"

    :material-checkbox-multiple-blank-outline: 可选 　
    :material-format-list-bulleted-type: 类型 `String` 　
    :octicons-milestone-24: 默认 `auto`
  
    选择查找的词典，将在程序已设置的词典集中查找直至查到词语。

    | 可选值 | 描述                                |
    | ------ | ----------------------------------- |
    | auto   | 自动查找                            |
    | baidu  | [百度汉语](https://hanyu.baidu.com) |
    | sogou  | [搜狗汉语](https://hanyu.sogou.com) |

## **响应**

### Content-Type

!!! info text-xxl no-title no-list-dot no-list-margin ""

    `application/json; charset=utf-8`

### 响应数据

!!! info text-xxl no-title no-list-dot no-list-margin ""
  
    - **`status`** : `Number` - 客户端访问 API 服务器的状态码。
    - **`error`** : `JSON` - 出现错误时含有含有 KEY `code` 和 `message`.
    - **`data`** : `JSON` - 查询结果。
        - **`statusCode`** : `Number` - 服务器访问词典的状态码。
        - **`query`** : `String` - 查询的词语。
        - **`pinyin`** : `String[]` -  包含拼音的数组。
        - **`dictionary`** : `String` - 该查询结果根据的词典。

## **示例**

???+ success text-xxl title-xl "常规请求"

    === "请求"

        ``` http
        GET /util/pinyin?wd=巷道
        GET /util/pinyin?wd=巷道&dict=auto
        ```

    === "响应"

        ``` json
        HTTP/1.1 200 OK
        Content-Type: application/json; charset=utf-8
        Content-Length: 127

        {
          "error": {},
          "data": {
            "query": "巷道",
            "pinyin": [
              "hàng dào",
              "xiàng dào"
            ],
            "dictionary": "baidu",
            "statusCode": 200
          },
          "status": 200
        }
        ```

???+ success text-xxl title-xl "指定词典"

    === "请求"

        ``` http
        GET /util/pinyin?wd=魑魅魍魉&dict=sogou
        ```

    === "响应"

        ``` json
        HTTP/1.1 200 OK
        Content-Type: application/json; charset=utf-8
        Content-Length: 131

        {
          "error": {},
          "data": {
            "query": "魑魅魍魉",
            "pinyin": [
              "chī mèi wǎng liǎng"
            ],
            "dictionary": "sogou",
            "statusCode": 200
          },
          "status": 200
        }
        ```

???+ warning text-xxl title-xl "查无此字"

    === "请求"

        ``` http
        GET /util/pinyin?wd=册逝
        ```

    === "响应"

        ``` json
        HTTP/1.1 200 OK
        Content-Type: application/json; charset=utf-8
        Content-Length: 178

        {
          "error": {
            "code": "FAILED SEARCH",
            "message": "词典中检索不到词语「册逝」。"
          },
          "data": {
            "query": "册逝",
            "pinyin": [],
            "dictionary": "sogou",
            "statusCode": 200
          },
          "status": 200
        }
        ```

???+ failure text-xxl title-xl "错误请求"

    === "请求"

        ``` http
        GET /util/pinyin?param=invalid
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
