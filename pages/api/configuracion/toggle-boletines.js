import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  const { habilitado } = req.body;

  const { error } = await supabase
    .from('configuracion_sistema')
    .update({
      consulta_boletines_habilitada: habilitado,
      actualizado_en: new Date()
    })
    .eq('id', 1);

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.status(200).json({
    ok: true
  });
}