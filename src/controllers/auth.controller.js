const AuthService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({ message: 'Usuario registrado exitosamente', data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    res.status(200).json({ message: 'Inicio de sesión exitoso', ...result });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};