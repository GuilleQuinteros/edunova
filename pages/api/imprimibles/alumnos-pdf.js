import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function capitalizar(texto) {
  if (!texto) return '';

  return String(texto)
    .toLowerCase()
    .replace(/\b\w/g, letra => letra.toUpperCase());
}

function formatearFecha(fecha) {
  if (!fecha) return '';

  const partes = String(fecha).split('-');

  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return fecha;
}

function textoSeguro(texto) {
  if (texto === null || texto === undefined) {
    return '';
  }

  return String(texto);
}

export default async function handler(req, res) {

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {

    const { curso_id, division_id } = req.query;

    if (!curso_id || !division_id) {
      return res.status(400).json({
        error: 'Debe seleccionar un curso y una división.'
      });
    }

    // ==========================================
    // CURSO
    // ==========================================

    const { data: curso, error: errorCurso } = await supabase
      .from('cursos')
      .select('id, nombre')
      .eq('id', curso_id)
      .single();

    if (errorCurso) {
      throw errorCurso;
    }

    // ==========================================
    // DIVISIÓN
    // ==========================================

    const { data: division, error: errorDivision } = await supabase
      .from('divisiones')
      .select('id, nombre')
      .eq('id', division_id)
      .single();

    if (errorDivision) {
      throw errorDivision;
    }

    // ==========================================
    // ALUMNOS
    // ==========================================

    const { data: alumnos, error: errorAlumnos } = await supabase
      .from('alumnos')
      .select(`
        id,
        dni,
        apellido,
        nombre,
        activo,
        anio_ingreso,
        fecha_nac,
        telefono,
        domicilio,
        tutor,
        localidad
      `)
      .eq('curso_id', curso_id)
      .eq('division_id', division_id)
      .order('apellido')
      .order('nombre');

    if (errorAlumnos) {
      throw errorAlumnos;
    }

    // ==========================================
    // CONFIGURACIÓN DEL PDF
    // ==========================================

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: {
        top: 40,
        bottom: 40,
        left: 35,
        right: 35
      },
      bufferPages: true
    });

    // ==========================================
    // HEADERS HTTP
    // ==========================================

    const nombreCurso = textoSeguro(curso.nombre);
    const nombreDivision = textoSeguro(division.nombre);

    const nombreArchivo =
      `lista-alumnos-${nombreCurso}-${nombreDivision}`
        .replace(/[°\/\\:*?"<>|]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader(
      'Content-Disposition',
      `inline; filename="${nombreArchivo}.pdf"`
    );

    // ==========================================
    // ENVIAR PDF
    // ==========================================

    doc.pipe(res);

    // ==========================================
    // DIMENSIONES
    // ==========================================

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const margenIzquierdo = 35;
    const margenDerecho = 35;

    const anchoUtil =
      pageWidth - margenIzquierdo - margenDerecho;

    // ==========================================
    // FUNCIÓN ENCABEZADO
    // ==========================================

    function dibujarEncabezado() {

      let y = 35;

      // Institución
      doc
        .font('Helvetica-Bold')
        .fontSize(15)
        .text(
          'INSTITUCIÓN EDUCATIVA',
          margenIzquierdo,
          y,
          {
            width: anchoUtil,
            align: 'center'
          }
        );

      y += 22;

      // Título
      doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .text(
          'LISTA OFICIAL DE ALUMNOS',
          margenIzquierdo,
          y,
          {
            width: anchoUtil,
            align: 'center'
          }
        );

      y += 28;

      // Curso / división
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(
          `Curso: ${nombreCurso}     División: ${nombreDivision}`,
          margenIzquierdo,
          y,
          {
            width: anchoUtil,
            align: 'center'
          }
        );

      y += 20;

      // Ciclo
      doc
        .font('Helvetica')
        .fontSize(9)
        .text(
          'Ciclo lectivo: 2026',
          margenIzquierdo,
          y,
          {
            width: anchoUtil,
            align: 'center'
          }
        );

      y += 25;

      // Línea
      doc
        .moveTo(margenIzquierdo, y)
        .lineTo(pageWidth - margenDerecho, y)
        .stroke();

      y += 12;

      return y;
    }

    // ==========================================
    // TABLA
    // ==========================================

    const columnas = [
      {
        titulo: 'N°',
        ancho: 28,
        align: 'center'
      },
      {
        titulo: 'Apellido',
        ancho: 95
      },
      {
        titulo: 'Nombre',
        ancho: 115
      },
      {
        titulo: 'DNI',
        ancho: 65,
        align: 'center'
      },
      {
        titulo: 'Fecha nac.',
        ancho: 65,
        align: 'center'
      },
      {
        titulo: 'Teléfono',
        ancho: 75
      },
      {
        titulo: 'Domicilio',
        ancho: 130
      },
      {
        titulo: 'Tutor',
        ancho: 130
      },
      {
        titulo: 'Localidad',
        ancho: 75
      }
    ];

    const alturaCabecera = 22;
    const alturaFila = 23;

    function dibujarCabeceraTabla(y) {

      let x = margenIzquierdo;

      doc
        .font('Helvetica-Bold')
        .fontSize(7);

      columnas.forEach(col => {

        doc
          .rect(x, y, col.ancho, alturaCabecera)
          .fillAndStroke('#E9ECEF', '#000000');

        doc
          .fillColor('#000000')
          .text(
            col.titulo,
            x + 3,
            y + 7,
            {
              width: col.ancho - 6,
              align: col.align || 'left',
              lineBreak: false
            }
          );

        x += col.ancho;

      });

      return y + alturaCabecera;
    }

    function dibujarFila(alumno, numero, y) {

      let x = margenIzquierdo;

      const valores = [
        numero,
        capitalizar(alumno.apellido),
        capitalizar(alumno.nombre),
        alumno.dni,
        formatearFecha(alumno.fecha_nac),
        alumno.telefono,
        capitalizar(alumno.domicilio),
        capitalizar(alumno.tutor),
        capitalizar(alumno.localidad)
      ];

      doc
        .font('Helvetica')
        .fontSize(7);

      columnas.forEach((col, index) => {

        const valor = textoSeguro(valores[index]);

        doc
          .rect(
            x,
            y,
            col.ancho,
            alturaFila
          )
          .stroke();

        doc.text(
          valor,
          x + 3,
          y + 7,
          {
            width: col.ancho - 6,
            align: col.align || 'left',
            lineBreak: false,
            ellipsis: true
          }
        );

        x += col.ancho;

      });

      return y + alturaFila;
    }

    // ==========================================
    // PRIMERA PÁGINA
    // ==========================================

    let y = dibujarEncabezado();

    y = dibujarCabeceraTabla(y);

    // ==========================================
    // ALUMNOS
    // ==========================================

    alumnos.forEach((alumno, index) => {

      // Si no entra la fila, nueva página
      if (y + alturaFila > pageHeight - 45) {

        doc.addPage();

        y = dibujarEncabezado();

        y = dibujarCabeceraTabla(y);

      }

      y = dibujarFila(
        alumno,
        index + 1,
        y
      );

    });

    // ==========================================
    // PIE DE PÁGINA
    // ==========================================

    const paginas = doc.bufferedPageRange();

    for (
      let i = 0;
      i < paginas.count;
      i++
    ) {

      doc.switchToPage(paginas.start + i);

      const textoPie =
        `Lista oficial de alumnos - ${nombreCurso} - División ${nombreDivision}`;

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor('#555555')
        .text(
          textoPie,
          margenIzquierdo,
          pageHeight - 30,
          {
            width: anchoUtil - 80,
            align: 'left'
          }
        );

      doc
        .text(
          `Página ${i + 1} de ${paginas.count}`,
          pageWidth - margenDerecho - 80,
          pageHeight - 30,
          {
            width: 80,
            align: 'right'
          }
        );

    }

    // ==========================================
    // FINALIZAR
    // ==========================================

    doc.end();

  } catch (error) {

    console.error(
      'Error generando PDF de alumnos:',
      error
    );

    if (!res.headersSent) {

      return res.status(500).json({
        error: 'No fue posible generar el PDF.'
      });

    }

  }

}