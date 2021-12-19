# Social API

该 API Docs 集成了众多实用的 API，以及一些流行网站的公开信息调用接口。

## API 文档

API Docs: [cnily.top/social-api](https://cnily.top/social-api)

## 开发指南

位于 `routes/`目录下的 `api.json` 的写法遵守：

- JSON 的树父节点与子节点的值构成 routes 路径。
- JSON KEY 值不能包含斜杠 `/`.

如

``` json
{
  "util": {
    "extension": {
      "index2": "filename"
    },
    "index1": "test"
  }
}
```

`server.js` 将默认解析路由为

``` test
./routes/util/extension/filename(.js)
./routes/util/test(.js)
```
