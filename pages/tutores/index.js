import { useState } from 'react';

export default function PortalTutor() {

  const [dni, setDni] = useState('');
  const [cargando, setCargando] = useState(false);

  const buscarBoletin = () => {

    if (!dni) {
      alert('Ingrese un DNI');
      return;
    }

    setCargando(true);

    window.location.href =
      `/tutores/boletin?dni=${dni}`;
  };

  return (
    <div className="container py-4">

      <div
        className="mx-auto"
        style={{ maxWidth: '500px' }}
      >

        <div className="text-center mb-4">

          <img
            src="/images/edunova-logo.png"
            alt="EduNova"
            style={{ maxWidth: '100px' }}
          />

          <h2 className="mt-3">
            Consultar Calificaciones
          </h2>

          <p className="text-muted">
            Ingrese el DNI del estudiante
          </p>

        </div>

        <div className="card shadow">

          <div className="card-body">

            <label>DNI</label>

            <input
              className="form-control mb-3"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />

            <button
              className="btn btn-primary w-100"
              onClick={buscarBoletin}
            >
              {
                cargando
                  ? 'Buscando...'
                  : 'Consultar Calificaciones'
              }
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}