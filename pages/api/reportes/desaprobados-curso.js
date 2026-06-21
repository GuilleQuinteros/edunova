import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

try {


const { periodo } = req.query;

let campoNota = 'nota_1t';

switch (periodo) {
  case '1t':
    campoNota = 'nota_1t';
    break;
  case '2t':
    campoNota = 'nota_2t';
    break;
  case '3t':
    campoNota = 'nota_3t';
    break;
  case '1c':
    campoNota = 'nota_1c';
    break;
  case '2c':
    campoNota = 'nota_2c';
    break;
  case 'final':
    campoNota = 'nota_final';
    break;
  default:
    campoNota = 'nota_1t';
}

const bloques = [];

for (let desde = 0; desde < 5000; desde += 1000) {

  const { data, error } = await supabase
    .from('notas')
    .select(`
      id,
      alumno_id,
      ${campoNota},
      alumnos (
        id,
        curso_id
      )
    `)
    .range(desde, desde + 999);

  if (error) throw error;

  console.log(
    `BLOQUE ${desde}-${desde + 999}:`,
    data.length
  );

  bloques.push(...data);

  if (data.length < 1000) {
    break;
  }
}

console.log('TOTAL FINAL:', bloques.length);

const cursosDetectados = {};

bloques.forEach((nota) => {

  const curso = nota.alumnos?.curso_id;

  if (curso) {
    cursosDetectados[curso] =
      (cursosDetectados[curso] || 0) + 1;
  }
});

console.log('CURSOS DETECTADOS:');
console.log(cursosDetectados);

const desaprobadosPorCurso = {};

bloques.forEach((nota) => {

  const valor = nota[campoNota];

  if (
    valor !== null &&
    Number(valor) < 6
  ) {

    const curso = nota.alumnos?.curso_id;

    if (curso) {

      desaprobadosPorCurso[curso] =
        (desaprobadosPorCurso[curso] || 0) + 1;
    }
  }
});

console.log('DESAPROBADOS POR CURSO:');
console.log(desaprobadosPorCurso);

const ejemplosTercero = bloques
  .filter(n => n.alumnos?.curso_id === 3)
  .slice(0, 20)
  .map(n => ({
    alumno_id: n.alumno_id,
    nota: n[campoNota]
  }));

console.log('MUESTRA 3° AÑO');
console.log(ejemplosTercero);

const ranking = Object.entries(desaprobadosPorCurso)
  .map(([curso, cantidad]) => ({
    curso,
    cantidad
  }))
  .sort((a, b) => b.cantidad - a.cantidad);

return res.status(200).json({
  totalNotas: bloques.length,
  cursosDetectados,
  desaprobadosPorCurso,
  muestraTercerAnio: ejemplosTercero,
  ranking
});


} catch (error) {

console.error(error);

return res.status(500).json({
  error: error.message
});
}
}