# DashJS

[![Package Version](https://img.shields.io/github/package-json/v/dashevo/dashjs.svg?&style=flat-square)](https://www.npmjs.org/package/@dashevo/dashjs)
[![Build Status](https://img.shields.io/travis/com/dashevo/dashjs.svg?branch=master&style=flat-square)](https://travis-ci.com/dashevo/dashjs)

> Dash library for JavaScript/TypeScript ecosystem (Wallet, DAPI, Primitives, BLS, ...)


## Table of Contents

- [State](#state)
- [Principles](#principles)
- [Install](#install)
- [Usage](#usage)
- [License](#license)

## State

Under active development.

## Principles

Dash is a powerful new peer-to-peer platform for the next generation of financial technology. The decentralized nature of the Dash network allows for highly resilient Dash infrastructure, and the developer community needs reliable, open-source tools to implement Dash apps and services.

## Install

```sh
npm install @dashevo/dashjs
```

In order to use this library, you will need to add it to your project as a dependency.

Having [NodeJS](https://nodejs.org/) installed, just type : `npm install @dashevo/dashjs` in your terminal.

## Usage

```js
import DashJS from "@dashevo/dashjs"; 
//const DashJS = require('../build/index'); for es5
import schema from "./schema.json"; // If you want to interact with L2 (DPA)

const network = "testnet";
const opts = {
    network,
    mnemonic: "arena light cheap control apple buffalo indicate rare motor valid accident isolate",
    schema
};
const sdk = new DashJS.SDK(opts);
const acc = sdk.wallet.getAccount();
async function sendPayment(){
    const tx = await acc.createTransaction({recipient:{address:'yLptqWxjgTxtwKJuLHoGY222NnoeqYuN8h', amount:0.12}})
    console.log(tx)
}

async function readDocument() {
    const profile = await sdk.platform.fetchDocuments('profile',{},opts)
    console.log(profile);
}
```

Notes : 

- Omitting mnemonic will set the Wallet functionalities in offlineMode (for resources savings purposes) and set a default mnemonic.  
 You can use `sdk.wallet.exportWallet()` to get the randomly generated mnemonic.
- Omitting a schema will unset the Platform functionalities.

