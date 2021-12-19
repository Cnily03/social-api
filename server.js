const env = (process.env.NODE_ENV || "production").trim();
const path = require("path");
const Koa = require("koa");
const bodyParser = require('koa-bodyparser');
const Router = require("koa-router");
const colors = require('colors');

const app = new Koa();
const port = 89;
const routes = {
    "index": "index",
    "api": require("./routes/api.json")
}
const staticDir = env === "development" ? "./src" : "./public";
const viewsDir = env === "development" ? "./src/views" : "./views";

// colors
colors.setTheme({
    info: "cyan",
    success: "green",
    warn: "yellow",
    error: "red"
});

// static dir
const staticServer = require('koa-static');
app.use(staticServer(path.join(__dirname, staticDir)));

// views engine
const views = require("koa-views");
app.use(views(path.join(__dirname, viewsDir), {
    extension: 'ejs'
}))

// parse request data
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}));

// routes
var routesChilds = {};

function getJsonAllChild(json, split = ".", father = "") {
    const _split = father == "" ? "" : split;
    Object.keys(json).forEach(_key => {
        if (typeof json[_key] == "object") {
            if (Object.keys(json[_key]).length)
                getJsonAllChild(json[_key], split, father + _split + _key);
        } else {
            routesChilds[father + _split + _key] = json[_key];
        }
    })
}
Object.keys(routes).forEach(_key => {
    if (_key == "api") {
        const _apiJSON = routes[_key];
        getJsonAllChild(_apiJSON, "/", "./routes");
        Object.keys(routesChilds).forEach(_key => {
            let _arr = _key.split("/");
            _arr.pop();
            _arr.push(routesChilds[_key]);
            let _router = require(_arr.join("/"));
            app.use(_router.routes()).use(_router.allowedMethods());
        })
    } else {
        let _router = require("./routes/" + routes[_key]);
        app.use(_router.routes()).use(_router.allowedMethods());
    }
});

// start the server
app.listen(port, function () {
    console.log(`Server is running at port ${port}...`.success);
})

module.exports = app;