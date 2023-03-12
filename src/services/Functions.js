const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10)
    let encrypt = bcrypt.hash(password, salt)
    return encrypt
  }

  async function createJwtToken(payload) {
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "12h" });
    return token;
}

module.exports = { encryptPassword, createJwtToken };