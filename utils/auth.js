const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const registerUser = async (email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ email, password: hashedPassword, is_verified: false });
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
};

const resetPassword = async (resetToken, newPassword) => {
  const user = await User.findOne({ where: { resetToken } });
  if (!user) {
    throw new Error('Invalid reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashedPassword, resetToken: null }, { where: { id: user.id } });
  return user;
};

module.exports = { registerUser, loginUser, resetPassword };
