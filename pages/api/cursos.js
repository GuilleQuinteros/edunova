import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  try {

    // =====================
    // GET
    // =====================

    if (req.method === 'GET') {

      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .order('id');

      if (error) throw error;

      return res.status(200).json(data);

    }

    // =====================
    // POST
    // =====================

    if (req.method === 'POST') {

      const { nombre, es_trimestral } = req.body;

      if (!nombre || typeof es_trimestral !== 'boolean') {

        return res.status(400).json({
          error: 'Datos incompletos o inválidos'
        });

      }

      const { data, error } = await supabase
        .from('cursos')
        .insert([
          {
            nombre,
            es_trimestral
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json(data);

    }

    return res.status(405).json({
      error: 'Método no permitido'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });

  }

}