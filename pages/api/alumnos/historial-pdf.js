import PDFDocument from "pdfkit";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { dni } = req.query;
  if (!dni) return res.status(400).json({ error: "Falta DNI" });

  const { data: alumno } = await supabase
    .from("alumnos")
    .select("*")
    .eq("dni", dni)
    .single();

  const { data: notas } = await supabase
    .from("notas")
    .select("*, materias(nombre), cursos(nombre)")
    .eq("alumno_id", alumno.id);

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=historial_${dni}.pdf`);
  doc.pipe(res);

  doc.fontSize(18).text(`Historial Académico - ${alumno.apellido}, ${alumno.nombre}`);
  doc.moveDown();

  notas.forEach((n) => {
    doc.fontSize(12).text(
      `${n.cursos.nombre} - ${n.materias.nombre} → Final: ${n.nota_final ?? "-"}`
    );
  });

  doc.end();
}
