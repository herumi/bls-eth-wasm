const crypto = require('crypto')
const createModule = require(`./bls_c.js`)
const blsSetupFactory = require('./bls')

const getRandomValues = crypto.randomFillSync
const bls = blsSetupFactory(createModule, getRandomValues)

module.exports = bls

// React???
if (typeof window === 'object') {
  window.bls = bls
}
