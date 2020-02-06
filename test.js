'use strict'
const bls = require('./bls.js')
const assert = require('assert')
const fs = require('fs')
const readline = require('readline')
const { performance } = require('perf_hooks')

const curveTest = (curveType, name) => {
  bls.init(curveType)
    .then(() => {
      try {
        console.log(`name=${name} curve order=${bls.getCurveOrder()}`)
        serializeTest()
        signatureTest()
        miscTest()
        shareTest()
        addTest()
        aggTest()
        if (curveType === bls.BLS12_381) {
          ethTest()
        }
        console.log('all ok')
        benchAll()
      } catch (e) {
        console.log(`TEST FAIL ${e}`)
        assert(false)
      }
    })
}

async function curveTestAll () {
  // can't parallel
  await curveTest(bls.BLS12_381, 'BLS12_381')
}

curveTestAll()

function serializeSubTest (t, Cstr) {
  const s = t.serializeToHexStr()
  const t2 = new Cstr()
  t2.deserializeHexStr(s)
  assert.deepEqual(t.serialize(), t2.serialize())
}

function serializeUncompressedSubTest (t, Cstr) {
  const b = t.serializeUncompressed()
  const t2 = new Cstr()
  t2.deserializeUncompressed(b)
  assert(t.isEqual(t2))
}

function serializeTest () {
  const sec = new bls.SecretKey()
  sec.setByCSPRNG()
  serializeSubTest(sec, bls.SecretKey)
  const pub = sec.getPublicKey()
  serializeSubTest(pub, bls.PublicKey)
  serializeUncompressedSubTest(pub, bls.PublicKey)
  const msg = 'abc'
  const sig = sec.sign(msg)
  serializeSubTest(sig, bls.Signature)
  serializeUncompressedSubTest(sig, bls.Signature)
  const id = new bls.Id()
  id.setStr('12345')
  serializeSubTest(id, bls.Id)
}

function signatureTest () {
  const sec = new bls.SecretKey()

  sec.setByCSPRNG()
  sec.dump('secretKey ')

  const pub = sec.getPublicKey()
  pub.dump('publicKey ')

  const msg = 'doremifa'
  console.log('msg ' + msg)
  const sig = sec.sign(msg)
  sig.dump('signature ')

  assert(pub.verify(sig, msg))
}

function bench (label, count, func) {
  const start = performance.now()
  for (let i = 0; i < count; i++) {
    func()
  }
  const end = performance.now()
  const t = (end - start) / count
  const roundTime = (Math.round(t * 1000)) / 1000
  console.log(label + ' ' + roundTime)
}

function benchBls () {
  const msg = 'hello wasm'
  const sec = new bls.SecretKey()
  sec.setByCSPRNG()
  const pub = sec.getPublicKey()
  bench('time_sign_class', 50, () => sec.sign(msg))
  const sig = sec.sign(msg)
  bench('time_verify_class', 50, () => pub.verify(sig, msg))
}

function benchAll () {
  benchBls()
}

/*
  return [min, max)
  assume min < max
*/
function randRange (min, max) {
  return min + Math.floor(Math.random() * (max - min))
}

/*
  select k of [0, n)
  @note not uniformal distribution
*/
function randSelect (k, n) {
  let a = []
  let prev = -1
  for (let i = 0; i < k; i++) {
    const v = randRange(prev + 1, n - (k - i) + 1)
    a.push(v)
    prev = v
  }
  return a
}

function miscTest () {
  const idDec = '65535'
  const id = new bls.Id()
  id.setStr(idDec)
  assert(id.getStr(), '65535')
  assert(id.getStr(16), 'ffff')
}

function shareTest () {
  const k = 4
  const n = 10
  const msg = 'this is a pen'
  const msk = []
  const mpk = []
  const idVec = []
  const secVec = []
  const pubVec = []
  const sigVec = []

  /*
    setup master secret key
  */
  for (let i = 0; i < k; i++) {
    const sk = new bls.SecretKey()
    sk.setByCSPRNG()
    msk.push(sk)

    const pk = sk.getPublicKey()
    mpk.push(pk)
  }
  const secStr = msk[0].serializeToHexStr()
  const pubStr = mpk[0].serializeToHexStr()
  const sigStr = msk[0].sign(msg).serializeToHexStr()
  assert(mpk[0].verify(msk[0].sign(msg), msg))

  /*
    key sharing
  */
  for (let i = 0; i < n; i++) {
    const id = new bls.Id()
//    blsIdSetInt(id, i + 1)
    id.setByCSPRNG()
    idVec.push(id)
    const sk = new bls.SecretKey()
    sk.share(msk, idVec[i])
    secVec.push(sk)

    const pk = new bls.PublicKey()
    pk.share(mpk, idVec[i])
    pubVec.push(pk)

    const sig = sk.sign(msg)
    sigVec.push(sig)
  }

  /*
    recover
  */
  const idxVec = randSelect(k, n)
  console.log('idxVec=' + idxVec)
  let subIdVec = []
  let subSecVec = []
  let subPubVec = []
  let subSigVec = []
  for (let i = 0; i < idxVec.length; i++) {
    let idx = idxVec[i]
    subIdVec.push(idVec[idx])
    subSecVec.push(secVec[idx])
    subPubVec.push(pubVec[idx])
    subSigVec.push(sigVec[idx])
  }
  {
    const sec = new bls.SecretKey()
    const pub = new bls.PublicKey()
    const sig = new bls.Signature()

    sec.recover(subSecVec, subIdVec)
    pub.recover(subPubVec, subIdVec)
    sig.recover(subSigVec, subIdVec)
    assert(sec.serializeToHexStr(), secStr)
    assert(pub.serializeToHexStr(), pubStr)
    assert(sig.serializeToHexStr(), sigStr)
  }
}

