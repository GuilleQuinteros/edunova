// pages/api/divisiones/index.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { curso_id } = req.query;

    let query = supabase
      .from('divisiones')
      .select(`
        id,
        nombre,
        curso_id,
        cursos (
          nombre
        )
      `)
      .order('curso_id')
      .order('nombre');

    // Si viene el curso_id en la query, filtramos
    if (curso_id) {
      query = query.eq('curso_id', curso_id);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { nombre, curso_id } = req.body;

    if (!nombre || !curso_id) {
      return res.status(400).json({ error: 'Nombre y curso_id son obligatorios' });
    }

    const { data, error } = await supabase
      .from('divisiones')
      .insert([{ nombre, curso_id }])
      .select()
      .single();

    if (error) {
      console.error('Error al insertar división:', error);
      return res.status(500).json({ error: 'No se pudo guardar la división' });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
