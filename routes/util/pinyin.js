const Router = require("koa-router");
const router = new Router();
const https = require("https");
const cheerio = require("cheerio");
const $_root = "/util";

const pinyinReqURLs = {
    baidu: "https://hanyu.baidu.com/s?wd=",
    sogou: "https://hanyu.sogou.com/result?query="
};

async function getPinyin(wd, dictionary = "auto") {
    dictionary = dictionary || "auto";
    if (!wd || !Object.keys(pinyinReqURLs).concat(["auto"]).includes(dictionary)) return {
        data: {},
        error: {
            code: "INVALID PARAM",
            message: "参数错误。"
        }
    };
    let _pinyinReqURLs = {};
    if (dictionary != "auto") _pinyinReqURLs[dictionary] = pinyinReqURLs[dictionary];
    else _pinyinReqURLs = pinyinReqURLs;

    var contentData = {};
    for (const dictionaryName of Object.keys(_pinyinReqURLs)) {
        const url = _pinyinReqURLs[dictionaryName] + wd;
        contentData = {
            error: {}
        };
        await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                var chunks = [];
                var size = 0;
                res.on("data", function (chunk) {
                    chunks.push(chunk);
                    size += chunk.length;
                });
                res.on("end", function () {
                    const data = Buffer.concat(chunks, size);
                    const html = data.toString();
                    const $ = cheerio.load(html);
                    var pinyin;
                    switch (dictionaryName) {
                        case "baidu": {
                            let t_pinyin = $(".pinyin").text();
                            pinyin = t_pinyin
                                .slice(0, t_pinyin.length - 2)
                                .slice(2)
                                .split(" ][ ");
                            break;
                        }
                        case "sogou": {
                            let t_pinyin = $(
                                ".words-details p strong"
                            ).text();
                            pinyin = t_pinyin
                                .slice(0, t_pinyin.length - 2)
                                .slice(2)
                                .split(" ][ ");
                            break;
                        }
                    }
                    contentData.data = {
                        query: wd,
                        pinyin: pinyin,
                        dictionary: dictionaryName,
                        statusCode: res.statusCode
                    };
                    if (!pinyin[0]) {
                        contentData.data.pinyin = [];
                        contentData.error.code = "FAILED SEARCH";
                        contentData.error.message = `词典中检索不到词语「${wd}」。`;
                    } else {
                        contentData.error = {};
                    }
                    resolve(contentData);
                });
                res.on("error", (e) => reject(e));
            })
        }).catch(e => {
            throw e;
        });
        if (contentData.data.pinyin.length) return contentData;
    }
    return contentData;
}

router.get($_root + "/pinyin", async (ctx, next) => {
    const query = ctx.request.query;
    var data = await getPinyin(query["wd"], query["dict"]);
    ctx.body = {};
    data.status = ctx.status;
    ctx.body = data;
})

module.exports = router;