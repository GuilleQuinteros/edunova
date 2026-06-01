// pages/api/cursos/index.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener cursos
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .order('id');

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    // Crear curso
    const { nombre, es_trimestral } = req.body;

    if (!nombre || typeof es_trimestral !== 'boolean') {
      return res.status(400).json({ error: 'Datos incompletos o inválidos' });
    }

    const { data, error } = await supabase
      .from('cursos')
      .insert([{ nombre, es_trimestral }])
      .select()
      .single();

    if (error) {
      console.error('Error al insertar curso:', error);
      return res.status(500).json({ error: 'No se pudo guardar el curso' });
    }

    return res.status(200).json(data);
  }

  // Método no permitido
  return res.status(405).json({ error: 'Método no permitido' });
}
