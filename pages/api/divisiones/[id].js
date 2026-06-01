// pages/api/divisiones/[id].js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    // 1. Verificar si tiene materias asociadas
    const { data: materias, error: errorMaterias } = await supabase
      .from('materias_division')
      .select('id')
      .eq('division_id', id);

    if (errorMaterias) return res.status(500).json({ error: errorMaterias.message });
    if (materias.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar. La división tiene materias asociadas.' });
    }

    // 2. Verificar si tiene alumnos asociados
    const { data: alumnos, error: errorAlumnos } = await supabase
      .from('alumnos')
      .select('id')
      .eq('division_id', id);

    if (errorAlumnos) return res.status(500).json({ error: errorAlumnos.message });
    if (alumnos.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar. La división tiene alumnos asociados.' });
    }

    // 3. Eliminar la división
    const { error } = await supabase
      .from('divisiones')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ mensaje: 'División eliminada correctamente' });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
