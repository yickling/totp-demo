const Koa = require('koa');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const mount = require('koa-mount');
const router = require('koa-router')();

const validEmail = "tester@test.com";
const validPassword = "test";

var secret;

const app = new Koa();
app.use(cors())
app.use(bodyParser())

router
  .post('/register-otp', async (ctx, next) => {
    secret = speakeasy.generateSecret();// Get the data URL of the authenticator URL
    img_data = await new Promise((resolve, reject) => {
      qrcode.toDataURL(secret.otpauth_url, function(err, data_url) {
        resolve(data_url);
      });
    });

    ctx.response.body = img_data;
  })
  .post('/login', async (ctx, next) => {
    const { email, password, userToken } = ctx.request.body;

    if (!secret) {
      ctx.throw(401, "uninitialized");
    }

    if (email !== validEmail)
      ctx.throw(401, "badEmail");

    if (password !== validPassword)
      ctx.throw(401, "badPassword");

    const verified = speakeasy.totp.verify({ secret: secret.base32,
                                         encoding: 'base32',
                                         token: userToken });

    if (!verified)
      ctx.throw(401, "badUserToken");

    ctx.response.body = "ok";
  });

app
  .use(mount(koaStatic('./client/build')))
  .use(router.routes());

console.log("Server now running on localhost:3000");
console.log("Open browser to http://localhost:3000 to try login with an OTP");
app.listen(3000);