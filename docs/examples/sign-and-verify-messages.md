## Sign and verify messages

DashJS exports the Message constructor `new DashJS.Message`.   

You can refer to its documentation : https://github.com/dashevo/dashcore-message/blob/master/README.md

```js
const pk = new DashJS.PrivateKey();
const message = new DashJS.Message('hello, world');
const signed = account.sign(message, pk);
const verify = message.verify(pk.toAddress().toString(), signed.toString());
```

See [code snippet](https://github.com/dashevo/DashJS/blob/master/examples/node/sign-and-verify-messages.js).
