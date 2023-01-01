const bcrypt = require("bcrypt");
const comparePassword = async (password, hashedPassword) => {
  const isSame = await bcrypt.compare(password, hashedPassword);
  return isSame;
};

module.exports = comparePassword;
