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

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReporteMaterias() {

  const [periodo, setPeriodo] = useState('1T');
  const [datos, setDatos] = useState([]);
  const [curso, setCurso] = useState('todos');

  useEffect(() => {
  cargarDatos();
}, [periodo, curso]);

  const cargarDatos = async () => {

    const res = await fetch(
  `/api/reportes/desaprobados-general?periodo=${periodo}&curso=${curso}`
  );

    const data = await res.json();

    setDatos(data);
  };

  const exportarPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(16);

  doc.text(
    'Reporte de Desaprobados',
    14,
    15
  );

  doc.setFontSize(11);

  doc.text(
    `Periodo: ${periodo}`,
    14,
    25
  );

  autoTable(doc, {

    startY: 35,

    head: [[
      'Materia',
      'Desaprobados'
    ]],

    body: datos.map(item => [
      item.materia,
      item.cantidad
    ])

  });

  doc.save(
    `desaprobados-${periodo}.pdf`
  );
};

  return (

    <div>

      <h4 className="mb-3">
        Materias con más desaprobados
      </h4>

      <select
        className="form-select mb-3"
        value={periodo}
        onChange={(e) => setPeriodo(e.target.value)}
      >

        <option value="1T">1° Trimestre</option>
        <option value="2T">2° Trimestre</option>
        <option value="3T">3° Trimestre</option>

        <option value="1C">1° Cuatrimestre</option>
        <option value="2C">2° Cuatrimestre</option>

        <option value="DIC">Diciembre</option>
        <option value="FEB">Febrero</option>
        <option value="MAR">Marzo</option>

        <option value="FINAL">Final</option>

      </select>

      <div className="mb-3">

        <label className="form-label">
          Curso
        </label>

        <select
          className="form-select"
          value={curso}
          onChange={(e) =>
            setCurso(e.target.value)
          }
        >

          <option value="todos">
            Todos los cursos
          </option>

          <option value="1">
            1° Año
          </option>

          <option value="2">
            2° Año
          </option>

          <option value="3">
            3° Año
          </option>

          <option value="4">
            4° Año
          </option>

          <option value="5">
            5° Año
          </option>

          <option value="6">
            6° Año
          </option>

          <option value="7">
            7° Año
          </option>

        </select>

      </div>

      <button
        className="btn btn-danger mb-3"
        onClick={exportarPDF}
      >
        Exportar PDF
      </button>

      <div
          style={{
            width: '100%',
            height: 500
                  }}
                  className="mb-4"
                >

                  <ResponsiveContainer>

                    <BarChart
                      data={datos.slice(0, 15)}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 80,
                        bottom: 20
                      }}
                    >

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        type="number"
                      />

                      <YAxis
                        type="category"
                        dataKey="materia"
                        width={180}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="cantidad"
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              <table className="table table-bordered">

                <thead>

                  <tr>
                    <th>Materia</th>
                    <th>Desaprobados</th>
                  </tr>

                </thead>

                <tbody>

                  {datos.map((item, index) => (

                    <tr key={index}>

                      <td>{item.materia}</td>

                      <td>{item.cantidad}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          );
        }