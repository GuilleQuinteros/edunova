// pages/api/notas.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const payload = req.body;

  if (!Array.isArray(payload)) {
    return res.status(400).json({ error: 'Formato incorrecto' });
  }

  try {
    // Insertar todas las notas como un batch
    const { data, error } = await supabase
      .from('notas')
      .upsert(payload, { onConflict: ['alumno_id', 'materia_division_id'] }); // Para evitar duplicados

    if (error) {
      console.error('Error al guardar notas:', error);
      return res.status(500).json({ error: 'Error al guardar notas' });
    }

    return res.status(200).json({ mensaje: 'Notas guardadas correctamente' });
  } catch (e) {
    console.error('Error inesperado:', e);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
