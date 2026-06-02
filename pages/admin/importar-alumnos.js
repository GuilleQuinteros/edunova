import { useEffect, useState } from 'react';
import { leerExcel } from '@/lib/excel';
import Protegido from '@/components/Protegido';

export default function ImportarAlumnos() {
  const [cursos, setCursos] = useState([]);
  const [divisiones, setDivisiones] = useState([]);
  const [cursoId, setCursoId] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState([]);
  const [errores, setErrores] = useState([]);
  

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    const res = await fetch('/api/cursos');
    const data = await res.json();
    setCursos(data);
  };

  const cargarDivisiones = async (id) => {
    const res = await fetch(`/api/divisiones?curso_id=${id}`);
    const data = await res.json();
    setDivisiones(data);
  };

  const handleCursoChange = async (e) => {
    const id = e.target.value;

    setCursoId(id);
    setDivisionId('');
    setDivisiones([]);

    if (id) {
      await cargarDivisiones(id);
    }
  };

  const handleImportar = async () => {
  if (!archivo) {
    alert('Seleccione un archivo');
    return;
  }

  try {
    const filas = await leerExcel(archivo);

    setPreview(filas);

    console.log('Vista previa:', filas);

  } catch (error) {
    console.error(error);
    alert('Error leyendo archivo');
  }
};

const confirmarImportacion = async () => {

    if (!cursoId || !divisionId) {
      alert('Seleccione curso y división');
      return;
    }

    const ok = confirm(
      `Se importarán ${preview.length} alumnos`
    );

    if (!ok) return;

    try {

      const res = await fetch(
        '/api/alumnos/importar',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            alumnos: preview,
            curso_id: Number(cursoId),
            division_id: Number(divisionId)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert(`
  Importación finalizada

  Total: ${data.total}
  Importados: ${data.importados}
  Duplicados: ${data.duplicados}
      `);

      setPreview([]);

    } catch (error) {

      console.error(error);

      alert('Error al importar');

    }

  };

  return (
    <Protegido rolesPermitidos={['admin']}>
    <div className="container">

      <h2 className="mb-4">
        📥 Importación Masiva de Alumnos
      </h2>

      <div className="alert alert-warning">
        <strong>Importante:</strong>
        <br />
        Utilice esta opción únicamente para la carga inicial de alumnos.
        <br />
        Una vez cargados los alumnos, utilice las opciones:
        <ul className="mb-0 mt-2">
          <li>Cargar Alumno</li>
          <li>Ver Alumnos</li>
          <li>Editar Alumno</li>
        </ul>
      </div>

      <div className="card p-4">

        <div className="mb-3">
          <label className="form-label">
            Curso
          </label>

          <select
            className="form-select"
            value={cursoId}
            onChange={handleCursoChange}
          >
            <option value="">
              Seleccione...
            </option>

            {cursos.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">
            División
          </label>

          <select
            className="form-select"
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
          >
            <option value="">
              Seleccione...
            </option>

            {divisiones.map(d => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">
            Archivo Excel o CSV
          </label>

          <input
            type="file"
            className="form-control"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => setArchivo(e.target.files[0])}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleImportar}
        >
          Importar
        </button>

            {preview.length > 0 && (
            <div className="mt-4">

                <h4>
                Vista previa ({preview.length} alumnos)
                </h4>

                <div className="table-responsive">
                <table className="table table-bordered table-sm">

                    <thead>
                    <tr>
                        <th>Apellido</th>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Tutor</th>
                    </tr>
                    </thead>

                    <tbody>
                    {preview.map((a, index) => (
                        <tr key={index}>
                        <td>{a.apellido}</td>
                        <td>{a.nombre}</td>
                        <td>{a.dni}</td>
                        <td>{a.tutor}</td>
                        </tr>
                    ))}
                    </tbody>

                </table>
                {preview.length > 0 && (
                  <button
                    className="btn btn-success mt-3"
                    onClick={confirmarImportacion}
                  >
                    Confirmar Importación
                  </button>
)}
                </div>

            </div>
            )}

      </div>
    </div>
    </Protegido>
  );
}