A block is like a container for multiple transactions. In oru case, just a single transaction to keep things simple. A block is like a
linked list. Because each block has a reference or link to the previous block in the chain with the previous hash property.

A hashing function allows you to take a value of an arbitrary size like say a transaction, then map it to a value with a fixed length, like a hexadecimal 
string. The value returned from the hashing function is often called a hash or a hash digest.
When you create a hash, it cannot be reversed to reconstruct the contents of the original value, but what you can do, is VALIDATE that two values are 
identical by comparing their hashes and that's important for a blockchain because it ensures that two blocks can be linked together without being 
manipulated.

To create a hash of a block, we're gonna implement a getter.

SHA256 is a secure hash algorithm with a length of 256bits and it's known as a one-way cryptographic function which means that it can encrypt data, but it cannot
decrypt data back to it's original form. We can use the createHash() function to hash the string version of the block then return the hash value or digest
as a hexadecimal string and that's all it takes to build a block. IN THIS CASE, it's a transaction that has a link to the previous transaction in the form of a 
hash and it also contains a timestamp because all blocks will be placed in chronological order.

Now let's go to chain which is like a linked list of blocks. 
There should only be one blockchain, so we make it a singleton instance by setting up a static instance property that is equal to a new Chain instance. That'll
just ensure that we have one chain instantiated before anything else.

In the constructor of Chain class, we define the first block in the chain which is called the genesis block, so the previous hash is null, because there's nothing
for it to link to. Then we instantiate a new Transaction that transfers a hundred coins to satoshi. Notice that we're creating money out of thin air here!!!
That's no difference than when the central bankers or federal reserve turn on the money printer.

Now in the Blockchain(Chain) class, we'll often need to grab the last block in the chain, so we create a getter for it to help us out with that. 

With signature, we can verify it before adding a new block to the chain. A naive and simple implementation is: We instantiate a new block, taking the last
block's hash and this new transaction and we push that block onto the chain. But the problem is that there's no way to know that this is a legitimate transaction. 
Anybody could send arbitrary transaction data to transfer coin to someone else. 
We can allow people to securely send coin back and forth by implementing a wallet which is just a wrapper for a public key and a private key. The public key 
is for receiving money and the private key is for spending money.
To generate a public and private key, we're going to use a different algorithm called RSA which stands for names of the guys that created it: Rivest-Shamir-Adleman and
unlike SHA, this is a full encryption algorithm that can encrypt data and then decrypt it if you have the proper key to do so. To encrypt a value, you would use the
public key to convert it to ciphertext which is an unreadable version fo the original value. Then you would use the private key to decrypt it back to it's 
original form. But what we're actually more interested in, is using the key pair to create a digital signature.

Important: Encryption is two-way, while hashing is one way.

With signing, we don't need to encrypt the message but instead create a hash of it. We then sign the hash with our private key, then the message can be verified later
using the public key. If anybody tried to change the message, it would produce a different hash, in which case the verification would fail and that's crucial for a 
coin. Because if we didn't have a signature, then someone could intercept the transaction message and change the amount or change the payee with no way to 
detect that anything was out of the ordinary.

Now when generating the key pair with node, we're gonna format them as strings and to do that, we use some extra options for encoding and the crucial one if the 
format 'pem' which you would normally save to a file on the user's computer where it could be re-used in the future and noramlly that file begins with sth like:
---- BEING RSA PRIVATE KEY ----

Now that we have a public key and a private key, we can use it to send money to another user. For doing this, we need the amount and the public key of the user being paid.
Then we create a signature.

To create a signature, by signing it with a private key. This is kind of like creating a one time password. It allows us to verify our 
identity with the private key, without actually having to expose the private key.
Important: So the signature depends on both the transaction data and the private key, but it can be verified as authentic, using the public key.

We can now attempt to add that block to  the blockchain, by passing the transaction, the public key and the signature.
In real life, those values would be transferred over the internet, then the signature could be verified.

But there's still one more big issue with our blockchain and that is the double spend issue. 
Imagine the spender try to send money to two different users at the same time. They could potentially spend more money than they actually own, before
their transaction is confirmed on the blockchain. The way bitcoin addresses that issue, is with a proof of work system, which requires each new block
to go through a process called mining, where a difficult computational problem is solved in order to confirm the block, but it's very easy to verify that work
by multiple other nodes on the system. When mining is distributed around the world, it means you have multiple nodes competing to confirm a block on the blockchain
and works like a big lottery. The winner of lottery, ears a portion of the coin as incentive which motivates people to invest in the computing resources to mine a coin and
also to pump the price of the coin higher, because the higher the price, the more money you make.
You can think of it like converting cloud computing resources into money.

So that problem is hard to solve BUT easy to verify.

To implement a basic proof of work system, add a nonce value to Block class, which is one-time use random number.

Now in mine() of Chain class, it attempts to find a number that when added to the nonce, will produce a hash that starts with 4 zeros.
The ONLY real way to figure out that value is with brute force by creating a while loop.

MD5 algorithm is very similar to SHA=256 but is only a 128 bits and is faster to compute. MD5 is message-digest algorithm.
We'll continue to create new hashes inside the while loop until we find the one that starts with 0000, when we find it, we return the solution and send it
to other nodes where it can be verified and the block can finally be confirmed on the blockchain.

If we log the Chain itself, you can see we have a bunch of blocks or transactions(in this case we only have one transaction per block) linked to each other based on a 
hash of the previous block.