// pages/api/alumnos/boletines.js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { dni } = req.query;
  if (!dni) return res.status(400).json({ error: "Falta DNI" });

  // ✅ Buscar alumno
  const { data: alumno, error: errAlumno } = await supabase
    .from("alumnos")
    .select("id")
    .eq("dni", dni)
    .single();

  if (errAlumno) return res.status(404).json({ error: "Alumno no encontrado" });

  // ✅ Buscar todos los cursos donde tuvo notas
  const { data: cursos, error: errCursos } = await supabase
    .from("notas")
    .select(`
      cursos ( id, nombre )
    `)
    .eq("alumno_id", alumno.id);

  if (errCursos) return res.status(500).json({ error: "Error buscando cursos" });

  // ✅ Filtrar cursos únicos
  const unicos = [];
  const ids = new Set();

  cursos.forEach(n => {
    if (n.cursos && !ids.has(n.cursos.id)) {
      ids.add(n.cursos.id);
      unicos.push(n.cursos);
    }
  });

  return res.status(200).json(unicos);
}
