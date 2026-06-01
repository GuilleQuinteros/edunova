// pages/api/notas/cargar-form.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { division_id } = req.query;

  if (!division_id) {
    return res.status(400).json({ error: 'Falta el parámetro division_id' });
  }

  try {
    // Obtener alumnos activos de la división
    const { data: alumnos, error: errAlumnos } = await supabase
      .from('alumnos')
      .select('id, nombre, apellido, dni')
      .eq('division_id', division_id)
      .eq('activo', true)
      .order('apellido', { ascending: true });

    if (errAlumnos) throw errAlumnos;

    // Obtener materias asociadas a la división
    const { data: materias, error: errMaterias } = await supabase
      .from('materias')
      .select('id, nombre')
      .eq('division_id', division_id)
      .order('nombre');

    if (errMaterias) throw errMaterias;

    return res.status(200).json({ alumnos, materias });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return res.status(500).json({ error: 'Error al obtener alumnos o materias' });
  }
}
