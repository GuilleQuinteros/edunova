// pages/admin/cargar-materia.js
import Protegido from '@/components/Protegido';
import { useEffect, useState } from 'react';

export default function CargarMateria() {
  const [cursos, setCursos] = useState([]);
  const [divisiones, setDivisiones] = useState([]);
  const [cursoId, setCursoId] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [nombreMateria, setNombreMateria] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [materias, setMaterias] = useState([]);

  // Obtener cursos al iniciar
  useEffect(() => {
    fetch('/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error(err));
  }, []);

  // Cuando cambia el curso, buscar divisiones asociadas
  useEffect(() => {
    if (cursoId) {
      fetch(`/api/divisiones?curso_id=${cursoId}`)
        .then(res => res.json())
        .then(data => setDivisiones(data))
        .catch(err => console.error(err));
    } else {
      setDivisiones([]);
      setDivisionId('');
    }
  }, [cursoId]);

  // Cuando cambia la división, buscar materias asociadas
  useEffect(() => {
    if (divisionId) {
      fetch(`/api/materias-por-division?division_id=${divisionId}`)
        .then(res => res.json())
        .then(data => setMaterias(data))
        .catch(err => console.error(err));
    } else {
      setMaterias([]);
    }
  }, [divisionId]);

  // Enviar nueva materia al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cursoId || !divisionId || !nombreMateria) {
      alert('Completa todos los campos.');
      return;
    }

    const res = await fetch('/api/materias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreMateria, division_id: divisionId }),
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje('Materia cargada correctamente.');
      setNombreMateria('');
      // Actualizar lista
      fetch(`/api/materias-por-division?division_id=${divisionId}`)
        .then(res => res.json())
        .then(data => setMaterias(data));
    } else {
      setMensaje(data.error || 'Error al cargar materia.');
    }
  };

  // Función para eliminar una materia
  const handleEliminarMateria = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta materia?')) return;

    const res = await fetch(`/api/materias/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      setMaterias(materias.filter(mat => mat.id !== id));
    } else {
      alert('Error al eliminar la materia');
    }
  };

  return (
    <Protegido>
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="text-center mb-4">Cargar Nueva Materia</h3>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        {/* Curso */}
        <div className="mb-3">
          <label className="form-label">Curso</label>
          <select className="form-select" value={cursoId} onChange={(e) => setCursoId(e.target.value)} required>
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>{curso.nombre}</option>
            ))}
          </select>
        </div>

        {/* División */}
        <div className="mb-3">
          <label className="form-label">División</label>
          <select className="form-select" value={divisionId} onChange={(e) => setDivisionId(e.target.value)} required>
            <option value="">Seleccionar división</option>
            {divisiones.map((div) => (
              <option key={div.id} value={div.id}>{div.nombre}</option>
            ))}
          </select>
        </div>

        {/* Nombre Materia */}
        <div className="mb-3">
          <label className="form-label">Nombre de la Materia</label>
          <input
            type="text"
            className="form-control"
            value={nombreMateria}
            onChange={(e) => setNombreMateria(e.target.value)}
            placeholder="Ej: Matemática"
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">Guardar Materia</button>
      </form>

      {/* Lista de materias ya cargadas para la división */}
      {materias.length > 0 && (
        <div className="mt-5">
          <h5 className="text-center mb-3">Materias Cargadas</h5>
          <ul className="list-group">
            {materias.map((mat) => (
              <li key={mat.id} className="list-group-item d-flex justify-content-between align-items-center">
                {mat.nombre}
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminarMateria(mat.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </Protegido>
  );
}
