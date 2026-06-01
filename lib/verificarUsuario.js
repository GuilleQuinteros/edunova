// lib/verificarUsuario.js
export function verificarUsuario(req) {
  const cookies = req.headers.cookie || '';
  const cookieObj = Object.fromEntries(cookies.split('; ').map(c => c.split('=')));
  const usuario = cookieObj['usuario'];

  try {
    return usuario ? JSON.parse(decodeURIComponent(usuario)) : null;
  } catch {
    return null;
  }
}

