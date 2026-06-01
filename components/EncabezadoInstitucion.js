import { useEffect, useState } from 'react';

export default function EncabezadoInstitucion() {
  const [institucion, setInstitucion] = useState(null);

  useEffect(() => {
    fetch('/api/institucion')
      .then(r => r.json())
      .then(setInstitucion);
  }, []);

  if (!institucion) return null;

  return (
  <div className="encabezado-institucion mb-4">
  <div className="row align-items-center">

    <div className="col-md-2 text-center">
      <img
        src="/images/logo-escuela.png"
        alt="Logo"
        style={{
          maxWidth: '100px',
          height: 'auto'
        }}
      />
    </div>

    <div className="col-md-10">

      <h2 className="mb-1">
        {institucion.nombre}
      </h2>

      <h5 className="text-muted mb-3">
        Plataforma Académica EduNova
      </h5>

      <div className="row">

        <div className="col-md-6">
          <p className="mb-1">
            <strong>Dirección:</strong> {institucion.direccion}
          </p>

          <p className="mb-1">
            <strong>Teléfono:</strong> {institucion.telefono}
          </p>

          <p className="mb-1">
            <strong>Email:</strong> {institucion.email}
          </p>
        </div>

        <div className="col-md-6">
          <p className="mb-1">
            <strong>Ubicación:</strong> {institucion.ciudad}, {institucion.provincia}
          </p>

          <p className="mb-1">
            <strong>Ministerio:</strong> {institucion.ministerio}
          </p>
        </div>

      </div>

    </div>

  </div>

  <hr />
</div>
);
}