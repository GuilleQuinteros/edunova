import Protegido from '@/components/Protegido';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function VerAlumnos() {
  const router = useRouter();

  const [cursos, setCursos] = useState([]);
  const [cursoId, setCursoId] = useState('');
  const [divisiones, setDivisiones] = useState([]);
  const [divisionId, setDivisionId] = useState('');
  const [alumnos, setAlumnos] = useState([]);

  const [alumnoActual, setAlumnoActual] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [showModalNotas, setShowModalNotas] = useState(false);
  const [materias, setMaterias] = useState([]);
  const [notas, setNotas] = useState({});
  const [esTrimestral, setEsTrimestral] = useState(true);
  const [showModalBoletin, setShowModalBoletin] = useState(false);
  const [notasBoletin, setNotasBoletin] = useState([]);

  // Cargar cursos al inicio
  useEffect(() => {
    fetch('/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(console.error);
  }, []);

  // Cuando cambia curso, cargar divisiones y decidir trimestral/cuatrimestral
  useEffect(() => {
    if (cursoId) {
      fetch(`/api/divisiones?curso_id=${cursoId}`)
        .then(res => res.json())
        .then(data => setDivisiones(data))
        .catch(console.error);

      const cursoElegido = cursos.find(c => c.id == cursoId);

      if (cursoElegido) {
        setEsTrimestral(cursoElegido.es_trimestral);
        console.log(cursoElegido);
      }
    } else {
      setDivisiones([]);
    }
  }, [cursoId, cursos]);
  
  // Función central para cargar alumnos de la división
  const cargarAlumnos = async () => {
    if (!divisionId) {
      setAlumnos([]);
      return;
    }
    try {
      const res = await fetch(`/api/alumnos/por-division?division_id=${divisionId}`);
      const data = await res.json();
      setAlumnos(data || []);
    } catch (err) {
      console.error('Error al cargar alumnos:', err);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, [divisionId]);

  // -------------------------
  // Abrir modal edición
  // -------------------------
  const handleAbrirModalEdicion = (alumno) => {
    setAlumnoActual(alumno);
    setMostrarModalEdicion(true);
  };

  // Guardar edición
  const handleGuardarEdicion = async () => {
    if (!alumnoActual || !alumnoActual.id) {
      alert('Datos de alumno inválidos');
      return;
    }

    try {
      const res = await fetch(`/api/alumnos/${alumnoActual.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dni: alumnoActual.dni,
          apellido: alumnoActual.apellido,
          nombre: alumnoActual.nombre,
          anio_ingreso: alumnoActual.anio_ingreso,
          activo: alumnoActual.activo ?? true,
          fecha_nac: alumnoActual.fecha_nac ?? null,
          telefono: alumnoActual.telefono ?? null,
          domicilio: alumnoActual.domicilio ?? null,
          tutor: alumnoActual.tutor ?? null,
          localidad: alumnoActual.localidad ?? null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Error al actualizar el alumno');
      }

      alert('Alumno actualizado correctamente');
      setMostrarModalEdicion(false);
      cargarAlumnos();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Ocurrió un error al guardar los cambios');
    }
  };

  // -------------------------
  // Eliminar alumno
  // -------------------------
  const handleEliminarAlumno = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este alumno?')) return;
    try {
      const res = await fetch(`/api/alumnos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlumnos(prev => prev.filter(a => a.id !== id));
      } else {
        alert('Error al eliminar el alumno');
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el alumno');
    }
  };

  // -------------------------
  // Abrir modal de notas (robusto)
  // -------------------------
  const handleAbrirModalNotas = async (alumno) => {
    setAlumnoActual(alumno);

    try {
      // 1) Materias de la división
      const resMaterias = await fetch(`/api/materias-por-division?division_id=${divisionId}`);
      if (!resMaterias.ok) throw new Error('Error al obtener materias');
      const materiasData = await resMaterias.json();
      setMaterias(materiasData || []);
      // 2) Notas ya guardadas para ese alumno+division
      const resNotas = await fetch(`/api/notas/por-alumno-division?alumno_id=${alumno.id}&division_id=${divisionId}`);
      if (!resNotas.ok) throw new Error('Error al obtener notas');
      const notasGuardadas = await resNotas.json();

      // DEBUG (podés comentar luego)
      console.log('Materias (modal notas):', materiasData);
      console.log('Notas guardadas (modal notas):', notasGuardadas);

      // 3) Armar estado inicial de notas de forma segura
      const inicialNotas = {};
      (Array.isArray(notasGuardadas) ? notasGuardadas : []).forEach(nota => {
        // Aceptar ambas formas: materia_division_id o materia_id (por compatibilidad)
        const id = nota.materia_division_id ?? nota.materia_id;
        if (!id) {
          // no abortamos, solo ignoramos registros mal formados
          console.warn('Registro de nota sin id de materia:', nota);
          return;
        }

        // Usar comparaciones explícitas para aceptar 0
        if (nota.nota_1t !== null && nota.nota_1t !== undefined) inicialNotas[`${id}-1T`] = nota.nota_1t;
        if (nota.nota_2t !== null && nota.nota_2t !== undefined) inicialNotas[`${id}-2T`] = nota.nota_2t;
        if (nota.nota_3t !== null && nota.nota_3t !== undefined) inicialNotas[`${id}-3T`] = nota.nota_3t;

        if (nota.nota_1c !== null && nota.nota_1c !== undefined) inicialNotas[`${id}-1C`] = nota.nota_1c;
        if (nota.nota_2c !== null && nota.nota_2c !== undefined) inicialNotas[`${id}-2C`] = nota.nota_2c;

        if (nota.nota_diciembre !== null && nota.nota_diciembre !== undefined) inicialNotas[`${id}-D`] = nota.nota_diciembre;
        if (nota.nota_febrero !== null && nota.nota_febrero !== undefined) inicialNotas[`${id}-F`] = nota.nota_febrero;
        if (nota.nota_marzo !== null && nota.nota_marzo !== undefined) inicialNotas[`${id}-M`] = nota.nota_marzo;
        if (nota.nota_final !== null && nota.nota_final !== undefined) inicialNotas[`${id}-FNL`] = nota.nota_final;
      });

      console.log('InicialNotas construidas:', inicialNotas);
      setNotas(inicialNotas);

      // Finalmente abrir el modal
      setShowModalNotas(true);
    } catch (err) {
      console.error('Error al preparar notas:', err);
      alert('Ocurrió un error al cargar datos para este alumno');
    }
  };

  // -------------------------
  // Guardar notas
  // -------------------------
  const handleGuardarNotas = async () => {
    if (!alumnoActual || !alumnoActual.id) {
      alert('Alumno inválido');
      return;
    }

    const notasPayload = materias.map((m) => {
      const id = m.id;
      return {
        alumno_id: alumnoActual.id,
        materia_division_id: id,
        nota_1t: notas[`${id}-1T`] !== undefined && notas[`${id}-1T`] !== '' ? parseFloat(notas[`${id}-1T`]) : null,
        nota_2t: notas[`${id}-2T`] !== undefined && notas[`${id}-2T`] !== '' ? parseFloat(notas[`${id}-2T`]) : null,
        nota_3t: notas[`${id}-3T`] !== undefined && notas[`${id}-3T`] !== '' ? parseFloat(notas[`${id}-3T`]) : null,
        nota_1c: notas[`${id}-1C`] !== undefined && notas[`${id}-1C`] !== '' ? parseFloat(notas[`${id}-1C`]) : null,
        nota_2c: notas[`${id}-2C`] !== undefined && notas[`${id}-2C`] !== '' ? parseFloat(notas[`${id}-2C`]) : null,
        nota_diciembre: notas[`${id}-D`] !== undefined && notas[`${id}-D`] !== '' ? parseFloat(notas[`${id}-D`]) : null,
        nota_febrero: notas[`${id}-F`] !== undefined && notas[`${id}-F`] !== '' ? parseFloat(notas[`${id}-F`]) : null,
        nota_marzo: notas[`${id}-M`] !== undefined && notas[`${id}-M`] !== '' ? parseFloat(notas[`${id}-M`]) : null,
        nota_final: notas[`${id}-FNL`] !== undefined && notas[`${id}-FNL`] !== '' ? parseFloat(notas[`${id}-FNL`]) : null,
      };
    });

    try {
      const res = await fetch('/api/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notasPayload),
      });

      if (res.ok) {
        alert('Notas guardadas correctamente');
        setShowModalNotas(false);
      } else {
        const data = await res.json().catch(() => ({}));
        alert('Error al guardar notas: ' + (data.error || ''));
      }
    } catch (err) {
      console.error('Error al enviar notas:', err);
      alert('Error al guardar notas');
    }
  };

  // -------------------------
  // Abrir modal boletín (mantengo simple)
  // -------------------------
  const handleAbrirModalBoletin = async (alumno) => {
    setAlumnoActual(alumno);
    try {
      const resMaterias = await fetch(`/api/materias-por-division?division_id=${divisionId}`);
      const materias = await resMaterias.json();
      const resNotas = await fetch(`/api/notas/por-alumno-division?alumno_id=${alumno.id}&division_id=${divisionId}`);
      const notas = await resNotas.json();

      const datosBoletin = (materias || []).map((materia) => {
        const nota = (notas || []).find(n => (n.materia_division_id ?? n.materia_id) === materia.id) || {};
        return {
          nombre: materia.nombre,
          nota_1T: nota.nota_1t ?? '',
          nota_2T: nota.nota_2t ?? '',
          nota_3T: nota.nota_3t ?? '',
          nota_1C: nota.nota_1c ?? '',
          nota_2C: nota.nota_2c ?? '',
          nota_diciembre: nota.nota_diciembre ?? '',
          nota_febrero: nota.nota_febrero ?? '',
          nota_marzo: nota.nota_marzo ?? '',
          nota_final: nota.nota_final ?? ''
        };
      });

      setNotasBoletin(datosBoletin);
      setShowModalBoletin(true);
    } catch (err) {
      console.error('Error al abrir boletín:', err);
      alert('Error al cargar boletín');
    }
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <Protegido>
      <div className="container mt-5">
        <h3 className="mb-4">Listado de Alumnos</h3>

        {/* Curso */}
        <div className="mb-3">
          <label>Curso</label>
          <select className="form-select" value={cursoId} onChange={(e) => setCursoId(e.target.value)}>
            <option value="">Seleccionar curso</option>
            {cursos.map(curso => (
              <option key={curso.id} value={curso.id}>{curso.nombre}</option>
            ))}
          </select>
        </div>

        {/* División */}
        <div className="mb-3">
          <label>División</label>
          <select className="form-select" value={divisionId} onChange={(e) => setDivisionId(e.target.value)}>
            <option value="">Seleccionar división</option>
            {divisiones.map(div => (
              <option key={div.id} value={div.id}>{div.nombre}</option>
            ))}
          </select>
        </div>

        {/* Tabla */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Apellido</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.length === 0 ? (
              <tr><td colSpan="4" className="text-center">No hay alumnos en esta división</td></tr>
            ) : alumnos.map(alumno => (
              <tr key={alumno.id}>
                <td>{alumno.dni}</td>
                <td>{alumno.apellido}</td>
                <td>{alumno.nombre}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleAbrirModalEdicion(alumno)}>Editar</button>
                  <button className="btn btn-sm btn-danger me-2" onClick={() => handleEliminarAlumno(alumno.id)}>Eliminar</button>
                  <button className="btn btn-sm btn-success me-2" onClick={() => handleAbrirModalNotas(alumno)}>Cargar Notas</button>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => handleAbrirModalBoletin(alumno)}>Ver notas</button>
                  <button className="btn btn-sm btn-info" onClick={() => router.push(`/admin/ver-boletin?alumno_id=${alumno.id}&division_id=${divisionId}`)}>Ver Boletín</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal edición */}
        <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Alumno</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {alumnoActual && (
              <>
                <label>DNI</label>
                <input className="form-control mb-2" value={alumnoActual.dni || ''} onChange={e => setAlumnoActual({ ...alumnoActual, dni: e.target.value })} />

                <label>Apellido</label>
                <input className="form-control mb-2" value={alumnoActual.apellido || ''} onChange={e => setAlumnoActual({ ...alumnoActual, apellido: e.target.value })} />

                <label>Nombre</label>
                <input className="form-control mb-2" value={alumnoActual.nombre || ''} onChange={e => setAlumnoActual({ ...alumnoActual, nombre: e.target.value })} />

                <label>Año de Ingreso</label>
                <input type="number" className="form-control mb-2" value={alumnoActual.anio_ingreso || ''} onChange={e => setAlumnoActual({ ...alumnoActual, anio_ingreso: e.target.value })} />

                <label>Fecha de Nacimiento</label>
                <input type="date" className="form-control mb-2" value={alumnoActual.fecha_nac || ''} onChange={e => setAlumnoActual({ ...alumnoActual, fecha_nac: e.target.value })} />

                <label>Teléfono</label>
                <input type="text" className="form-control mb-2" value={alumnoActual.telefono || ''} onChange={e => setAlumnoActual({ ...alumnoActual, telefono: e.target.value })} />

                <label>Domicilio</label>
                <input type="text" className="form-control mb-2" value={alumnoActual.domicilio || ''} onChange={e => setAlumnoActual({ ...alumnoActual, domicilio: e.target.value })} />

                <label>Tutor</label>
                <input type="text" className="form-control mb-2" value={alumnoActual.tutor || ''} onChange={e => setAlumnoActual({ ...alumnoActual, tutor: e.target.value })} />

                <label>Localidad</label>
                <input type="text" className="form-control mb-2" value={alumnoActual.localidad || ''} onChange={e => setAlumnoActual({ ...alumnoActual, localidad: e.target.value })} />
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleGuardarEdicion}>Guardar Cambios</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de notas */}
        <Modal show={showModalNotas} onHide={() => setShowModalNotas(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Cargar Notas para {alumnoActual?.apellido}, {alumnoActual?.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
                  <table className="table table-bordered table-sm align-middle">
                    <thead className="table-light text-center">
                      <tr>
                        <th>Materia</th>
                        {esTrimestral ? (
                          <>
                            <th>1° Trim</th>
                            <th>2° Trim</th>
                            <th>3° Trim</th>
                          </>
                        ) : (
                          <>
                            <th>1° Cuat</th>
                            <th>2° Cuat</th>
                          </>
                        )}
                        <th>Diciembre</th>
                        <th>Febrero</th>
                        <th>Marzo</th>
                        <th>Final</th>
                      </tr>
                    </thead>
                    <tbody>
                {materias.map((m) => (
                <tr key={m.id}>
                <td>{m.nombre}</td>

                  {esTrimestral ? (
                  <>
                    <td>
                        <input type="number" className="form-control sin-flechas" min="1" max="10" step="1" inputMode="numeric" pattern="[0-9]*"
                          value={notas[`${m.id}-1T`] ?? ''} onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, ''); // solo dígitos
                          if (raw === '') {
                           setNotas(prev => ({ ...prev, [`${m.id}-1T`]: '' }));
                            } else {
                              let n = parseInt(raw, 10);
                              if (n < 1) n = 1;
                              if (n > 10) n = 10;
                              setNotas(prev => ({ ...prev, [`${m.id}-1T`]: String(n) }));
                            }
                          }}
                            onKeyDown={(e) => {
                              // permitir números y teclas de control
                              if (
                                /[0-9]/.test(e.key) ||
                                ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                              ) {
                                return;
                              }
                              e.preventDefault();
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                          /></td>

                      <td>
                        <input  type="number" className="form-control sin-flechas" min="1" max="10"  step="1"  inputMode="numeric"
                          pattern="[0-9]*"
                          value={notas[`${m.id}-2T`] ?? ''}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            if (raw === '') {
                              setNotas(prev => ({ ...prev, [`${m.id}-2T`]: '' }));
                            } else {
                              let n = parseInt(raw, 10);
                              if (n < 1) n = 1;
                              if (n > 10) n = 10;
                              setNotas(prev => ({ ...prev, [`${m.id}-2T`]: String(n) }));
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              /[0-9]/.test(e.key) ||
                              ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                            ) return;
                            e.preventDefault();
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </td>

              <td>
                <input
                  type="number"
                  className="form-control sin-flechas"
                  min="1"
                  max="10"
                  step="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={notas[`${m.id}-3T`] ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    if (raw === '') {
                      setNotas(prev => ({ ...prev, [`${m.id}-3T`]: '' }));
                    } else {
                      let n = parseInt(raw, 10);
                      if (n < 1) n = 1;
                      if (n > 10) n = 10;
                      setNotas(prev => ({ ...prev, [`${m.id}-3T`]: String(n) }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      /[0-9]/.test(e.key) ||
                      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                    ) return;
                    e.preventDefault();
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </td>
            </>
          ) : (
            <>
              <td>
                <input
                  type="number"
                  className="form-control sin-flechas"
                  min="1"
                  max="10"
                  step="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={notas[`${m.id}-1C`] ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    if (raw === '') {
                      setNotas(prev => ({ ...prev, [`${m.id}-1C`]: '' }));
                    } else {
                      let n = parseInt(raw, 10);
                      if (n < 1) n = 1;
                      if (n > 10) n = 10;
                      setNotas(prev => ({ ...prev, [`${m.id}-1C`]: String(n) }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      /[0-9]/.test(e.key) ||
                      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                    ) return;
                    e.preventDefault();
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control sin-flechas"
                  min="1"
                  max="10"
                  step="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={notas[`${m.id}-2C`] ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    if (raw === '') {
                      setNotas(prev => ({ ...prev, [`${m.id}-2C`]: '' }));
                    } else {
                      let n = parseInt(raw, 10);
                      if (n < 1) n = 1;
                      if (n > 10) n = 10;
                      setNotas(prev => ({ ...prev, [`${m.id}-2C`]: String(n) }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      /[0-9]/.test(e.key) ||
                      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                    ) return;
                    e.preventDefault();
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </td>
            </>
          )}

          {/* Campos comunes */}
          <td>
            <input
              type="number"
              className="form-control sin-flechas"
              min="1"
              max="10"
              step="1"
              inputMode="numeric"
              pattern="[0-9]*"
              value={notas[`${m.id}-D`] ?? ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                if (raw === '') {
                  setNotas(prev => ({ ...prev, [`${m.id}-D`]: '' }));
                } else {
                  let n = parseInt(raw, 10);
                  if (n < 1) n = 1;
                  if (n > 10) n = 10;
                  setNotas(prev => ({ ...prev, [`${m.id}-D`]: String(n) }));
                }
              }}
              onKeyDown={(e) => {
                if (
                  /[0-9]/.test(e.key) ||
                  ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                ) return;
                e.preventDefault();
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </td>

          <td>
            <input
              type="number"
              className="form-control sin-flechas"
              min="1"
              max="10"
              step="1"
              inputMode="numeric"
              pattern="[0-9]*"
              value={notas[`${m.id}-F`] ?? ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                if (raw === '') {
                  setNotas(prev => ({ ...prev, [`${m.id}-F`]: '' }));
                } else {
                  let n = parseInt(raw, 10);
                  if (n < 1) n = 1;
                  if (n > 10) n = 10;
                  setNotas(prev => ({ ...prev, [`${m.id}-F`]: String(n) }));
                }
              }}
              onKeyDown={(e) => {
                if (
                  /[0-9]/.test(e.key) ||
                  ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                ) return;
                e.preventDefault();
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </td>

          <td>
            <input
              type="number"
              className="form-control sin-flechas"
              min="1"
              max="10"
              step="1"
              inputMode="numeric"
              pattern="[0-9]*"
              value={notas[`${m.id}-M`] ?? ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                if (raw === '') {
                  setNotas(prev => ({ ...prev, [`${m.id}-M`]: '' }));
                } else {
                  let n = parseInt(raw, 10);
                  if (n < 1) n = 1;
                  if (n > 10) n = 10;
                  setNotas(prev => ({ ...prev, [`${m.id}-M`]: String(n) }));
                }
              }}
              onKeyDown={(e) => {
                if (
                  /[0-9]/.test(e.key) ||
                  ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                ) return;
                e.preventDefault();
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </td>

          <td>
            <input
              type="number"
              className="form-control sin-flechas"
              min="1"
              max="10"
              step="1"
              inputMode="numeric"
              pattern="[0-9]*"
              value={notas[`${m.id}-FNL`] ?? ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                if (raw === '') {
                  setNotas(prev => ({ ...prev, [`${m.id}-FNL`]: '' }));
                } else {
                  let n = parseInt(raw, 10);
                  if (n < 1) n = 1;
                  if (n > 10) n = 10;
                  setNotas(prev => ({ ...prev, [`${m.id}-FNL`]: String(n) }));
                }
              }}
              onKeyDown={(e) => {
                if (
                  /[0-9]/.test(e.key) ||
                  ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                ) return;
                e.preventDefault();
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </td>
        </tr>
      ))}
    </tbody>
      </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalNotas(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleGuardarNotas}>Guardar Notas</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Boletín */}
        <Modal show={showModalBoletin} onHide={() => setShowModalBoletin(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Boletín de {alumnoActual?.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Materia</th>
                    <th>1T</th>
                    <th>2T</th>
                    <th>3T</th>
                    <th>1C</th>
                    <th>2C</th>
                    <th>Dic</th>
                    <th>Feb</th>
                    <th>Mar</th>
                    <th>Final</th>
                  </tr>
                </thead>
                <tbody>
                  {notasBoletin.map((fila, i) => (
                    <tr key={i}>
                      <td>{fila.nombre}</td>
                      <td>{fila.nota_1T}</td>
                      <td>{fila.nota_2T}</td>
                      <td>{fila.nota_3T}</td>
                      <td>{fila.nota_1C}</td>
                      <td>{fila.nota_2C}</td>
                      <td>{fila.nota_diciembre}</td>
                      <td>{fila.nota_febrero}</td>
                      <td>{fila.nota_marzo}</td>
                      <td>{fila.nota_final}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalBoletin(false)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Protegido>
  );
}
