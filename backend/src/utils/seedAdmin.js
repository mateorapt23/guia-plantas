const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { connectSQL } = require('../config/sqlserver');
const UserModel = require('../models/sql/user.model');

async function run() {
  try {
    await connectSQL();

    const name = process.env.ADMIN_NAME || 'Admin';
    const email = process.env.ADMIN_EMAIL || 'admin@plantguide.local';
    const plainPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(8).toString('base64');

    // Generar hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      console.log('Usuario existente encontrado:', email);
      if (existing.role !== 'ADMIN') {
        await UserModel.updateRole(existing.id, 'ADMIN');
        console.log('Rol actualizado a ADMIN para user id', existing.id);
      } else {
        console.log('El usuario ya tiene rol ADMIN.');
      }
    } else {
      const newAdmin = await UserModel.create({ name, email, passwordHash, role: 'ADMIN' });
      console.log('Admin creado con id:', newAdmin.id);
    }

    console.log('\nCredenciales de administrador:');
    console.log('  Email:', email);
    console.log('  Password:', plainPassword);
    console.log('\nRecomiendo cambiar la contraseña tras el primer login.');

    process.exit(0);
  } catch (error) {
    console.error('Error creando admin:', error);
    process.exit(1);
  }
}

run();
