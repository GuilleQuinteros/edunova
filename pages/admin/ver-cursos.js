import Protegido from '@/components/Protegido';
import { useEffect, useState } from 'react';

export default function VerCursos() {
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    const res = await fetch('/api/cursos');
    const data = await res.json();
    setCursos(data);
  };

  const eliminarCurso = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;

    const res = await fetch(`/api/cursos/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      fetchCursos(); // recargar lista
    } else {
      alert(data.error || 'Error al eliminar');
    }
  };

  return (
    <Protegido>
    <div className="container mt-5">
      <h3 className="mb-4">Cursos</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Trimestral</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.id}>
              <td>{curso.nombre}</td>
              <td>{curso.es_trimestral ? 'Sí' : 'No'}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarCurso(curso.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </Protegido>
  );
}
