const createModule = require('./bls_c.js')
const blsSetupFactory = require('./bls')

function randomFillByPlatform() {
  if (typeof window === 'object') {
    const crypto = global.crypto || global.msCrypto
    if (crypto.getRandomValues) {
      return (x) => crypto.getRandomValues(x)
    }
  }
  if (typeof require === 'function') {
    return require('crypto').randomFillSync
  }
  throw Error('Secure random number generation not supported')
}

const bls = blsSetupFactory(createModule, randomFillByPlatform())
module.exports = bls
