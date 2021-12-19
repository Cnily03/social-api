const Router = require("koa-router");
const router = new Router();
const https = require("https");
const cheerio = require("cheerio");
const $_root = "/web/bilibili";

async function getFans(mid) {
    mid = mid || "";
    var _mid;
    try {
        _mid = parseInt(mid);
    } finally {
        if (typeof _mid != "number" || mid.toString().length == 0 || !/^[0-9]*$/.test(mid))
            return {
                data: {},
                error: {
                    code: "INVALID PARAM",
                    message: "参数错误。"
                }
            };
    }
    var contentData = {
        data: {},
        error: {}
    };
    const url = "https://api.bilibili.com/x/web-interface/card?photo=false&mid=" + _mid;
    await new Promise((resolve, reject) => {
        https.get(url, (res) => {
            var chunks = [];
            var size = 0;
            res.on("data", function (chunk) {
                chunks.push(chunk);
                size += chunk.length;
            });
            res.on("end", function () {
                const data = JSON.parse(Buffer.concat(chunks, size).toString());
                if (data.code === 0) {
                    contentData.data = {
                        statusCode: res.statusCode,
                        mid: parseInt(data.data.card.mid),
                        nickname: data.data.card.name,
                        sign: data.data.card.sign,
                        sex: data.data.card.sex,
                        followers: data.data.follower || data.data.card.fans,
                        following: data.data.card.attention,
                        archiveCount: data.data.archive_count,
                        level: data.data.card.level_info.current_level,
                        verify: {
                            role: data.data.card.Official.role,
                            title: data.data.card.Official.title,
                            description: data.data.card.Official.desc
                        },
                        vip: {
                            type: data.data.card.vip.type,
                            text: data.data.card.vip.label.text
                        }
                    }
                } else if (data.message = "啥都木有") {
                    contentData.error = {
                        code: "NOTHING FOUND",
                        message: "啥都木有。"
                    }
                } else {
                    contentData.error = {
                        code: "UNCAUGHT ERROR",
                        message: data.message
                    }
                }
                resolve(contentData);
            })
            res.on("error", (e) => reject(e));
        });
    }).catch(e => {
        throw e;
    });
    return contentData;
}

router.get($_root + "/userinfo", async (ctx, next) => {
    const query = ctx.request.query;
    var data = await getFans(query["mid"]);
    ctx.body = {};
    data.status = ctx.status;
    ctx.body = data;
})

module.exports = router;