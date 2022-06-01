import crypto from "crypto";
import {Transaction} from "./Transaction";
import {Block} from "./Block";

// The blockchain
export class Chain {
    // Singleton instance
    public static instance = new Chain();

    chain: Block[];

    constructor() {
        // Genesis block
        this.chain = [new Block('', new Transaction(100, 'genesis', 'satoshi'))];
    }

    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Proof of work system
    /* This method will attempt to find a number that when added to the nonce, will produce a hash that starts with 0000(in OUR implementation) . The only real way to find that
    * value is by using brute force technique.
    * This while loop here, will go digit by digit until we find the requested value.
    * MD5 is similar to SHA256, but it's only 128 bits, therefore faster to compute. */
    mine(nonce: number) {
        let solution = 1;
        console.log('⛏ ️mining...');

        while (true) {
            const hash = crypto.createHash('MD5');
            hash.update((nonce + solution).toString()).end();

            const attempt = hash.digest('hex');

            if (attempt.substr(0, 4) === '0000') {
                console.log(`Solved: ${solution}`);
                return solution; // return the solution and send it to other nodes where it can be verified and the block can finally be confirmed on the blokchain.
            }

            solution += 1;
        }
    }

    // Add a new block to the chain if valid signature & proof of work is complete
    addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer) {
        const verifier = crypto.createVerify('SHA256');
        verifier.update(transaction.toString());

        const isValid = verifier.verify(senderPublicKey, signature);

        /* If isValid is true, we can verify that that user is actually trying to spend that amount of money to the other user. */
        if (isValid) {
            console.log('last: ', this.lastBlock.hash)
            const newBlock = new Block(this.lastBlock.hash, transaction);

            /* To find out this is a legitimate transaction, so anybody cannot send arbitrary transaction data to transfer coin to someone else, so we need
            * the mining process.*/
            this.mine(newBlock.nonce);
            this.chain.push(newBlock);
        }
    }
}