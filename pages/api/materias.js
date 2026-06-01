// pages/api/materias.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, division_id } = req.body;

  if (!nombre || !division_id) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const { data, error } = await supabase
    .from('materias')
    .insert([{ nombre, division_id }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data[0]);
}
