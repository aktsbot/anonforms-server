const crypto = require('crypto');

const sha256 = (text) => {
  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex');
}

module.exports = {
  sha256
}
