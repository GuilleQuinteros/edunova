// components/BoletinCuatrimestral.js
import React from 'react';
import EncabezadoInstitucion from './EncabezadoInstitucion';

const BoletinCuatrimestral = ({ alumno, materiasNotas }) => {
  const materiasTaller = materiasNotas.filter(m => m.nombre?.toLowerCase().includes('taller'));
  const materiasOtras = materiasNotas.filter(m => !m.nombre?.toLowerCase().includes('taller'));

  const obtenerDivisionCompleta = (division) => {
  const divisiones = {
    TA: 'Tecnología de los Alimentos',
    AYS: 'Ambiente y Salud',
    MMO: 'Maestro Mayor de Obras',
  };

  return divisiones[division] || division;
};

  return (
    <div className="boletin-container">
      <EncabezadoInstitucion />
      <h3 className="titulo-boletin">
        BOLETÍN ESCOLAR - {alumno?.curso_id} "{obtenerDivisionCompleta(alumno?.division?.nombre)}" -
        {(alumno?.apellido || ' ').toUpperCase()} {(alumno?.nombre || ' ').toUpperCase()}
      </h3>

      <div className="datos-alumno">
        <div><strong>Fecha de Nacimiento:</strong> {alumno.fecha_nac || 'no informado'}</div>
        <div><strong>DNI:</strong> {alumno.dni}</div>
        <div><strong>Teléfono:</strong> {alumno.telefono || 'no informado'}</div>
        <div><strong>Domicilio:</strong> {alumno.domicilio || 'no informado'}</div>
        <div><strong>Tutor:</strong> {alumno.tutor || 'no informado'}</div>
        <div><strong>Localidad:</strong> {alumno.localidad || 'no informado'}</div>
      </div>
      <button
          className="btn btn-outline-primary mb-3"
          onClick={() => window.print()}>
          📄 Descargar Boletín (PDF)
      </button>

      <table className="tabla-boletin">
        <thead>
          <tr>
            <th rowSpan="2">Materias</th>
            <th colSpan="2">1º Cuatrimestre</th>
            <th colSpan="2">2º Cuatrimestre</th>
            <th colSpan="2">Períodos de Recuperación</th>
            <th colSpan="2">Nota Final</th>
          </tr>
          <tr>
            <th>Con</th><th>Nro</th>
            <th>Con</th><th>Nro</th>
            <th>Dic</th><th>Feb/Mar</th>
            <th>Con</th><th>Nro</th>
          </tr>
        </thead>
        <tbody>
          {materiasOtras.map(m => (
            <tr key={m.id}>
              <td>{m.nombre}</td>
              <td></td><td>{m.nota_1c || ''}</td>
              <td></td><td>{m.nota_2c || ''}</td>
              <td>{m.nota_diciembre || ''}</td>
              <td>{m.nota_febrero || m.nota_marzo || ''}</td>
              <td></td><td>{m.nota_final || ''}</td>
            </tr>
          ))}
          {materiasTaller.length > 0 && (
            <>
              <tr className="fila-taller-header">
                <td colSpan="9"><strong>TALLER</strong></td>
              </tr>
              {materiasTaller.map(m => (
                <tr key={m.id}>
                  <td className="ps-3">{m.nombre}</td>
                  <td></td><td>{m.nota_1c || ''}</td>
                  <td></td><td>{m.nota_2c || ''}</td>
                  <td>{m.nota_diciembre || ''}</td>
                  <td>{m.nota_febrero || m.nota_marzo || ''}</td>
                  <td></td><td>{m.nota_final || ''}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BoletinCuatrimestral;
