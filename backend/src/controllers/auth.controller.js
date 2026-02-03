const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/sql/user.model');

class AuthController {
  // Registro de usuario
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validar datos
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos' 
        });
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Email inválido' 
        });
      }

      // Validar longitud de contraseña
      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'La contraseña debe tener al menos 6 caracteres' 
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'El email ya está registrado' 
        });
      }

      // Hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Crear usuario
      const newUser = await UserModel.create({
        name,
        email,
        passwordHash,
        role: 'USER'
      });

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email,
          role: newUser.role,
          surveyCompleted: newUser.surveyCompleted
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          surveyCompleted: newUser.surveyCompleted
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ 
        error: 'Error al registrar usuario' 
      });
    }
  }

  // Login de usuario
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validar datos
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y contraseña son requeridos' 
        });
      }

      // Buscar usuario
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }

      // Verificar si el usuario está activo
      if (!user.isActive) {
        return res.status(403).json({ 
          error: 'Usuario desactivado. Contacta al administrador' 
        });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role,
          surveyCompleted: user.surveyCompleted
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          surveyCompleted: user.surveyCompleted
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ 
        error: 'Error al iniciar sesión' 
      });
    }
  }

  // Obtener perfil del usuario autenticado
  static async getProfile(req, res) {
    try {
      const user = await UserModel.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado' 
        });
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          surveyCompleted: user.surveyCompleted,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({ 
        error: 'Error al obtener perfil' 
      });
    }
  }
}

module.exports = AuthController;