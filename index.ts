import * as crypto from 'crypto';

// Transfer of funds between two wallets
class Transaction {
    constructor(public amount: number,
                public payer: string, // public key
                public payee: string // public key
     ) {}

    toString() {
        return JSON.stringify(this);
    }
}

class Block {
    public nonce = Math.round(Math.random() * 999999999);

    constructor(public prevHash: string,
                public transaction: Transaction,
                public ts = Date.now()) {}

    get hash() {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('sha256');
        hash.update(str).end();

        return hash.digest('hex');
    }
}

class Chain {
    public static instance = new Chain();

    chain: Block[];

    constructor() {
        // Genesis block
        this.chain = [new Block('', new Transaction(100, 'genesis', 'satoshi'))];
    }

    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new block to the chain if valid signature & proof of work is complete
    addBlock(transaction: Transaction, senderPublicKey: string, signature: string) {
        const verifier = crypto.createVerify('SHA256');
        verifier.update(transaction.toString());

        const isValid = verifier.verify(senderPublicKey, signature);

        /* If isValid is true, we can verify that that user is actually trying to spend that amount of money to the other user. */
        if (isValid) {
            const newBlock = new Block(this.lastBlock.hash, transaction);
            this.chain.push(newBlock);
        }
    }

    // Proof of work system
    mine(nonce: number) {
        let solution = 1;
        console.log('mining...');

        while (true) {
            const hash = crypto.createHash('MD5');
            hash.update((nonce + solution).toString()).end();

            const attempt = hash.digest('hex');

            if (attempt.substr(0, 4) === '0000') {
                console.log(`Solved: ${solution}`);
                return solution;
            }

            solution += 1;
        }
    }
}

// Wallet gives a user a public/private keypair
class Wallet {
    public publicKey: string;
    public privateKey: string;

    constructor() {
        const keypair = crypto.generateKeySync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {type: 'spki', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs', format: 'pem'},
        });

        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
    }

    sendMoney(amount: number, payeePublicKey: string) {
        const transaction = new Transaction(amount, this.publicKey, this.privateKey);

        const sign = crypto.createSign('SHA256');
        sign.update(transaction.toString()).end();

        const signature = sign.sign(this.privateKey);
        Chain.instance.addBlock(transaction, this.publicKey, signature);
    }
}

const satoshi = new Wallet();
const parsa = new Wallet();
const mahdi = new Wallet();

satoshi.sendMoney(50, parsa.publicKey);
parsa.sendMoney(40, mahdi.publicKey);

console.log(Chain.instance);