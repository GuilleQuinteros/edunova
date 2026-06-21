import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  try {

    const {
  periodo = '1T',
  curso = 'todos'
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

    const notas = [];

for (let desde = 0; desde < 10000; desde += 1000) {

  const { data, error } = await supabase
    .from('notas')
    .select(`
      *,
      materias (
        nombre
      ),
      alumnos (
        curso_id
      )
    `)
    .range(desde, desde + 999);

  if (error) {
    throw error;
  }

  notas.push(...data);

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
  notas.length
);

    const resultado = {};

    notas.forEach((nota) => {

        if (
          curso !== 'todos' &&
          Number(nota.alumnos?.curso_id) !==
            Number(curso)
        ) {
          return;
        }

        const valor = nota[campo];

        if (
          valor !== null &&
          Number(valor) < 6
        ) {

          const materia =
            nota.materias?.nombre || 'Sin materia';

          resultado[materia] =
            (resultado[materia] || 0) + 1;
        }
      });

    const ranking = Object.entries(resultado)
      .map(([materia, cantidad]) => ({
        materia,
        cantidad
      }))
      .sort((a, b) => b.cantidad - a.cantidad);

    return res.status(200).json(ranking);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}