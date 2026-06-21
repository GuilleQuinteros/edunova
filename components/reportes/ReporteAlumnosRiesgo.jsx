import { useEffect, useState } from 'react';

export default function ReporteAlumnosRiesgo() {

  const [minimo, setMinimo] = useState(4);
  const [datos, setDatos] = useState([]);
  const [cursoFiltro, setCursoFiltro] = useState('');
  const [divisionFiltro, setDivisionFiltro] = useState('');
  const [periodo, setPeriodo] = useState('1T');

  useEffect(() => {
  cargarDatos();
}, [minimo, periodo]);

  const cargarDatos = async () => {

    const res = await fetch(
  `/api/reportes/alumnos-riesgo?minimo=${minimo}&periodo=${periodo}`
);

    const data = await res.json();

    setDatos(data);
  };

  const datosFiltrados = datos.filter((a) => {

  const coincideCurso =
    cursoFiltro === '' ||
    String(a.curso_id) === cursoFiltro;

  const coincideDivision =
    divisionFiltro === '' ||
    a.division_nombre === divisionFiltro;

  return coincideCurso && coincideDivision;
});

const divisionesDisponibles = [
  ...new Set(
    datos
      .filter(a =>
        cursoFiltro === '' ||
        String(a.curso_id) === cursoFiltro
      )
      .map(a => a.division_nombre)
  )
].sort();

  return (

    <div>

      <h4 className="mb-3">
        Alumnos en Riesgo Académico
      </h4>

      <div className="mb-3">

          <label className="form-label">
            Período
          </label>

          <select
            className="form-select"
            value={periodo}
            onChange={(e) =>
              setPeriodo(e.target.value)
            }
          >

            <option value="1T">
              1° Trimestre
            </option>

            <option value="2T">
              2° Trimestre
            </option>

            <option value="3T">
              3° Trimestre
            </option>

            <option value="1C">
              1° Cuatrimestre
            </option>

            <option value="2C">
              2° Cuatrimestre
            </option>

            <option value="DIC">
              Diciembre
            </option>

            <option value="FEB">
              Febrero
            </option>

            <option value="MAR">
              Marzo
            </option>

            <option value="FINAL">
              Nota Final
            </option>

          </select>

        </div>

      <div className="mb-3">

        <select
          className="form-select"
          value={minimo}
          onChange={(e) =>
            setMinimo(e.target.value)
          }
        >

          <option value="4">
            4 o más desaprobadas
          </option>

          <option value="8">
            8 o más desaprobadas
          </option>

          <option value="12">
            12 o más desaprobadas
          </option>

        </select>

        <div className="row mb-3">

  <div className="col-md-3">

    <label>Curso</label>

    <select
      className="form-select"
      value={cursoFiltro}
      onChange={(e) => setCursoFiltro(e.target.value)}
    >
      <option value="">Todos</option>
      <option value="1">1° Año</option>
      <option value="2">2° Año</option>
      <option value="3">3° Año</option>
      <option value="4">4° Año</option>
      <option value="5">5° Año</option>
      <option value="6">6° Año</option>
      <option value="7">7° Año</option>
    </select>

        </div>

        <div className="col-md-3">

          <label>División</label>

          <select
            className="form-select"
            value={divisionFiltro}
            onChange={(e) => setDivisionFiltro(e.target.value)}
          >
            <option value="">
                    Todas
                  </option>

                  {divisionesDisponibles.map((division) => (

                    <option
                      key={division}
                      value={division}
                    >
                      {division}
                    </option>

                  ))}
          </select>

        </div>

      </div>  

      </div>

      <table className="table table-bordered">

        <thead>

          <tr>

            <th>Alumno</th>
            <th>Curso</th>
            <th>División</th>
            <th>Desaprobadas</th>

          </tr>

        </thead>

        <tbody>

          {datosFiltrados.map((a) => (
                
            <tr key={a.alumno_id}>

              <td>
                {a.apellido}, {a.nombre}
              </td>

              <td>
                {a.curso_id}
              </td>

              <td>
                {a.division_nombre || 'Sin división'}
              </td>
          
              <td>
                {a.desaprobadas}
              </td>

            </tr>
            
          ))}

        </tbody>

      </table>

    </div>

  );
}