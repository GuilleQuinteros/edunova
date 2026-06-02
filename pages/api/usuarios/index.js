import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      email,
      rol,
      activo,
      creado_en
    `)
    .order('creado_en', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Error obteniendo usuarios'
    });
  }

  return res.status(200).json(data);
}