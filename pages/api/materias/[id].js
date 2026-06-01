// pages/api/materias/[id].js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Verificar si hay notas asociadas a esta materia
      const { data: notas, error: errorNotas } = await supabase
        .from('notas')
        .select('id')
        .eq('materia_division_id', id);

      if (errorNotas) {
        console.error('Error al verificar notas:', errorNotas);
        return res.status(500).json({ error: 'Error al verificar notas asociadas' });
      }

      // Si hay notas asociadas, no permitir borrar
      if (notas.length > 0) {
        return res.status(400).json({ error: 'No se puede eliminar la materia porque tiene notas registradas.' });
      }

      // Si no hay notas, proceder con la eliminación
      const { error: errorBorrar } = await supabase
        .from('materias')
        .delete()
        .eq('id', id);

      if (errorBorrar) {
        console.error('Error al eliminar materia:', errorBorrar);
        return res.status(500).json({ error: 'Error al eliminar la materia' });
      }

      return res.status(200).json({ message: 'Materia eliminada correctamente' });
    } catch (err) {
      console.error('Error inesperado:', err);
      return res.status(500).json({ error: 'Error inesperado en el servidor' });
    }
  }

  // Método no permitido
  res.status(405).json({ error: 'Método no permitido' });
}
