import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import Protegido from "@/components/Protegido";

export default function HistorialAlumno() {
  const [dni, setDni] = useState("");
  const [alumno, setAlumno] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [boletines, setBoletines] = useState([]);
  const [cargando, setCargando] = useState(false);

  const buscarAlumno = async () => {
    setCargando(true);
    setAlumno(null);
    setHistorial([]);
    setBoletines([]);

    const res = await fetch(`/api/alumnos/historial?dni=${dni}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al buscar alumno");
      setCargando(false);
      return;
    }

    setAlumno(data.alumno);
    setHistorial(data.historial);
    setCargando(false);
  };

  const cargarBoletines = async () => {
    const res = await fetch(`/api/alumnos/boletines?dni=${dni}`);
    const data = await res.json();
    if (res.ok) setBoletines(data);
  };

  const descargarHistorialPDF = () => {
    window.open(`/admin/historial-pdf?dni=${dni}`, "_blank");
  };

  return (
    <Protegido>
      <div className="container mt-4">
        <h3>Historial Académico del Alumno</h3>

        <div className="card p-3 mt-3">
          <label>DNI del alumno</label>
          <input
            type="text"
            className="form-control"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
          <Button className="mt-3" onClick={buscarAlumno} disabled={cargando}>
            🔍 Buscar
          </Button>
        </div>

        {/* Datos del alumno */}
        {alumno && (
          <div className="mt-4">
            <h5>Datos del Alumno</h5>
            <p>
              <strong>Nombre: </strong> {alumno.apellido}, {alumno.nombre} <br />
              <strong>DNI: </strong> {alumno.dni}
            </p>

            <h5 className="mt-4">Historial por Curso</h5>

            <Table bordered striped size="sm">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Materia</th>
                  <th>1T</th>
                  <th>2T</th>
                  <th>3T</th>
                  <th>1C</th>
                  <th>2C</th>
                  <th>Final</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((h, i) => (
                  <tr key={i}>
                    <td>{h.curso}</td>
                    <td>{h.materia}</td>
                    <td>{h.nota_1t ?? "-"}</td>
                    <td>{h.nota_2t ?? "-"}</td>
                    <td>{h.nota_3t ?? "-"}</td>
                    <td>{h.nota_1c ?? "-"}</td>
                    <td>{h.nota_2c ?? "-"}</td>
                    <td>{h.nota_final ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Descargar boletines */}
            <Button className="mt-3" variant="info" onClick={cargarBoletines}>
              📂 Ver boletines disponibles
            </Button>

            {boletines.length > 0 && (
              <div className="mt-3">
                <h5>Boletines PDF por Año</h5>

                {boletines.map((c) => (
                  <div
                    key={c.id}
                    className="d-flex justify-content-between align-items-center border p-2 mb-2"
                  >
                    <span>{c.nombre}</span>
                    <Button
                      variant="outline-primary"
                      onClick={() =>
                        window.open(
                          `/tutores/boletin?dni=${dni}&curso_id=${c.id}`,
                          "_blank"
                        )
                      }
                    >
                      Descargar PDF
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* PDF historial completo */}
            <Button className="mt-4 mb-5" variant="success" onClick={descargarHistorialPDF}>
              📄 Descargar historial académico completo (PDF)
            </Button>
            <Button
                className="mt-3 ms-2"
                variant="secondary"
                onClick={() => window.print()}>
                🖨 Imprimir historial
            </Button>

          </div>
        )}
      </div>
    </Protegido>
  );
}
