const crypto = require('crypto')
const createBlsModule = require(`./bls_c.js`)
const blsSetupFactory = require('./bls')

const getRandomValues = crypto.randomFillSync
const bls = blsSetupFactory(createBlsModule, getRandomValues)

module.exports = bls

// React???
if (typeof window === 'object') {
  window.bls = bls
}
