import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminOnly({ children }) {
  const router = useRouter();

  useEffect(() => {
    const usuarioStr = localStorage.getItem('usuario');

    if (!usuarioStr) {
      router.push('/login');
      return;
    }

    const usuario = JSON.parse(usuarioStr);

    if (usuario.rol !== 'admin') {
      router.push('/admin/dashboard');
    }
  }, []);

  return children;
}