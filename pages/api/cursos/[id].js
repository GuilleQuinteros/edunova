// pages/api/cursos/[id].js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // ✅ Obtener información del curso (incluye si es_trimestral)
    const { data, error } = await supabase
      .from('cursos')
      .select('id, nombre, es_trimestral')
      .eq('id', id)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    // 🔒 Verificar relaciones antes de eliminar
    const { data: divisiones, error: errorDiv } = await supabase
      .from('divisiones')
      .select('id')
      .eq('curso_id', id);

    if (errorDiv) return res.status(500).json({ error: errorDiv.message });

    if (divisiones.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar. El curso tiene divisiones asociadas.' });
    }

    const { error } = await supabase
      .from('cursos')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ mensaje: 'Curso eliminado correctamente' });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
