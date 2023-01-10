const createModule = require('../../src/bls_c.js')
const blsSetupFactory = require('../../src/bls.js')
const crypto = self.crypto || self.msCrypto

const getRandomValues = x => crypto.getRandomValues(x)
const bls = blsSetupFactory(createModule, getRandomValues)

module.exports = bls

