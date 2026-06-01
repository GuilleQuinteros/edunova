import Protegido from '@/components/Protegido';
import { useEffect, useState } from 'react';

export default function CargarAlumno() {
  const [cursos, setCursos] = useState([]);
  const [divisiones, setDivisiones] = useState([]);
  const [cursoId, setCursoId] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [anioIngreso, setAnioIngreso] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [fechaNac, setFechaNac] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [tutor, setTutor] = useState('');
  const [localidad, setLocalidad] = useState('');

  // Cargar cursos al iniciar
  useEffect(() => {
    fetch('/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error(err));
  }, []);

  // Cargar divisiones cuando cambia el curso
  useEffect(() => {
    if (cursoId) {
      fetch(`/api/divisiones?curso_id=${cursoId}`)
        .then(res => res.json())
        .then(data => setDivisiones(data))
        .catch(err => console.error(err));
    } else {
      setDivisiones([]);
      setDivisionId('');
    }
  }, [cursoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dni || !apellido || !nombre || !divisionId || !anioIngreso) {
      alert('Por favor completá todos los campos.');
      return;
    }

    const res = await fetch('/api/alumnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      dni,
      apellido,
      nombre,
      curso_id: cursoId,
      division_id: divisionId,
      anio_ingreso: parseInt(anioIngreso),
      fecha_nac: fechaNac || null,
      telefono: telefono || null,
      domicilio: domicilio || null,
      tutor: tutor || null,
      localidad: localidad || null,
      credentials: 'include',
    }),

    });

    const data = await res.json();

    if (res.ok) {
      setMensaje('Alumno cargado correctamente.');
      setNombre('');
      setApellido('');
      setDni('');
      setAnioIngreso('');
      setCursoId('');
      setDivisionId('');
    } else {
      setMensaje(data.error || 'Error al cargar el alumno.');
    }
  };

  return (
    <Protegido>
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="text-center mb-4">Cargar Nuevo Alumno</h3>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        {/* Curso */}
        <div className="mb-3">
          <label className="form-label">Curso</label>
          <select className="form-select" value={cursoId} onChange={(e) => setCursoId(e.target.value)} required>
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>{curso.nombre}</option>
            ))}
          </select>
        </div>

        {/* División */}
        <div className="mb-3">
          <label className="form-label">División</label>
          <select className="form-select" value={divisionId} onChange={(e) => setDivisionId(e.target.value)} required>
            <option value="">Seleccionar división</option>
            {divisiones.map((div) => (
              <option key={div.id} value={div.id}>{div.nombre}</option>
            ))}
          </select>
        </div>

        {/* Datos del alumno */}
      <div className="mb-3">
        <label className="form-label">Apellido</label>
        <input type="text" className="form-control" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label className="form-label">DNI</label>
        <input type="text" className="form-control" value={dni} onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))} maxLength={8} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Año de Ingreso</label>
        <input type="number" className="form-control" value={anioIngreso} onChange={(e) => setAnioIngreso(e.target.value)} required />
      </div>

  {/* 🔹 Nuevos campos */}
      <div className="mb-3">
        <label className="form-label">Fecha de Nacimiento</label>
        <input type="date" className="form-control" onChange={(e) => setFechaNac(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Teléfono</label>
        <input type="text" className="form-control" onChange={(e) => setTelefono(e.target.value)} />
      </div>

  <div className="mb-3">
    <label className="form-label">Domicilio</label>
    <input type="text" className="form-control" onChange={(e) => setDomicilio(e.target.value)} />
  </div>

  <div className="mb-3">
    <label className="form-label">Tutor</label>
    <input type="text" className="form-control" onChange={(e) => setTutor(e.target.value)} />
  </div>

  <div className="mb-3">
    <label className="form-label">Localidad</label>
    <input type="text" className="form-control" onChange={(e) => setLocalidad(e.target.value)} />
  </div>

  <button type="submit" className="btn btn-success w-100">Guardar Alumno</button>
</form>
    </div>
    </Protegido>
  );
}
