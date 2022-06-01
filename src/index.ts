import {Wallet} from "./Wallet";
import {Chain} from "./Chain";

const satoshi = new Wallet();
const parsa = new Wallet();
const mahdi = new Wallet();

// send money to each other.
satoshi.sendMoney(50, parsa.publicKey);
parsa.sendMoney(40, mahdi.publicKey);

console.log(Chain.instance);