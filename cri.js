const crypto = require('crypto');

// Generate a 32-byte long key
const key = crypto.randomBytes(32).toString('hex');

console.log('Generated 32-byte key:', key);