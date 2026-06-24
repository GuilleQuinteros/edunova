// pages/api/login.js
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, contrasena } = req.body;

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();
    console.log('contraseña: contrasena';
  if (error || !usuario) {
    return res.status(401).json({ error: 'Usuario no encontrado' });
  }

  const passwordOk = await bcrypt.compare(contrasena, usuario.password_hash);
  if (!passwordOk) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  // Definimos duración de sesión (en segundos)
  const duracionSesion = 60 * 60; // 1 hora
  const expiracionTimestamp = Date.now() + duracionSesion * 1000;

  // Seteamos cookie segura (no guarda todos los datos)
  res.setHeader('Set-Cookie', serialize('usuario', JSON.stringify({
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: duracionSesion
  }));

  // Retornamos también el dato de expiración al frontend
  return res.status(200).json({
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre || '',
      rol: usuario.rol || '',
      expiracion: expiracionTimestamp
    }
  });
}
