# totp-demo
React.js time-based one-time token demo.
Client side is an ejected `create-react-app`

Requires Node 7.0+

## Uses
- [Koa.js](koajs.com)
- [Elemental UI](http://elemental-ui.com/)
- [Speakeasy](https://github.com/speakeasyjs/speakeasy)
- [QRcode](https://github.com/soldair/node-qrcode)

## Usage
Before you start make sure you have Google Authenticator or FreeOTP installed.

1. Go into `/totp-demo/client` and build the client with `npm run build`
2. Now back into `/totp-demo` and start the server with `npm start`
3. Browse [http://localhost:3000](http://localhost:3000) and scan the QR code using one of the pre-requisite apps
4. Generate a code and login using the email, password and the OTP code
