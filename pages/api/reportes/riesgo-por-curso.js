import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  try {

    const minimo = Number(req.query.minimo || 4);
    const periodo = (req.query.periodo || '1t').toLowerCase();

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

      case 'dic':
        campoNota = 'nota_diciembre';
        break;

      case 'feb':
        campoNota = 'nota_febrero';
        break;

      case 'mar':
        campoNota = 'nota_marzo';
        break;

      case 'final':
        campoNota = 'nota_final';
        break;

      default:
        campoNota = 'nota_1t';
    }

    const bloques = [];

    for (let desde = 0; desde < 10000; desde += 1000) {

      const { data, error } = await supabase
        .from('notas')
        .select(`
          alumno_id,
          ${campoNota},
          alumnos (
            curso_id
          )
        `)
        .range(desde, desde + 999);

      if (error) throw error;

      bloques.push(...data);

      if (data.length < 1000) {
        break;
      }
    }

    const contadorAlumnos = {};

    bloques.forEach((nota) => {

      const alumnoId = nota.alumno_id;

      if (!contadorAlumnos[alumnoId]) {

        contadorAlumnos[alumnoId] = {
          curso_id: nota.alumnos?.curso_id,
          desaprobadas: 0
        };
      }

      const valor = nota[campoNota];

      if (
        valor !== null &&
        Number(valor) < 6
      ) {
        contadorAlumnos[alumnoId].desaprobadas++;
      }
    });

    const riesgoPorCurso = {};
    const totalPorCurso = {};

    Object.values(contadorAlumnos).forEach((alumno) => {

      const curso = alumno.curso_id;

      if (!curso) return;

      totalPorCurso[curso] =
        (totalPorCurso[curso] || 0) + 1;

      if (alumno.desaprobadas >= minimo) {

        riesgoPorCurso[curso] =
          (riesgoPorCurso[curso] || 0) + 1;
      }
    });

    const nombresCursos = {
      1: '1° Año',
      2: '2° Año',
      3: '3° Año',
      4: '4° Año',
      5: '5° Año',
      6: '6° Año',
      7: '7° Año'
    };

    const resultado = Object.entries(totalPorCurso)
      .map(([curso, total]) => {

        const riesgo =
          riesgoPorCurso[curso] || 0;

        return {

          curso_id: Number(curso),

          curso: nombresCursos[curso] || curso,

          total_alumnos: total,

          alumnos_riesgo: riesgo,

          porcentaje:
            total > 0
              ? Number(
                  ((riesgo / total) * 100)
                    .toFixed(1)
                )
              : 0
        };
      })
      .sort((a, b) => b.porcentaje - a.porcentaje);

    return res.status(200).json(resultado);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}