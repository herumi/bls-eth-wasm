'use strict'
const bls = require('../src/index.js')
const assert = require('assert')
const { performance } = require('perf_hooks')

const curveTest = (curveType, name) => {
  bls.init(curveType)
    .then(() => {
      try {
        console.log(`name=${name} curve order=${bls.getCurveOrder()}`)
        benchAll()
      } catch (e) {
        console.log("TEST FAIL", e)
        assert(false)
      }
    })
}

async function curveTestAll () {
  // can't parallel
  await curveTest(bls.BLS12_381, 'BLS12_381')
}

curveTestAll()

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
  bench('time_sign_class', 1000, () => sec.sign(msg))
  const sig = sec.sign(msg)
  bench('time_verify_class', 300, () => pub.verify(sig, msg))
}

function benchAll () {
  benchBls()
}

