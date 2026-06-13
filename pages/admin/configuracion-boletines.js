import { useEffect, useState } from 'react';
import Protegido from '@/components/Protegido';

export default function ConfiguracionBoletines() {

  const [habilitado, setHabilitado] = useState(false);

  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = async () => {
    const res = await fetch('/api/configuracion');
    const data = await res.json();

    setHabilitado(
      data.consulta_boletines_habilitada
    );
  };

  const guardar = async () => {

    const res = await fetch(
      '/api/configuracion/toggle-boletines',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          habilitado
        })
      }
    );

    if (res.ok) {
      alert('Configuración guardada');
    }
  };

  return (
    <Protegido rolesPermitidos={['admin']}>

      <div className="container mt-5">

        <h3>
          Consulta de Boletines
        </h3>

        <div className="form-check form-switch mt-4">

          <input
            className="form-check-input"
            type="checkbox"
            checked={habilitado}
            onChange={(e) =>
              setHabilitado(e.target.checked)
            }
          />

          <label className="form-check-label">

            Permitir a los padres consultar
            calificaciones

          </label>

        </div>

        <button
          className="btn btn-primary mt-3"
          onClick={guardar}
        >
          Guardar
        </button>

      </div>

    </Protegido>
  );
}