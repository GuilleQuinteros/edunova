import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const { alumno_ids, curso_destino_id, division_destino_id } = req.body;

  if (!alumno_ids?.length || !curso_destino_id || !division_destino_id)
    return res.status(400).json({ error: "Faltan datos" });

  const { error } = await supabase
    .from("alumnos")
    .update({
      curso_id: curso_destino_id,
      division_id: division_destino_id,
    })
    .in("id", alumno_ids);

  if (error)
    return res.status(500).json({ error: "Error al promover alumnos" });

  return res.status(200).json({
    mensaje: `Se promovieron ${alumno_ids.length} alumnos correctamente.`,
  });
}
