// pages/api/buscar-tutor.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { dni } = req.body;

  if (!dni) {
    return res.status(400).json({ error: 'Falta el DNI' });
  }

  try {
    // 1️⃣ Buscar alumno por DNI
    const { data: alumno, error: errAlumno } = await supabase
        .from('alumnos')
        .select(`
          *,
          division:division_id (
            id,
            nombre
          )
        `)
        .eq('dni', dni)
        .single();
        console.log('Alumno tutor:', alumno);
    if (errAlumno || !alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    // 2️⃣ Buscar notas y unir con la tabla materias directamente
    const { data: notas, error: errNotas } = await supabase
      .from('notas')
      .select(`
        id,
        nota_1t, nota_2t, nota_3t,
        nota_1c, nota_2c,
        nota_diciembre, nota_febrero, nota_marzo, nota_final,
        materia_division_id,
        materias: materia_division_id (
          id,
          nombre,
          division_id
        )
      `)
      .eq('alumno_id', alumno.id);

    if (errNotas) {
      console.error('Error al obtener notas:', errNotas);
      return res.status(500).json({ error: 'Error al obtener notas' });
    }

    // 3️⃣ Normalizar formato
    const materiasNotas = notas.map((n) => ({
      id: n.id,
      nombre: n.materias?.nombre || 'Sin nombre',
      nota_1t: n.nota_1t,
      nota_2t: n.nota_2t,
      nota_3t: n.nota_3t,
      nota_1c: n.nota_1c,
      nota_2c: n.nota_2c,
      nota_diciembre: n.nota_diciembre,
      nota_febrero: n.nota_febrero,
      nota_marzo: n.nota_marzo,
      nota_final: n.nota_final,
    }));

        const { data: curso, error: errCurso } = await supabase
      .from('cursos')
      .select('es_trimestral')
      .eq('id', alumno.curso_id)
      .single();

      if (errCurso) {
        console.error('Error al obtener curso:', errCurso);
        return res.status(500).json({ error: 'Error al obtener curso' });
      }

    return res.status(200).json({
        alumno,
        materiasNotas,
        esTrimestral: curso.es_trimestral
      });
      
  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
