import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BoletinTrimestral from '../../components/BoletinTrimestral';
import BoletinCuatrimestral from '../../components/BoletinCuatrimestral';

export default function BoletinTutor() {
  const router = useRouter();
  const { dni } = router.query;

  const [alumno, setAlumno] = useState(null);
  const [materiasNotas, setMateriasNotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [esTrimestral, setEsTrimestral] = useState(null);

  useEffect(() => {
    if (dni) fetchBoletin();
  }, [dni]);

  const fetchBoletin = async () => {
  try {
    const res = await fetch('/api/buscar-tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dni })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }

    setAlumno(data.alumno);
    setMateriasNotas(data.materiasNotas);
    setEsTrimestral(data.esTrimestral);

  } catch (error) {
    console.error('Error al obtener boletín:', error);
  } finally {
    setCargando(false);
  }
};

  if (cargando) return <div className="container mt-5">Cargando boletín...</div>;
  if (!alumno) return <div className="container mt-5">Alumno no encontrado.</div>;

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
