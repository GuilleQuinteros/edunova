import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Protegido({ children }) {
  const router = useRouter();

  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
}
