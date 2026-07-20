import { useState } from 'react';

import ListaAlumnos from './ListaAlumnos';

export default function CentroImprimibles() {

  const [tipoDocumento, setTipoDocumento] =
    useState('lista');

  return (

    <div className="container mt-4">

      <h2 className="mb-4">

        Centro de Imprimibles

      </h2>

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <label className="form-label">

            Documento

          </label>

          <select
            className="form-select"
            value={tipoDocumento}
            onChange={(e) =>
              setTipoDocumento(e.target.value)
            }
          >

            <option value="lista">

              Lista de alumnos

            </option>

          </select>

        </div>

      </div>

      {tipoDocumento === 'lista' && (
        <ListaAlumnos />
      )}

    </div>

  );

}