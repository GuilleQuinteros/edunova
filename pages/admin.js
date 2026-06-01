import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
  const router = useRouter();
  const [logueado, setLogueado] = useState(false);
  const [anio, setAnio] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [progreso, setProgreso] = useState(0);
  const [mensaje, setMensaje] = useState('');

  // Revisar sesión al cargar la página
  useEffect(() => {
    const flag = localStorage.getItem('logueado');
    if (flag !== 'true') {
      router.push('/login');
    } else {
      setLogueado(true);
    }
  }, [router]);

  // Maneja selección de archivos
  const handleFileChange = (e) => {
    setArchivos(e.target.files);
  };

  // Maneja submit para subir archivos
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!anio) {
      alert('Seleccione un año');
      return;
    }
    if (archivos.length === 0) {
      alert('Seleccione al menos un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('anio', anio);
    for (let i = 0; i < archivos.length; i++) {
      formData.append('archivos', archivos[i]);
    }

    try {
      setProgreso(0);
      setMensaje('');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer admin-token',
        },
        body: formData,
      });
      

      if (res.ok) {
        setMensaje('Archivos subidos correctamente');
        setArchivos([]);
        setProgreso(100);
      } else {
        const error = await res.text();
        setMensaje('Error al subir archivos: ' + error);
      }
    } catch (error) {
      setMensaje('Error en la conexión: ' + error.message);
    }
  };

  // Cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('logueado');
    router.push('/login');
  };

  if (!logueado) return null;

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Boletines</a>
          <button className="btn btn-danger" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </nav>

      <h3 className="text-center mb-4">Subir Boletines</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="anio" className="form-label">Seleccione Año</label>
          <select
            id="anio"
            className="form-select"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            required
          >
            <option value="">-- Seleccione año --</option>
            <option value="primer-anio">Primer Año</option>
            <option value="segundo-anio">Segundo Año</option>
            <option value="tercer-anio">Tercer Año</option>
            <option value="cuarto-anio">Cuarto Año</option>
            <option value="quinto-anio">Quinto Año</option>
            <option value="sexto-anio">Sexto Año</option>
            <option value="septimo-anio">Séptimo Año</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="archivos" className="form-label">Seleccionar archivos PDF</label>
          <input
            type="file"
            id="archivos"
            className="form-control"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Subir Archivos</button>

        {progreso > 0 && progreso < 100 && (
          <div className="progress mt-3">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progreso}%` }}
              aria-valuenow={progreso}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        )}

        {mensaje && <div className="mt-3 text-center">{mensaje}</div>}
      </form>
    </div>
  );
}
