// pages/api/alumnos/por-division.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { division_id } = req.query;

  if (!division_id) {
    return res.status(400).json({ error: 'Falta el ID de la división' });
  }

  const { data, error } = await supabase
    .from('alumnos')
    .select(`
      id,
      dni,
      nombre,
      apellido,
      anio_ingreso,
      curso_id,
      division_id,
      activo,
      fecha_nac,
      telefono,
      domicilio,
      tutor,
      localidad
    `)
    .eq('division_id', division_id)
    .order('apellido', { ascending: true });

  if (error) {
    console.error('Error al obtener alumnos por división:', error);
    return res.status(500).json({ error: 'Error al obtener alumnos' });
  }

  return res.status(200).json(data);
}