function addTest () {
  const n = 5
  const m = 'abc'
  const sec = []
  const pub = []
  const sig = []
  for (let i = 0; i < n; i++) {
    sec.push(new bls.SecretKey())
    sec[i].setByCSPRNG()
    pub.push(sec[i].getPublicKey())
    sig.push(sec[i].sign(m))
    assert(pub[i].verify(sig[i], m))
  }
  for (let i = 1; i < n; i++) {
    sec[0].add(sec[i])
    pub[0].add(pub[i])
    sig[0].add(sig[i])
  }
  assert(pub[0].verify(sig[0], m))
  const sig2 = sec[0].sign(m)
  assert(sig2.isEqual(sig[0]))
}

function aggTest () {
  const n = 100
  const secVec = []
  const pubVec = []
  const sigVec = []
  const msgVec = []
  for (let i = 0; i < n; i++) {
    secVec.push(new bls.SecretKey())
    secVec[i].setByCSPRNG()
    pubVec.push(secVec[i].getPublicKey())
    msgVec.push(new Uint8Array(bls.MSG_SIZE))
    sigVec.push(secVec[i].signHashWithDomain(msgVec[i]))
    assert(pubVec[i].verifyHashWithDomain(sigVec[i], msgVec[i]))
  }
  const aggSig = sigVec[0]
  for (let i = 1; i < n; i++) {
    aggSig.add(sigVec[i])
  }
  assert(aggSig.verifyAggregatedHashWithDomain(pubVec, msgVec))
}

function ethAggregateTest () {
  const sigHexTbl = [
    'b2a0bd8e837fc2a1b28ee5bcf2cddea05f0f341b375e51de9d9ee6d977c2813a5c5583c19d4e7db8d245eebd4e502163076330c988c91493a61b97504d1af85fdc167277a1664d2a43af239f76f176b215e0ee81dc42f1c011dc02d8b0a31e32',
    'b2deb7c656c86cb18c43dae94b21b107595486438e0b906f3bdb29fa316d0fc3cab1fc04c6ec9879c773849f2564d39317bfa948b4a35fc8509beafd3a2575c25c077ba8bca4df06cb547fe7ca3b107d49794b7132ef3b5493a6ffb2aad2a441',
    'a1db7274d8981999fee975159998ad1cc6d92cd8f4b559a8d29190dad41dc6c7d17f3be2056046a8bcbf4ff6f66f2a360860fdfaefa91b8eca875d54aca2b74ed7148f9e89e2913210a0d4107f68dbc9e034acfc386039ff99524faf2782de0e']
  const sigHex = '973ab0d765b734b1cbb2557bcf52392c9c7be3cd21d5bd28572d99f618c65e921f0dd82560cc103feb9f000c23c00e660e1364ed094f137e1045e73116cd75903af446df3c357540a4970ec367a7f7fa7493a5db27ca322c48d57740908585e8'
  const n = sigHexTbl.length
  const sigVec = []
  for (let i = 0; i < n; i++) {
    const sig = bls.deserializeHexStrToSignature(sigHexTbl[i])
    sigVec.push(sig)
  }
  const aggSig = new bls.Signature()
  aggSig.aggregate(sigVec)
  const s = aggSig.serializeToHexStr()
  assert(s === sigHex)
}

function ethSignOneTest (secHex, msgHex, sigHex) {
  console.log(`sec=${secHex}`)
  const sec = bls.deserializeHexStrToSecretKey(secHex)
  const pub = sec.getPublicKey()
  const msg = bls.fromHexStr(msgHex)
  const sig = sec.sign(msg)
  assert(pub.verify(sig, msg))
  const s = sig.serializeToHexStr()
  assert(s === sigHex)
}

