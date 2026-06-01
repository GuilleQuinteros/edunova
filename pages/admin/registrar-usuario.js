// pages/registrar-usuario.js
import Protegido from '@/components/Protegido';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegistrarUsuario() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('admin'); // Por defecto
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/registrar-usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rol }),
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje('Usuario registrado correctamente.');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setMensaje(data.error || 'Error al registrar.');
    }
  };

  return (
    <Protegido>
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">Registrar Usuario</h3>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Rol</label>
          <select
            className="form-select"
            value={rol}
            onChange={e => setRol(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Registrar
        </button>
      </form>
    </div>
    </Protegido>
  );
}
