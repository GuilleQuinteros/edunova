import * as XLSX from 'xlsx';

export const leerExcel = async (archivo) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;

        const workbook = XLSX.read(data, {
          type: 'binary'
        });

        const hoja = workbook.Sheets[workbook.SheetNames[0]];

        const filas = XLSX.utils.sheet_to_json(hoja);

        resolve(filas);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;

    reader.readAsBinaryString(archivo);
  });
};