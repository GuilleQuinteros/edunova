// pages/api/registrar-usuario.js
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, password, rol } = req.body;

  if (!email || !password || !rol) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  // Verificar si el email ya existe
  const { data: existente } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .maybeSingle();
    
  if (existente) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }

  // Hashear la contraseña
  const password_hash = await bcrypt.hash(password, 10);

  // Insertar nuevo usuario
  const { error } = await supabase.from('usuarios').insert([{
    email,
    password_hash,
    rol,
    activo: true,
    creado_en: new Date().toISOString()
  }]);

  if (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }

  res.status(200).json({ mensaje: 'Usuario creado exitosamente' });
}
