import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { division_id } = req.query;

  if (!division_id) {
    return res.status(400).json({ error: 'Falta division_id' });
  }

  const { data, error } = await supabase
    .from('materias')
    .select('*')
    .eq('division_id', division_id);

  if (error) {
    return res.status(500).json({ error: 'Error al obtener materias' });
  }

  res.status(200).json(data);
}
