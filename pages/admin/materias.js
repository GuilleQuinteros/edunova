// pages/admin/materias.js
import Protegido from '@/components/Protegido';
import { useEffect, useState } from 'react';

export default function MateriasAdmin() {
  const [materias, setMaterias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [nombreMateria, setNombreMateria] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  const obtenerMaterias = async () => {
    const res = await fetch('/api/materias');
    const data = await res.json();
    setMaterias(data);
  };

  const obtenerCursos = async () => {
    const res = await fetch('/api/cursos');
    const data = await res.json();
    setCursos(data);
  };

  const cargarDatos = async () => {
    setCargando(true);
    await Promise.all([obtenerMaterias(), obtenerCursos()]);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardarMateria = async (e) => {
    e.preventDefault();
    if (!nombreMateria || !cursoId) {
      alert('Debes completar todos los campos.');
      return;
    }

    const res = await fetch('/api/materias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreMateria, curso_id: parseInt(cursoId) }),
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje('Materia guardada correctamente');
      setNombreMateria('');
      setCursoId('');
      obtenerMaterias();
    } else {
      setMensaje(data.error || 'Error al guardar');
    }
  };

  const eliminarMateria = async (id) => {
    if (!confirm('¿Seguro que querés eliminar esta materia?')) return;

    const res = await fetch('/api/materias', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje('Materia eliminada correctamente');
      obtenerMaterias();
    } else {
      setMensaje(data.error || 'Error al eliminar');
    }
  };

  return (
    <Protegido>
    <div className="container mt-4">
      <h2 className="mb-4">Materias registradas</h2>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {/* Formulario de carga */}
      <form onSubmit={handleGuardarMateria} className="mb-4">
        <div className="row">
          <div className="col-md-6 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre de la materia"
              value={nombreMateria}
              onChange={(e) => setNombreMateria(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-2">
            <select
              className="form-select"
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              required
            >
              <option value="">Seleccionar curso</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 mb-2">
            <button type="submit" className="btn btn-success w-100">Guardar</button>
          </div>
        </div>
      </form>

      {/* Tabla de materias */}
      {cargando ? (
        <p>Cargando...</p>
      ) : materias.length === 0 ? (
        <p>No hay materias registradas.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Materia</th>
              <th>Curso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materias.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nombre}</td>
                <td>{m.cursos?.nombre || '-'}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarMateria(m.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </Protegido>
  );
}
