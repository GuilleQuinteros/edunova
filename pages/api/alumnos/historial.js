// pages/api/alumnos/historial.js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { dni } = req.query;

  if (!dni) return res.status(400).json({ error: "Falta DNI" });

  // ✅ Buscar alumno por DNI
  const { data: alumno, error: errorAlumno } = await supabase
    .from("alumnos")
    .select("id, nombre, apellido, dni")
    .eq("dni", dni)
    .single();

  if (errorAlumno || !alumno) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  // ✅ Buscar notas con joins correctos
  const { data: notas, error: errorNotas } = await supabase
    .from("notas")
    .select(`
      id,
      nota_1t, nota_2t, nota_3t,
      nota_1c, nota_2c,
      nota_diciembre, nota_febrero, nota_marzo, nota_final,

      materia_division: materia_division_id (
        id,
        materias: materia_id ( nombre ),
        division: division_id (
          id,
          cursos: curso_id ( nombre )
        )
      )
    `)
    .eq("alumno_id", alumno.id);

  if (errorNotas) {
    console.log("Error Notas:", errorNotas);
    return res.status(500).json({ error: "Error consultando notas" });
  }

  const historial = (notas || []).map((n) => ({
    materia: n.materia_division?.materias?.nombre || "",
    curso: n.materia_division?.division?.cursos?.nombre || "",
    ...n,
  }));

  return res.status(200).json({
    alumno,
    historial,
  });
}
