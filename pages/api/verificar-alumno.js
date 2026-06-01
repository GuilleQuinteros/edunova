// pages/api/verificar-alumno.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 🔐 usar solo en backend
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { dni } = req.body;

  if (!dni) {
    return res.status(400).json({ error: 'Debe ingresar un DNI.' });
  }

  try {
    // 🔹 Buscar alumno activo por DNI
    const { data: alumno, error } = await supabase
      .from('alumnos')
      .select('id, dni, nombre, apellido, division_id')
      .eq('dni', dni)
      .eq('activo', true)
      .single();

    if (error || !alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado.' });
    }

    return res.status(200).json({ alumno });
  } catch (err) {
    console.error('Error en verificar-alumno:', err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
