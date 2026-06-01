import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BoletinTrimestral from '../components/BoletinTrimestral';
import BoletinCuatrimestral from '../components/BoletinCuatrimestral';

export default function BoletinTutor() {
  const router = useRouter();
  const { alumno_id, division_id } = router.query;

  const [alumno, setAlumno] = useState(null);
  const [materiasNotas, setMateriasNotas] = useState([]);
  const [esTrimestral, setEsTrimestral] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (alumno_id && division_id) {
      cargarDatos();
    }
  }, [alumno_id, division_id]);

  const cargarDatos = async () => {
    try {
      // 1️⃣ Datos del alumno
      const resAlumno = await fetch(`/api/alumnos/${alumno_id}`);
      const alumnoData = await resAlumno.json();

      // 2️⃣ Notas
      const resNotas = await fetch(`/api/notas/por-alumno-division?alumno_id=${alumno_id}&division_id=${division_id}`);
      const notasData = await resNotas.json();

      // 3️⃣ Tipo de curso (trimestral o cuatrimestral)
      const resCurso = await fetch(`/api/cursos/${alumnoData.curso_id}`);
      const cursoData = await resCurso.json();

      setAlumno(alumnoData);
      setMateriasNotas(notasData);
      setEsTrimestral(cursoData.es_trimestral);
    } catch (error) {
      console.error('Error al cargar boletín:', error);
    } finally {
      setCargando(false);
    }
  };

  // 📄 Descargar PDF
  const handleDescargarPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    const boletin = document.getElementById('boletin-container');
    const canvas = await html2canvas(boletin);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Boletin_${alumno?.apellido}_${alumno?.nombre}.pdf`);
  };

  if (cargando) return <div className="container mt-5">Cargando boletín...</div>;
  if (!alumno) return <div className="container mt-5">Alumno no encontrado</div>;

  const fechaActual = new Date().toLocaleDateString('es-AR');
  const anioLectivo = new Date().getFullYear();

  return (
    <div className="container mt-4">
      {/* 🏫 Encabezado institucional */}
      <div className="text-center mb-4">
        <img src="/logo.png" alt="Logo del colegio" style={{ width: '80px', height: '80px' }} />
        <h3 className="mt-2">Instituto Técnico Profesional N° 12</h3>
        <p>Año lectivo {anioLectivo} — Fecha de emisión: {fechaActual}</p>
        <hr />
      </div>

      {/* 📘 Boletín */}
      <div id="boletin-container">
        {esTrimestral ? (
          <BoletinTrimestral alumno={alumno} materiasNotas={materiasNotas} />
        ) : (
          <BoletinCuatrimestral alumno={alumno} materiasNotas={materiasNotas} />
        )}
      </div>

      {/* 📎 Botón para descargar */}
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleDescargarPDF}>
          Descargar PDF
        </button>
      </div>
    </div>
  );
}