function ethSignTest () {
  let secHex = '47b8192d77bf871b62e87859d653922725724a5c031afeabc60bcef5ff665138'
  let msgHex = '0000000000000000000000000000000000000000000000000000000000000000'
  const sigHex = 'b2deb7c656c86cb18c43dae94b21b107595486438e0b906f3bdb29fa316d0fc3cab1fc04c6ec9879c773849f2564d39317bfa948b4a35fc8509beafd3a2575c25c077ba8bca4df06cb547fe7ca3b107d49794b7132ef3b5493a6ffb2aad2a441'

  ethSignOneTest(secHex, msgHex, sigHex)
  const fileName = 'test/sign.txt'
  const rs = fs.createReadStream(fileName)
  const rl = readline.createInterface({input: rs})
  rl.on('line', (line) => {
    const [k, v] = line.split(' ')
    if (k === 'sec') {
      secHex = v
    } else if (k === 'msg') {
      msgHex = v
    } else if (k === 'out') {
      ethSignOneTest(secHex, msgHex, v)
    } else {
      assert(false)
    }
  })
}

function ethAggregateVerifyNoCheckTest () {
  const pubHexTbl = [
    'a491d1b0ecd9bb917989f0e74f0dea0422eac4a873e5e2644f368dffb9a6e20fd6e10c1b77654d067c0618f6e5a7f79a',
    'b301803f8b5ac4a1133581fc676dfedc60d891dd5fa99028805e5ea5b08d3491af75d0707adab3b70c6a6a580217bf81',
    'b53d21a4cfd562c469cc81514d4ce5a6b577d8403d32a394dc265dd190b47fa9f829fdd7963afdf972e5e77854051f6f'
  ]
  const msgHexTbl = [
    '0000000000000000000000000000000000000000000000000000000000000000',
    '5656565656565656565656565656565656565656565656565656565656565656',
    'abababababababababababababababababababababababababababababababab'
  ]
  const sigHex = '82f5bfe5550ce639985a46545e61d47c5dd1d5e015c1a82e20673698b8e02cde4f81d3d4801f5747ad8cfd7f96a8fe50171d84b5d1e2549851588a5971d52037218d4260b9e4428971a5c1969c65388873f1c49a4c4d513bdf2bc478048a18a8'
  const n = pubHexTbl.length
  const sig = bls.deserializeHexStrToSignature(sigHex)
  const pubVec = []
  let msg = ''
  for (let i = 0; i < n; i++) {
    pubVec.push(bls.deserializeHexStrToPublicKey(pubHexTbl[i]))
    msg += msgHexTbl[i]
  }
  const msgVec = bls.fromHexStr(msg)
  assert(bls.areAllMsgDifferent(msgVec, 32))
  assert(sig.aggregateVerifyNoCheck(pubVec, msgVec))
}

function ethFastAggregateVerifyTest () {
  const fileName = 'test/fast_aggregate_verify.txt'
  const rs = fs.createReadStream(fileName)
  const rl = readline.createInterface({input: rs})

  let i = 0
  let pubVec = []
  let msg = ''
  let sig = null
  rl.on('line', (line) => {
    const [k, v] = line.split(' ')
    if (k === 'pub') {
      pubVec.push(bls.deserializeHexStrToPublicKey(v))
    } else if (k === 'msg') {
      msg = bls.fromHexStr(v)
    } else if (k === 'sig') {
      console.log(`i=${i}`)
      try {
        sig = bls.deserializeHexStrToSignature(v)
      } catch (e) {
        console.log(`bad sig ${v}`)
        sig = null
      }
    } else if (k === 'out') {
      i++
      if (!sig) return
      const out = v === 'true'
      if (!sig.isValidOrder()) {
        console.log('bad order')
        pubVec = []
        return
      }
      const r = sig.fastAggregateVerify(pubVec, msg)
      assert(r === out)
      pubVec = []
    }
  })
}

function blsAggregateVerifyNoCheckTestOne (n) {
  console.log(`blsAggregateVerifyNoCheckTestOne ${n}`)
  const msgSize = 32
  const pubs = []
  const sigs = []
  const msgs = new Uint8Array(msgSize * n)
  for (let i = 0; i < n; i++) {
    var sec = new bls.SecretKey()
    sec.setByCSPRNG()
    pubs.push(sec.getPublicKey())
    msgs[msgSize * i] = i
    sigs.push(sec.sign(msgs.subarray(i * msgSize, (i + 1) * msgSize)))
  }
  assert(bls.areAllMsgDifferent(msgs, msgSize))
  const aggSig = new bls.Signature()
  aggSig.aggregate(sigs)
  assert(aggSig.aggregateVerifyNoCheck(pubs, msgs))
  msgs[1] = 1
  assert(!aggSig.aggregateVerifyNoCheck(pubs, msgs))
}

function blsAggregateVerifyNoCheckTest () {
  const tbl = [1, 2, 15, 16, 17, 50]
  tbl.forEach((n) => {
    blsAggregateVerifyNoCheckTestOne(n)
  })
}

function ethTest () {
  bls.setETHmode(1)
  ethAggregateTest()
  ethSignTest()
  ethAggregateVerifyNoCheckTest()
  ethFastAggregateVerifyTest()
  blsAggregateVerifyNoCheckTest()
}
