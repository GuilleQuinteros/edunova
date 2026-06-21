import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

try {


const {
  minimo = 4,
  periodo = '1T'
} = req.query;

const campos = {
  '1T': 'nota_1t',
  '2T': 'nota_2t',
  '3T': 'nota_3t',
  '1C': 'nota_1c',
  '2C': 'nota_2c',
  'DIC': 'nota_diciembre',
  'FEB': 'nota_febrero',
  'MAR': 'nota_marzo',
  'FINAL': 'nota_final'
};

const campo = campos[periodo];

if (!campo) {
  return res.status(400).json({
    error: 'Periodo inválido'
  });
}

const bloques = [];

for (let desde = 0; desde < 10000; desde += 1000) {

  const { data, error } = await supabase
    .from('notas')
    .select(`
      alumno_id,
      ${campo},
      alumnos (
        apellido,
        nombre,
        curso_id,
        division_id,
        divisiones (
          nombre
        )
      )
    `)
    .range(desde, desde + 999);

  if (error) throw error;

  bloques.push(...data);

  console.log(
    `Bloque ${desde}-${desde + 999}:`,
    data.length
  );

  if (data.length < 1000) {
    break;
  }
}

console.log(
  'TOTAL NOTAS:',
  bloques.length
);

const contador = {};

bloques.forEach((nota) => {

  const valor = nota[campo];

  if (
    valor !== null &&
    Number(valor) < 6
  ) {

    const alumnoId = nota.alumno_id;

    if (!contador[alumnoId]) {

      contador[alumnoId] = {
        alumno_id: alumnoId,
        apellido: nota.alumnos?.apellido || '',
        nombre: nota.alumnos?.nombre || '',
        curso_id: nota.alumnos?.curso_id || null,
        division_id: nota.alumnos?.division_id || null,
        division_nombre:
          nota.alumnos?.divisiones?.nombre ||
          'Sin división',
        desaprobadas: 0
      };
    }

    contador[alumnoId].desaprobadas++;
  }
});

const resultado = Object.values(contador)
  .filter(
    alumno =>
      alumno.desaprobadas >= Number(minimo)
  )
  .sort(
    (a, b) =>
      b.desaprobadas - a.desaprobadas
  );

return res.status(200).json(resultado);


} catch (error) {


console.error(error);

return res.status(500).json({
  error: error.message
});


}
}
