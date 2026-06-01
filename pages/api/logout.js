// pages/api/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // ❌ Borrar cookie 'usuario'
  res.setHeader('Set-Cookie', serialize('usuario', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0) // expira inmediatamente
  }));

  return res.status(200).json({ mensaje: 'Sesión cerrada' });
}
