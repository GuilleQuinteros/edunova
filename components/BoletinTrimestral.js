// components/BoletinTrimestral.js
import React from 'react';
import EncabezadoInstitucion from './EncabezadoInstitucion';


const BoletinTrimestral = ({ alumno, materiasNotas }) => {
  // Agrupar materias "Taller"
  const materiasTaller = materiasNotas.filter(
  m => m.nombre && m.nombre.toLowerCase().includes('taller')
);

const materiasOtras = materiasNotas.filter(
  m => !m.nombre || !m.nombre.toLowerCase().includes('taller')
);


  return (
    <div className="boletin-container">
      <EncabezadoInstitucion />
      <h3 className="titulo-boletin">
        BOLETÍN ESCOLAR - {alumno?.curso_id} "{alumno?.division?.nombre}" -
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
            <th colSpan="2">1º Trimestre</th>
            <th colSpan="2">2º Trimestre</th>
            <th colSpan="2">3º Trimestre</th>
            <th colSpan="2">Períodos de Recuperación</th>
            <th colSpan="2">Calif Definitiva</th>
          </tr>
          <tr>
            <th>Con</th><th>Nro</th>
            <th>Con</th><th>Nro</th>
            <th>Con</th><th>Nro</th>
            <th>Dic</th><th>Feb/Mar</th>
            <th>Con</th><th>Nro</th>
          </tr>
        </thead>
        <tbody>
          {/* Materias comunes */}
          {materiasOtras.map(m => (
            <tr key={m.id}>
              <td>{m.nombre}</td>
              <td></td><td>{m.nota_1t || ''}</td>
              <td></td><td>{m.nota_2t || ''}</td>
              <td></td><td>{m.nota_3t || ''}</td>
              <td>{m.nota_diciembre || ''}</td>
              <td>{m.nota_febrero || m.nota_marzo || ''}</td>
              <td></td><td>{m.nota_final || ''}</td>
            </tr>
          ))}

          {/* Bloque Taller */}
          {materiasTaller.length > 0 && (
            <>
              <tr className="fila-taller-header">
                <td colSpan="11" className="text-start"><strong>TALLER</strong></td>
              </tr>
              {materiasTaller.map(m => (
                <tr key={m.id}>
                  <td className="ps-3">{m.nombre}</td>
                  <td></td><td>{m.nota_1t || ''}</td>
                  <td></td><td>{m.nota_2t || ''}</td>
                  <td></td><td>{m.nota_3t || ''}</td>
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

export default BoletinTrimestral;
