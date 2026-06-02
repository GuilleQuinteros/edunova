// pages/admin/cargar-curso.js
import Protegido from '@/components/Protegido';
import { useState } from 'react';

export default function CargarCurso() {
  const [nombre, setNombre] = useState('');
  const [esTrimestral, setEsTrimestral] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, es_trimestral: esTrimestral }),
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje('Curso creado correctamente');
      setNombre('');
      setEsTrimestral(true);
    } else {
      setMensaje(data.error || 'Error al crear curso');
    }
  };

  return (
    <Protegido rolesPermitidos={['admin']}>
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="text-center mb-4">Cargar Curso</h3>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del curso</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={esTrimestral}
            onChange={(e) => setEsTrimestral(e.target.checked)}
            id="trimestralCheck"
          />
          <label className="form-check-label" htmlFor="trimestralCheck">
            ¿Curso con sistema trimestral?
          </label>
        </div>

        <button type="submit" className="btn btn-success w-100">Guardar</button>
      </form>
    </div>
    </Protegido>
  );
}
