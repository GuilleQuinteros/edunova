import { useEffect, useState } from 'react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function ReporteRiesgoCurso() {

  const [periodo, setPeriodo] = useState('1t');
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const cargarDatos = async () => {

    const res = await fetch(
      `/api/reportes/riesgo-por-curso?periodo=${periodo}`
    );

    const data = await res.json();

    setDatos(data);
  };

  return (

    <div>

      <h4 className="mb-3">
        Riesgo Académico por Curso
      </h4>

      <div className="mb-3">

        <select
          className="form-select"
          value={periodo}
          onChange={(e) =>
            setPeriodo(e.target.value)
          }
        >

          <option value="1t">
            1° Trimestre
          </option>

          <option value="2t">
            2° Trimestre
          </option>

          <option value="3t">
            3° Trimestre
          </option>

          <option value="1c">
            1° Cuatrimestre
          </option>

          <option value="2c">
            2° Cuatrimestre
          </option>

          <option value="final">
            Nota Final
          </option>

        </select>

      </div>

      <div
        style={{
          width: '100%',
          height: 400
        }}
      >

        <ResponsiveContainer>

          <BarChart data={datos}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="curso" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="porcentaje"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      <table className="table table-bordered mt-4">

        <thead>

          <tr>

            <th>Curso</th>
            <th>Total alumnos</th>
            <th>Alumnos riesgo</th>
            <th>% Riesgo</th>

          </tr>

        </thead>

        <tbody>

          {datos.map((item) => (

            <tr key={item.curso_id}>

              <td>{item.curso}</td>

              <td>{item.total_alumnos}</td>

              <td>{item.alumnos_riesgo}</td>

              <td>{item.porcentaje}%</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}