## Wallet

```js
const sdk = new DashJS.SDK(opts);
let wallet = sdk.wallet;
let account = wallet.getAccount();
```

Creation of a wallet is being done automatically depending of the mnemonic options given to the SDK class.  
In case of excluding providing a mnemonic, a generated mnemonic is created (`sdk.wallet.getWallet()`) and the Wallet is put in offlineMode.  

### Wallet

See [Wallet-lib/Wallet](https://github.com/dashevo/wallet-lib/blob/master/docs/wallet.md) documentation  

### Account
See [Wallet-lib/Account](https://github.com/dashevo/wallet-lib/blob/master/docs/account.md) documentation
