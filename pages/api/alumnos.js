// pages/api/alumnos.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { division_id } = req.query;

    if (!division_id) {
      return res.status(400).json({ error: 'Falta division_id' });
    }

    const { data, error } = await supabase
      .from('alumnos')
      .select('*')
      .eq('division_id', division_id)
      .order('apellido', { ascending: true });

    if (error) {
      console.error('Error al obtener alumnos:', error);
      return res.status(500).json({ error: 'Error al obtener alumnos' });
    }

    return res.status(200).json(data);
  }

  // ✅ POST: crear alumno
  if (req.method === 'POST') {
  const {
    dni, apellido, nombre, curso_id, division_id, anio_ingreso,
    fecha_nac, telefono, domicilio, tutor, localidad
  } = req.body;

  const { data, error } = await supabase
    .from('alumnos')
    .insert([
      {
        dni,
        apellido,
        nombre,
        curso_id,
        division_id,
        anio_ingreso,
        fecha_nac,
        telefono,
        domicilio,
        tutor,
        localidad,
        activo: true
      }
    ]);

    if (error) {
      console.error('Error al insertar alumno:', error);
      return res.status(500).json({ error: 'No se pudo registrar el alumno' });
    }

    return res.status(200).json({ mensaje: 'Alumno cargado correctamente', data });
  }

  // ⛔ Método no permitido
  return res.status(405).json({ error: 'Método no permitido' });
}
