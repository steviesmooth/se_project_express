const crypto = require("crypto"); // importing the crypto module

const JWT_SECRET = crypto
  .randomBytes(16) // generating a random sequence of 16 bytes (128 bits)
  .toString("hex"); // converting it into a string
module.exports = { JWT_SECRET };
