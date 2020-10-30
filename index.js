const crypto = require('crypto')
const createBlsModule = require(`./bls_c.js`)
const blsSetupFactory = require('./bls')

const bls = {}

const getRandomValues = crypto.randomFillSync
blsSetupFactory(createBlsModule, getRandomValues, bls)

module.exports = bls
