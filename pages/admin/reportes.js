import { useState } from 'react';

import ReporteMaterias from '../../components/reportes/ReporteMaterias';
import ReporteAlumnosRiesgo from '../../components/reportes/ReporteAlumnosRiesgo';
import ReporteRiesgoCurso from '@/components/reportes/ReporteRiesgoCurso';

export default function Reportes() {

  const [tipoReporte, setTipoReporte] =
    useState('materias');

  return (

    <div className="container mt-4">

      <h2 className="mb-4">
        Centro de Reportes
      </h2>

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <label className="form-label">
            Tipo de Reporte
          </label>

          <select
            className="form-select"
            value={tipoReporte}
            onChange={(e) =>
              setTipoReporte(e.target.value)
            }
          >

            <option value="materias">
                Materias con más desaprobados
              </option>

              <option value="riesgo">
                Alumnos en Riesgo Académico
              </option>

              <option value="riesgoCurso">
                Riesgo Académico por Curso
              </option>

          </select>

        </div>

      </div>

      {tipoReporte === 'materias' && (
        <ReporteMaterias />
      )}

      {tipoReporte === 'riesgo' && (
        <ReporteAlumnosRiesgo />
      )}
      {tipoReporte === 'riesgoCurso' && (
        <ReporteRiesgoCurso />
      )}

    </div>

  );
}