import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Método no permitido' });

  const { curso_origen_id, division_origen_id } = req.body;

  if (!curso_origen_id || !division_origen_id)
    return res.status(400).json({ error: 'Faltan datos de origen' });

  // 1️⃣ Obtener alumnos de esa división
  const { data: alumnos, error: errAlumnos } = await supabase
    .from('alumnos')
    .select('id, apellido, nombre, curso_id, division_id')
    .eq('division_id', division_origen_id)
    .eq('activo', true);

  if (errAlumnos) return res.status(500).json({ error: 'Error obteniendo alumnos' });

  if (!alumnos.length)
    return res.status(200).json({ mensaje: 'No hay alumnos en la división.' });

  // 2️⃣ Obtener todas las notas finales de esos alumnos
  const ids = alumnos.map(a => a.id);

  const { data: notas, error: errNotas } = await supabase
    .from('notas')
    .select('alumno_id, nota_final')
    .in('alumno_id', ids);

  if (errNotas) return res.status(500).json({ error: 'Error obteniendo notas' });

  // 3️⃣ Agrupar notas por alumno y contar desaprobadas
  const resumen = {};
  notas.forEach(n => {
    if (!resumen[n.alumno_id]) resumen[n.alumno_id] = { desaprobadas: 0 };
    if (n.nota_final === null || n.nota_final < 6)
      resumen[n.alumno_id].desaprobadas++;
  });

  // 4️⃣ Determinar quiénes promocionan
  const promovidos = alumnos.filter(a => (resumen[a.id]?.desaprobadas ?? 0) <= 3);

  if (!promovidos.length)
    return res.status(200).json({ mensaje: 'Ningún alumno cumple condiciones.' });

  // 5️⃣ Determinar curso destino (automáticamente: curso actual + 1)
  const cursoDestino = a => parseInt(a.curso_id) + 1; // asumiendo nombres 1, 2, 3...
  // Si tus cursos tienen IDs distintos del número de año, podemos usar una tabla “orden” luego.

  // 6️⃣ Promover alumnos elegibles
  const updates = promovidos.map(async (a) => {
    // obtener division destino del curso siguiente
    const { data: divisiones } = await supabase
      .from('divisiones')
      .select('id')
      .eq('curso_id', cursoDestino(a))
      .limit(1);

    if (!divisiones?.length) return;

    await supabase
      .from('alumnos')
      .update({
        curso_id: cursoDestino(a),
        division_id: divisiones[0].id,
      })
      .eq('id', a.id);
  });

  await Promise.all(updates);

  return res.status(200).json({
    mensaje: `Promoción automática completada. Promovidos: ${promovidos.length}`,
    promovidos,
  });
}
