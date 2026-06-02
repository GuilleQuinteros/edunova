import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  // EDITAR
  if (req.method === 'PUT') {
    const { email, rol, activo } = req.body;
    const rolesPermitidos = [
        'admin',
        'editor',
        'alumnado',
        'preceptor'
        ];

        if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({
            error: 'Rol inválido'
        });
        }
    const { error } = await supabase
      .from('usuarios')
      .update({
        email,
        rol,
        activo
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Error al actualizar usuario'
      });
    }

    return res.status(200).json({
      mensaje: 'Usuario actualizado'
    });
  }

  // ELIMINAR / DESACTIVAR
  if (req.method === 'DELETE') {

    const { error } = await supabase
      .from('usuarios')
      .update({
        activo: false
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Error al desactivar usuario'
      });
    }

    return res.status(200).json({
      mensaje: 'Usuario desactivado'
    });
  }

  return res.status(405).json({
    error: 'Método no permitido'
  });
}