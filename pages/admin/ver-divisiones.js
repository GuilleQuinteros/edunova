import Protegido from '@/components/Protegido';
import { useEffect, useState } from 'react';

export default function VerDivisiones() {
  const [divisiones, setDivisiones] = useState([]);
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    cargarCursos();
    cargarDivisiones();
  }, []);

  const cargarCursos = async () => {
    const res = await fetch('/api/cursos');
    const data = await res.json();
    setCursos(data);
  };

  const cargarDivisiones = async () => {
    const res = await fetch('/api/divisiones');
    const data = await res.json();
    setDivisiones(data);
  };

  const eliminarDivision = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta división?')) return;

    const res = await fetch(`/api/divisiones/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      cargarDivisiones(); // recargar lista
    } else {
      alert(data.error || 'Error al eliminar');
    }
  };

  const obtenerNombreCurso = (id) => {
    const curso = cursos.find(c => c.id === id);
    return curso ? curso.nombre : '-';
  };

  return (
    <Protegido rolesPermitidos={['admin']}>
    <div className="container mt-5">
      <h3 className="mb-4">Divisiones</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>División</th>
            <th>Curso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {divisiones.map(div => (
            <tr key={div.id}>
              <td>{div.nombre}</td>
              <td>{obtenerNombreCurso(div.curso_id)}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarDivision(div.id)}>
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
