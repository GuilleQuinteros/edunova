import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { ids_alumnos, nuevo_curso_id, nueva_division_id } = req.body;

  if (!ids_alumnos || !Array.isArray(ids_alumnos) || ids_alumnos.length === 0) {
    return res.status(400).json({ error: 'Faltan alumnos a promover.' });
  }

  if (!nuevo_curso_id || !nueva_division_id) {
    return res.status(400).json({ error: 'Faltan curso o división destino.' });
  }

  const { error } = await supabase
    .from('alumnos')
    .update({
      curso_id: nuevo_curso_id,
      division_id: nueva_division_id,
    })
    .in('id', ids_alumnos);

  if (error) {
    console.error('Error al promover alumnos:', error);
    return res.status(500).json({ error: 'No se pudieron promover los alumnos.' });
  }

  return res.status(200).json({ mensaje: 'Alumnos promovidos correctamente.' });
}
