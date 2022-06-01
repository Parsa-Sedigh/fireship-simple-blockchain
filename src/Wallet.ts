// Wallet gives a user a public/private keypair
import crypto from "crypto";
import {Chain} from "./Chain";
import {Transaction} from "./Transaction";

/* We can allow people to securely send coin back and forth by creating a Wallet. Which is just a wrapper for a public key and a private key. The public key
* is for receiving money, the private key is for spending money. To generate a public and private key, we're gonna use a different algorithm called `rsa` which stands
* for the name of the guys that created it and unlike SHA, this is a full encryption algorithm that can encrypt data and then DECRYPT it, if you have the proper
* key to do so.
*
* To encrypt a value here, you would use the public key to convert it to cipher text which is an unreadable version of the original value. Then you would use the
* private key to decrypt it back to it's original form.
* But what we're actually more interested in, is using the keypair to create a digital signature. With signing, we don't need to encrypt the message, but instead
* create a hash of it. We then sign the hash with our private key. Then the message can be verified later using the public key.
* If anybody tried to change the message, it would produce a different hash in which case the verification would fail and that's crucial for our coin. Because
* if we didn't have a signature, then someone could intercept the transaction message and change the amount or change the payee with no way to detect that anything was
* out of ordinary.
*
* With pem format, you would normally save to a file on the user's computer, where it could be re-used in the future.
*
* Now that we have a public key and a private key, we can use it to send money to another user.
* TODO...
* Important: The signature depends on both the transaction data and the private key, but it can be verified as authentic using public key.*/
export class Wallet {
    public publicKey: string;
    public privateKey: string;

    constructor() {
        /* generateKeyPairSync() returns a new asymmetric key pair of the given type i.e, it returns an object that includes a private key and
        a public key that holds the string, buffer, and KeyObject. */
        // @ts-ignore
        const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048, // Key size in bits
            publicKeyEncoding: {type: 'spki', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
        });

        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    sendMoney(amount: number, payeePublicKey: string) {
        const transaction = new Transaction(amount, this.publicKey, this.privateKey);

        const sign = crypto.createSign('SHA256');
        sign.update(transaction.toString()).end(); // Updates the Sign content with the given data. This can be called many times with new data as it is streamed.

        const signature = sign.sign(this.privateKey); // Calculates the signature on all the data passed through . This is like creating a one-time password.
        Chain.instance.addBlock(transaction, this.publicKey, signature);
    }
}