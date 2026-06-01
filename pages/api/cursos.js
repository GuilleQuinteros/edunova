// pages/api/cursos.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('cursos')
      .select('id, nombre')
      .order('id', { ascending: true });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return res.status(500).json({ error: 'Error al obtener cursos' });
  }
}
