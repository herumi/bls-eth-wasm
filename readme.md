[![Build Status](https://travis-ci.org/herumi/bls-eth-wasm.png)](https://travis-ci.org/herumi/bls-eth-wasm)
# BLS signature for Node.js by WebAssembly

# Abstract
This module is built with `BLS_ETH=1` for Ethereum 2.0 spec.
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

## for Node.js
node test.js

# License

modified new BSD License
http://opensource.org/licenses/BSD-3-Clause

# Author

光成滋生 MITSUNARI Shigeo(herumi@nifty.com)
