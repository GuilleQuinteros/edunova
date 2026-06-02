// pages/admin/cargar-division.js
import Protegido from '@/components/Protegido';
import { useEffect, useState } from 'react';

export default function CargarDivision() {
  const [cursos, setCursos] = useState([]);
  const [cursoId, setCursoId] = useState('');
  const [nombreDivision, setNombreDivision] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [divisiones, setDivisiones] = useState([]);

  // Cargar cursos disponibles
  useEffect(() => {
    fetch('/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data));
  }, []);

  // Cargar divisiones ya existentes
  useEffect(() => {
    fetch('/api/divisiones')
      .then(res => res.json())
      .then(data => setDivisiones(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/divisiones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreDivision, curso_id: cursoId }),
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje('División guardada correctamente.');
      setNombreDivision('');
      // Refrescar divisiones
      const divs = await fetch('/api/divisiones').then(res => res.json());
      setDivisiones(divs);
    } else {
      setMensaje(data.error || 'Error al guardar división.');
    }
  };

  return (
    <Protegido rolesPermitidos={['admin']}>
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4 text-center">Cargar Nueva División</h3>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        {/* Selección de curso */}
        <div className="mb-3">
          <label className="form-label">Curso</label>
          <select
            className="form-select"
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            required
          >
            <option value="">Seleccionar curso</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {/* Nombre de división */}
        <div className="mb-3">
          <label className="form-label">Nombre de la División</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: I, TA, MMO"
            value={nombreDivision}
            onChange={(e) => setNombreDivision(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">Guardar División</button>
      </form>

      {/* Lista de divisiones existentes */}
      {divisiones.length > 0 && (
        <div className="mt-5">
          <h5 className="text-center mb-3">Divisiones Cargadas</h5>
          <ul className="list-group">
            {divisiones.map((d) => (
              <li key={d.id} className="list-group-item">
                {d.nombre} (Curso ID: {d.curso_id})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </Protegido>
  );
}
