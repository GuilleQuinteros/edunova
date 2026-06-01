// components/VerMateriasPorDivision.js
import { useEffect, useState } from 'react';

export default function VerMateriasPorDivision() {
  const [divisiones, setDivisiones] = useState([]);
  const [divisionSeleccionada, setDivisionSeleccionada] = useState('');
  const [materias, setMaterias] = useState([]);

  // Cargar divisiones desde Supabase
  useEffect(() => {
    const cargarDivisiones = async () => {
      const res = await fetch('/api/divisiones');
      const data = await res.json();
      setDivisiones(data);
    };
    cargarDivisiones();
  }, []);

  // Cuando seleccionan una división, buscar sus materias
  useEffect(() => {
    const buscarMaterias = async () => {
      if (!divisionSeleccionada) return;

      const res = await fetch(`/api/materias-por-division?division_id=${divisionSeleccionada}`);
      const data = await res.json();
      setMaterias(data);
    };
    buscarMaterias();
  }, [divisionSeleccionada]);

  return (
    <div className="mt-5">
      <h4>Ver materias por división</h4>
      <div className="mb-3">
        <label className="form-label">División</label>
        <select
          className="form-select"
          value={divisionSeleccionada}
          onChange={(e) => setDivisionSeleccionada(e.target.value)}
        >
          <option value="">Seleccionar división</option>
          {divisiones.map((div) => (
            <option key={div.id} value={div.id}>
              {div.nombre}
            </option>
          ))}
        </select>
      </div>

      {materias.length > 0 && (
        <div className="mt-4">
          <h5>Materias cargadas:</h5>
          <ul className="list-group">
            {materias.map((m) => (
              <li key={m.id} className="list-group-item">
                {m.nombre}
              </li>
            ))}
          </ul>
        </div>
      )}

      {divisionSeleccionada && materias.length === 0 && (
        <div className="alert alert-warning mt-3">No hay materias registradas para esta división.</div>
      )}
    </div>
  );
}
