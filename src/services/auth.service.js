const { User } = require('../models');
const jwt = require('jsonwebtoken');

class AuthService {
  static async registerUser(userData) {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) throw new Error('El correo electrónico ya está registrado.');
    
    const newUser = await User.create(userData);
    const { password, ...userWithoutPassword } = newUser.toJSON();
    return userWithoutPassword;
  }

  static async loginUser(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Credenciales inválidas.');

    const isMatch = await user.validPassword(password);
    if (!isMatch) throw new Error('Credenciales inválidas.');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    };
  }
}

module.exports = AuthService;