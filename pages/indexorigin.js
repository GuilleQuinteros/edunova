import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [anio, setAnio] = useState('');
  const [dni, setDni] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Todos los años restaurados
  const anios = [
    'primer-anio',
    'segundo-anio',
    'tercer-anio',
    'cuarto-anio',
    'quinto-anio',
    'sexto-anio',
    'septimo-anio'
  ];

  const handleBuscar = async (e) => {
    e.preventDefault();

    if (!anio || !dni) {
      alert('Por favor, completá todos los campos.');
      return;
    }

    setMensaje('Buscando...');

    try {
      const res = await fetch('/api/buscar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anio, dni }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || 'No se pudo realizar la búsqueda.');
        return;
      }

      setMensaje('');
      window.open(data.url, '_blank');
    } catch (err) {
      console.error(err);
      setMensaje('Ocurrió un error al buscar el boletín.');
    }
  };

  return (
    <>
      <Head>
        <title>Consulta de Boletines</title>
      </Head>

      <div className="container mt-5" style={{ maxWidth: '500px' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <img src="/logo.png" alt="Logo" style={{ height: '200px' }} />
        </div>

        <h1 className="mb-4 text-center">Buscar Boletín de Calificaciones</h1>

        <form onSubmit={handleBuscar}>
          <div className="mb-3">
            <label htmlFor="anio" className="form-label">Año</label>
            <select
              id="anio"
              className="form-select"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              required
            >
              <option value="">Seleccione un año</option>
              {anios.map((a) => (
                <option key={a} value={a}>
                  {a.replace('-', ' ').replace('anio', 'Año').replace(/^\w/, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="dni" className="form-label">DNI del estudiante</label>
            <input
              type="text"
              id="dni"
              className="form-control"
              placeholder="Ej: 12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
              maxLength={8}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Buscar</button>
        </form>

        {mensaje && <div className="alert alert-info mt-3 text-center">{mensaje}</div>}
      </div>
    </>
  );
}
