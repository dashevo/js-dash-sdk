import { SDK as _SDK} from './SDK';
// @ts-ignore
import {PrivateKey as _PrivateKey} from '@dashevo/dashcore-lib';
// @ts-ignore
import * as _DAPIClient from '@dashevo/dapi-client';
// @ts-ignore
// import {Wallet as _Wallet, Account as _Account} from '@dashevo/wallet-lib';
import {Wallet as _Wallet, Account as _Account} from '../../../wallet-lib';

export namespace DashJS {
    export let SDK = _SDK
    //
    // export let Wallet = _Wallet
    // export let Account = _Account;
    //
    // export let PrivateKey = _PrivateKey
}
export { DashJS as default };
