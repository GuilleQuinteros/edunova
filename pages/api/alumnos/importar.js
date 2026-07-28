import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {

    const {
      alumnos,
      curso_id,
      division_id
    } = req.body;

    if (!alumnos?.length) {
      return res.status(400).json({
        error: 'No se recibieron alumnos'
      });
    }

    // Buscar DNIs ya existentes

    const dnis = alumnos.map(a => String(a.dni));

    const { data: existentes } = await supabase
      .from('alumnos')
      .select('dni')
      .in('dni', dnis);

    const dnisExistentes =
      existentes?.map(x => String(x.dni)) || [];

    const nuevos = alumnos.filter(
      a => !dnisExistentes.includes(String(a.dni))
    );

    if (nuevos.length === 0) {
      return res.status(400).json({
        error: 'Todos los alumnos ya existen'
      });
    }

    const alumnosInsertar = nuevos.map(a => ({
      dni: a.dni,
      apellido: a.apellido,
      nombre: a.nombre,

      curso_id,
      division_id,

      activo: true,

      anio_ingreso:
        a.anio_ingreso || new Date().getFullYear(),

      fecha_nac:
        a.fecha_nac
          ? String(a.fecha_nac)
          : null,

      telefono:
        a.telefono || null,

      domicilio:
        a.domicilio || null,

      tutor:
        a.tutor || null,

      localidad:
        a.localidad || null
    }));
    
      const errores = [];
      let importados = 0;

      for (const alumno of alumnosInsertar) {

        const { error } = await supabase
          .from('alumnos')
          .insert(alumno);

        if (error) {

          console.error(error);

          errores.push({
            alumno: `${alumno.apellido}, ${alumno.nombre}`,
            dni: alumno.dni,
            error: error.message
          });

        } else {

          importados++;

        }

      }

      return res.status(200).json({
        total: alumnos.length,
        importados,
        duplicados: dnisExistentes.length,
        errores
      });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Error interno'
    });

  }
}