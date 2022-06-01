import crypto from "crypto";
import {Transaction} from "./Transaction";

export class Block {
    public nonce = Math.round(Math.random() * 999999999);

    constructor(public blockHash: string,
                public prevHash: string,
                public transaction: Transaction,
                public ts = Date.now(),) {}

    get hash() {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('sha256'); // stands for secure hash algorithm with the length of 256 bits

        //Calling the writable.end() method signals that no more data will be written to the Writable.
        hash.update(str).end(); // hash the string version of the block

        // The result of applying a cryptographic hash function to data (e.g., a message). Also known as a “message digest”
        // Message digests are designed to protect the integrity of a piece of data or media to detect changes and alterations to any part of a message.
        return hash.digest('hex'); // now return the hash value or digest as a hexadecimal string
    }
}