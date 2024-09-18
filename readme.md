[![Build Status](https://github.com/herumi/bls-eth-wasm/actions/workflows/main.yml/badge.svg)](https://github.com/herumi/bls-eth-wasm/actions/workflows/main.yml)

# BLS signature for Node.js by WebAssembly

# Abstract
This module is built with `BLS_ETH=1` for Ethereum 2.0 spec.

# News
- 2024/Sep/18 : About 10% performance improvement
- 2022/Jul/20 : 1.1 times improved
- 2021/Aug/28 : improve performance of `{G1,G2}::isValidOrder()`
- 2020/Nov/04 : break backward compatibility (bls.js is renamed to index.js)
  - use blsSetupFactory to make bls instance on browser (see the top of bls-demo.js)
- 2020/Oct/01 : add `bls.multiVerify` to verify all {sigs, pubs, msgs}.
- 2020/Jul/06 ; `setETHmode(bls.ETH_MODE_DRAFT_07)` is default mode

## How to use
The version `v0.4.2` breaks backward compatibility of the entry point.

- Node.js : `const bls = require('bls-eth-wasm')`
- React : `const bls = require('bls-eth-wasm/browser')`
- HTML : `<script src="https://herumi.github.io/bls-eth-wasm/browser/bls.js"></script>`

Init as the followings:

```
bls.init(bls.BLS12_381)
```

(old) The new [eth2.0 functions](https://github.com/ethereum/eth2.0-specs/blob/dev/specs/phase0/beacon-chain.md#bls-signatures) are supported. This mode will be removed in the future.

Init as the followings:

```
bls.init(bls.BLS12_381)
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

see [bls](https://github.com/herumi/bls)

## How to build src/bls_c.js
Install [Emscripten](https://emscripten.org/).
```
cd src
git submodule update --init
make
```

## For Node.js
node test.js

## Browser demo

see [bls-demo](https://herumi.github.io/bls-eth-wasm/browser/demo.html).

See `browser/readme.md` to make `browser/bls.js`.

## for React

```
const bls = require('bls-eth-wasm/browser')
```

# License

modified new BSD License
http://opensource.org/licenses/BSD-3-Clause

# Author

MITSUNARI Shigeo(herumi@nifty.com)

# Sponsors welcome
[GitHub Sponsor](https://github.com/sponsors/herumi)
