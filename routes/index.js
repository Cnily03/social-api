const Router = require("koa-router");
const router = new Router();
const $_root = "/";

router.get($_root, async (ctx, next) => {
    ctx.response.redirect("https://social-api.cnily.top");
})

module.exports = router;