import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const { curso_origen_id, division_origen_id } = req.body;

  if (!curso_origen_id || !division_origen_id)
    return res.status(400).json({ error: "Faltan datos" });

  // Traemos alumnos de la división
  const { data: alumnos, error: errorAlumnos } = await supabase
    .from("alumnos")
    .select("id, nombre, apellido, dni")
    .eq("division_id", division_origen_id);

  if (errorAlumnos) {
    console.error(errorAlumnos);
    return res.status(500).json({ error: "Error al obtener alumnos" });
  }

  // Traemos notas finales de esos alumnos
  const { data: notas, error: errorNotas } = await supabase
    .from("notas")
    .select("alumno_id, nota_final");

  if (errorNotas) {
    console.error(errorNotas);
    return res.status(500).json({ error: "Error al obtener notas" });
  }

  // Analizamos cada alumno
  const resultado = alumnos.map((alumno) => {
    const notasAlumno = notas.filter((n) => n.alumno_id === alumno.id);
    const total = notasAlumno.length;
    const desaprobadas = notasAlumno.filter(
      (n) => n.nota_final === null || n.nota_final < 6
    ).length;

    let estado = "sin_datos";
    if (total === 0) estado = "sin_datos";
    else if (desaprobadas <= 3) estado = "promueve";
    else estado = "revisar";

    return { ...alumno, total, desaprobadas, estado };
  });

  const resumen = {
    promueve: resultado.filter((r) => r.estado === "promueve").length,
    revisar: resultado.filter((r) => r.estado === "revisar").length,
    sin_datos: resultado.filter((r) => r.estado === "sin_datos").length,
  };

  res.status(200).json({ resumen, detalle: resultado });
}
