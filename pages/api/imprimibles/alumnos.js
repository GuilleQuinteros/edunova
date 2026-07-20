import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function capitalizar(texto) {

  if (!texto) return '';

  return texto
    .toLowerCase()
    .replace(/\b\w/g, letra => letra.toUpperCase());

}

export default async function handler(req, res) {

  try {

    const { curso_id, division_id } = req.query;

    if (!curso_id || !division_id) {

      return res.status(400).json({
        error: 'Debe seleccionar un curso y una división.'
      });

    }

    //===========================
    // ALUMNOS
    //===========================

    const { data: alumnos, error } = await supabase

      .from('alumnos')

      .select(`
        id,
        dni,
        apellido,
        nombre,
        curso_id,
        division_id,
        activo,
        anio_ingreso,
        fecha_nac,
        telefono,
        domicilio,
        tutor,
        localidad,
        divisiones (
          nombre
        )
      `)

      .eq('curso_id', curso_id)

      .eq('division_id', division_id)

      .order('apellido')

      .order('nombre');

    if (error) throw error;

    //===========================
    // CURSO
    //===========================

    const { data: curso } = await supabase

      .from('cursos')

      .select('año')

      .eq('id', curso_id)

      .single();

    //===========================
    // DIVISION
    //===========================

    const { data: division } = await supabase

      .from('divisiones')

      .select('nombre')

      .eq('id', division_id)

      .single();

    //===========================
    // FORMATEO
    //===========================

    const listado = alumnos.map((a, index) => ({

      numero: index + 1,

      id: a.id,

      dni: a.dni,

      apellido: capitalizar(a.apellido),

      nombre: capitalizar(a.nombre),

      fecha_nac: a.fecha_nac,

      telefono: a.telefono,

      domicilio: capitalizar(a.domicilio),

      localidad: capitalizar(a.localidad),

      tutor: capitalizar(a.tutor),

      activo: a.activo,

      anio_ingreso: a.anio_ingreso,

      curso_id: a.curso_id,

      division_id: a.division_id,

      division: a.divisiones?.nombre ?? ''

    }));

    //===========================
    // RESPUESTA
    //===========================

    return res.status(200).json({

      curso_id: Number(curso_id),

      curso: `${curso?.año}° Año`,

      division_id: Number(division_id),

      division: division?.nombre ?? '',

      cantidad_alumnos: listado.length,

      fecha_generacion: new Date(),

      alumnos: listado

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      error: error.message

    });

  }

}
