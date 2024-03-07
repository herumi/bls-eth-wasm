const createModule = require('../../src/bls_c.js')
const blsSetupFactory = require('../../src/bls.js')

module.exports = blsSetupFactory(createModule)

