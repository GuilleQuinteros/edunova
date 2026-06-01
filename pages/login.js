import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const usuarioStr = localStorage.getItem('usuario');

    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);

      if (
        usuario.expiracion &&
        usuario.expiracion > Date.now()
      ) {
        router.push('/admin/dashboard');
      } else {
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setCargando(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          contrasena
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          'usuario',
          JSON.stringify(data.usuario)
        );

        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: '#f8f9fa'
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: '100%',
          maxWidth: '450px'
        }}
      >
        <div className="card-body p-4">

          <div className="text-center mb-4">

            <img
              src="/images/edunova-logo.png"
              alt="EduNova"
              style={{
                maxWidth: '100px'
              }}
            />

            <h2 className="fw-bold mt-3 mb-1">
              EduNova
            </h2>

            <p className="text-muted">
              Panel Administrativo
            </p>

          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="mb-3">
              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Contraseña
              </label>

              <input
                type="password"
                className="form-control"
                value={contrasena}
                onChange={(e) =>
                  setContrasena(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={cargando}
            >
              {
                cargando
                  ? 'Ingresando...'
                  : 'Ingresar'
              }
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}