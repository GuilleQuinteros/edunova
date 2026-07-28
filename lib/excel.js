import * as XLSX from 'xlsx';

function excelDateToISO(valor) {

  if (!valor) return null;

  // Fecha serial de Excel
  if (typeof valor === 'number') {

    const fecha = XLSX.SSF.parse_date_code(valor);

    if (!fecha) return null;

    return `${fecha.y}-${String(fecha.m).padStart(2,'0')}-${String(fecha.d).padStart(2,'0')}`;
  }

  // Fecha en formato dd/mm/yyyy
  if (typeof valor === 'string') {

    const partes = valor.split('/');

    if (partes.length === 3) {

      const [dia, mes, anio] = partes;

      return `${anio}-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}`;
    }

    // Si ya viene yyyy-mm-dd la deja igual
    return valor;
  }

  return null;
}

export const leerExcel = async (archivo) => {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = (e) => {

      try {

        const workbook = XLSX.read(e.target.result, {
          type: 'binary'
        });

        const hoja =
          workbook.Sheets[workbook.SheetNames[0]];

        const filas =
          XLSX.utils.sheet_to_json(hoja);

        const normalizadas = filas.map(fila => ({

          ...fila,

          fecha_nac: excelDateToISO(
            fila.fecha_nac
          )

        }));

        resolve(normalizadas);

      } catch (error) {

        reject(error);

      }

    };

    reader.onerror = reject;

    reader.readAsBinaryString(archivo);

  });

};