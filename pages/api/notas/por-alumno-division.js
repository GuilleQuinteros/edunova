// pages/api/notas/por-alumno-division.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { alumno_id, division_id } = req.query;
  if (!alumno_id || !division_id) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  try {
    // 1. Traer materias de la división
    const { data: materias, error: errMat } = await supabase
      .from('materias')
      .select('id, nombre')
      .eq('division_id', division_id);

    if (errMat) throw errMat;

    const materiaIds = materias.map((m) => m.id);
    if (materiaIds.length === 0) {
      return res.status(200).json([]);
    }

    // 2. Traer notas del alumno para esas materias
    const { data: notas, error: errNotas } = await supabase
      .from('notas')
      .select('*')
      .eq('alumno_id', alumno_id)
      .in('materia_division_id', materiaIds);

    if (errNotas) throw errNotas;

    // 3. Combinar nombre de la materia con sus notas
    const resultado = materias.map((materia) => {
      const nota = notas.find(n => n.materia_division_id === materia.id) || {};
      return {
        id: materia.id,
        nombre: materia.nombre,
        ...nota
      };
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error en notas/por-alumno-division:', error);
    return res.status(500).json({ error: 'Error al obtener notas' });
  }
}
