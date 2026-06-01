// /lib/autenticacion.js
export function verificarAutenticacion(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/auth=([^;]+)/);
  const usuarioId = match ? match[1] : null;
  return usuarioId;
}
