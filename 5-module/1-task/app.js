const path = require("path");
const Koa = require("koa");
const { EventEmitter } = require("events");

const app = new Koa();

app.use(require("koa-static")(path.join(__dirname, "public")));
app.use(require("koa-bodyparser")());

const Router = require("koa-router");
const router = new Router();
const ee = new EventEmitter();

router.get("/subscribe", async (ctx, next) => {
  await new Promise((resolve, reject) => {
    ee.once("message", resolve);
  }).then(res => {
    ctx.status = 200;
    ctx.response.body = res;
  });
});

router.post("/publish", async (ctx, next) => {
  if (ctx.request.body.message) {
    ee.emit("message", ctx.request.body.message);
  }
  ctx.response.status = 201;
});

app.use(router.routes());

module.exports = app;
