import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BoletinTrimestral from '../../components/BoletinTrimestral';
import BoletinCuatrimestral from '../../components/BoletinCuatrimestral';

export default function VerBoletin() {
  const router = useRouter();
  const { alumno_id, division_id } = router.query;

  const [alumno, setAlumno] = useState(null);
  const [materiasNotas, setMateriasNotas] = useState([]);
  const [esTrimestral, setEsTrimestral] = useState(null); // ← Nuevo
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (alumno_id && division_id) {
      cargarDatos();
    }
  }, [alumno_id, division_id]);

  const cargarDatos = async () => {
  try {
    const [resAlumno, resNotas] = await Promise.all([
      fetch(`/api/alumnos/${alumno_id}`),
      fetch(`/api/notas/por-alumno-division?alumno_id=${alumno_id}&division_id=${division_id}`)
    ]);

    const alumnoData = await resAlumno.json();
    const notasData = await resNotas.json();

    console.log('Alumno completo:', alumnoData); // 👈 Agregado
    const resCurso = await fetch(`/api/cursos/${alumnoData.curso_id}`);
    const cursoData = await resCurso.json();
    console.log('Curso:', cursoData); // 👈 Agregado

    setAlumno(alumnoData);
    setMateriasNotas(notasData);
    setEsTrimestral(cursoData.es_trimestral);
  } catch (err) {
    console.error('Error al cargar datos:', err);
  } finally {
    setCargando(false);
  }
};

  if (cargando || esTrimestral === null) return <div className="container mt-5">Cargando boletín...</div>;
  if (!alumno) return <div className="container mt-5">Alumno no encontrado</div>;

  return (
    <div className="container mt-4">
      {esTrimestral ? (
        <BoletinTrimestral alumno={alumno} materiasNotas={materiasNotas} />
      ) : (
        <BoletinCuatrimestral alumno={alumno} materiasNotas={materiasNotas} />
      )}
    </div>
  );
}
