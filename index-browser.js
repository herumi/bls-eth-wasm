const createModule = require(`./bls_c.js`);
const blsSetupFactory = require("./bls");

const crypto = window.crypto || window.msCrypto;
const getRandomValues = (x) => crypto.getRandomValues(x);
const bls = blsSetupFactory(createModule, getRandomValues);

module.exports = bls;
