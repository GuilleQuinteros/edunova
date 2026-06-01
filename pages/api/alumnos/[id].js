import { createClient } from '@supabase/supabase-js';
import { verificarUsuario } from '@/lib/verificarUsuario';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  // 🔒 Protección de rutas
  const usuario = verificarUsuario(req);
  if (!usuario) return res.status(401).json({ error: 'No autorizado' });

  // === GET ===
  if (req.method === 'GET') {
    const { data, error } = await supabase
  .from('alumnos')
  .select(`
    id,
    nombre,
    apellido,
    dni,
    anio_ingreso,
    curso_id,
    division_id,
    activo,
    fecha_nac,
    telefono,
    domicilio,
    tutor,
    localidad,
    divisiones (
      id,
      nombre,
      curso_id
    )
  `)
  .eq('id', id)
  .single();

    if (error) {
      console.error('Error al obtener alumno:', error);
      return res.status(500).json({ error: 'Error al obtener alumno' });
    }
    const cursosMap = {
      1: '1° Año',
      2: '2° Año',
      3: '3° Año',
      4: '4° Año',
      5: '5° Año',
      6: '6° Año',
      7: '7° Año'
    };

      data.curso_nombre = cursosMap[data.curso_id] || '';

    return res.status(200).json(data);
  }

  // === PUT ===
  if (req.method === 'PUT') {
    const {
      dni,
      apellido,
      nombre,
      anio_ingreso,
      activo,
      fecha_nac,
      telefono,
      domicilio,
      tutor,
      localidad
    } = req.body;

    const { data, error } = await supabase
      .from('alumnos')
      .update({
        dni,
        apellido,
        nombre,
        anio_ingreso,
        activo,
        fecha_nac,
        telefono,
        domicilio,
        tutor,
        localidad
      })
      .eq('id', id);

    if (error) {
      console.error('Error al actualizar alumno:', error);
      return res.status(500).json({ error: 'Error al actualizar alumno' });
    }

    return res.status(200).json({ message: 'Alumno actualizado', data });
  }

  // === DELETE ===
  if (req.method === 'DELETE') {
    try {
      // 1️⃣ Eliminar notas asociadas
      const { error: errorNotas } = await supabase
        .from('notas')
        .delete()
        .eq('alumno_id', id);

      if (errorNotas) {
        console.error('Error al eliminar notas:', errorNotas);
        return res.status(500).json({ error: 'Error al eliminar notas del alumno' });
      }

      // 2️⃣ Eliminar alumno
      const { error: errorAlumno } = await supabase
        .from('alumnos')
        .delete()
        .eq('id', id);

      if (errorAlumno) {
        console.error('Error al eliminar alumno:', errorAlumno);
        return res.status(500).json({ error: 'Error al eliminar el alumno' });
      }

      return res.status(200).json({ message: 'Alumno y sus notas eliminados correctamente' });
    } catch (err) {
      console.error('Error general al eliminar:', err);
      return res.status(500).json({ error: 'Error interno al eliminar alumno' });
    }
  }

  // === Otro método no permitido ===
  return res.status(405).json({ error: 'Método no permitido' });
}
