[![Build Status](https://travis-ci.org/herumi/bls-eth-wasm.png)](https://travis-ci.org/herumi/bls-eth-wasm)
# BLS signature for Node.js by WebAssembly

# Abstract
This module is built with `BLS_ETH=1` for Ethereum 2.0 spec.

# News
The new [eth2.0 functions](https://github.com/ethereum/eth2.0-specs/blob/dev/specs/phase0/beacon-chain.md#bls-signatures) are supported.

Init as the followings:

```
bls.init(bls.BLS12_381)
bls.setETHmode(1)
```

then, you can use the following functions.

bls-eth-wasm | eth2.0 spec name|
------|-----------------|
SecretKey::sign|Sign|
PublicKey::verify|Verify|
Sign::aggregate|Aggregate|
Sign::fastAggregateVerify|FastAggregateVerify|
Sign::aggregateVerifyNoCheck|AggregateVerify|

The size of message must be 32 byte.

Check functions:
- verifySignatureOrder ; make `deserialize` check the correctness of the order
- Sign::isValidOrder ; check the correctness of the order
- verifyPublicKeyOrder ; make `deserialize` check the correctness of the order
- PublicKey::isValidOrder ; check the correctness of the order
- areAllMsgDifferent ; check that all messages are different each other


# Old eth2.0 spec
The `msg` in the following means 40 bytes Uint8Array data.
- `SecretKey.signHashWithDomain(msg)`
  - sign msg by secretKey
- `PublicKey.verifyHashWithDomain(sig, msg)`
  - verify sig with msg by publickey
- `Signature.verifyAggregatedHashWithDomain(pubVec, msgVec)`
  - pubVec[i] = secVec[i].getPublicKey()
  - sigVec[i] = secVec[i].signHashWithDomain(msgVec[i])
  - aggSig = sum of sigVec[i]
  - aggSig.verifyAggregatedHashWithDomain(pubVec, msgVec)
  - see aggTest() in test.js

see [bls](https://github.com/herumi/bls)

## For Node.js
node test.js

# License

modified new BSD License
http://opensource.org/licenses/BSD-3-Clause

# Author

MITSUNARI Shigeo(herumi@nifty.com)
