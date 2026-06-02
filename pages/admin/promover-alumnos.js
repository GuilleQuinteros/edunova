import Protegido from "@/components/Protegido";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function PromoverAlumnos() {
  const [cursos, setCursos] = useState([]);
  const [cursoOrigen, setCursoOrigen] = useState("");
  const [divisiones, setDivisiones] = useState([]);
  const [divisionOrigen, setDivisionOrigen] = useState("");
  const [alumnos, setAlumnos] = useState([]);

  // Para selección manual
  const [seleccionados, setSeleccionados] = useState([]);
  const [cursoDestino, setCursoDestino] = useState("");
  const [divisionesDestino, setDivisionesDestino] = useState([]);
  const [divisionDestino, setDivisionDestino] = useState("");

  // Para promoción automática
  const [previsualizacion, setPrevisualizacion] = useState(null);
  const [mostrarModalPrevio, setMostrarModalPrevio] = useState(false);

  // ===========================
  // Cargar cursos
  // ===========================
  useEffect(() => {
    fetch("/api/cursos")
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch((err) => console.error("Error al obtener cursos:", err));
  }, []);

  // ===========================
  // Cargar divisiones del curso seleccionado
  // ===========================
  useEffect(() => {
    if (cursoOrigen) {
      fetch(`/api/divisiones?curso_id=${cursoOrigen}`)
        .then((res) => res.json())
        .then((data) => setDivisiones(data))
        .catch((err) => console.error("Error al obtener divisiones:", err));
      setSeleccionados([]); // limpia los seleccionados al cambiar curso
    } else {
      setDivisiones([]);
      setAlumnos([]);
    }
  }, [cursoOrigen]);

  // ===========================
  // Cargar divisiones destino
  // ===========================
  useEffect(() => {
    if (cursoDestino) {
      fetch(`/api/divisiones?curso_id=${cursoDestino}`)
        .then((res) => res.json())
        .then((data) => setDivisionesDestino(data))
        .catch((err) => console.error("Error al obtener divisiones destino:", err));
    } else {
      setDivisionesDestino([]);
    }
  }, [cursoDestino]);

  // ===========================
  // Cargar alumnos de la división origen
  // ===========================
  const cargarAlumnos = async () => {
    if (!divisionOrigen) return;
    const res = await fetch(`/api/alumnos/por-division?division_id=${divisionOrigen}`);
    const data = await res.json();
    setAlumnos(data);
    setSeleccionados([]); // limpia al cambiar división
  };

  useEffect(() => {
    if (divisionOrigen) cargarAlumnos();
  }, [divisionOrigen]);

  // ===========================
  // Selección manual
  // ===========================
  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // ===========================
  // Promoción manual
  // ===========================
  const handlePromocionManual = async () => {
    if (!seleccionados.length) {
      alert("Seleccioná al menos un alumno para promover");
      return;
    }
    if (!cursoDestino || !divisionDestino) {
      alert("Seleccioná el curso y la división destino");
      return;
    }

    if (!confirm("¿Mover los alumnos seleccionados al nuevo curso/división?")) return;

    const updates = seleccionados.map(async (id) => {
      await fetch(`/api/alumnos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          curso_id: cursoDestino,
          division_id: divisionDestino,
        }),
      });
    });

    await Promise.all(updates);
    alert("Alumnos promovidos correctamente");
    cargarAlumnos();
    setSeleccionados([]);
  };

  // ===========================
  // Previsualización automática
  // ===========================
  const handlePrevisualizacion = async () => {
    if (!cursoOrigen || !divisionOrigen) {
      alert("Seleccioná curso y división de origen");
      return;
    }

    const res = await fetch("/api/alumnos/promocion-previa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        curso_origen_id: cursoOrigen,
        division_origen_id: divisionOrigen,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setPrevisualizacion(data);
      setMostrarModalPrevio(true);
    } else {
      alert(data.error || "Error al generar previsualización");
    }
  };

  // ===========================
  // Confirmar promoción automática
  // ===========================
  const handlePromocionAutomatica = async () => {
    if (!cursoOrigen || !divisionOrigen) {
      alert("Seleccioná curso y división de origen");
      return;
    }

    if (!confirm("¿Confirmar promoción automática según notas finales?")) return;

    const res = await fetch("/api/alumnos/promocion-automatica", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        curso_origen_id: cursoOrigen,
        division_origen_id: divisionOrigen,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.mensaje);
      setMostrarModalPrevio(false);
      cargarAlumnos();
    } else {
      alert(data.error || "Error al ejecutar promoción automática");
    }
  };

  // ===========================
  // Render
  // ===========================
  return (
    <Protegido rolesPermitidos={['admin']}>
      <div className="container mt-5" style={{ maxWidth: "900px" }}>
        <h3 className="mb-4 text-center">Promover Alumnos</h3>

        {/* Curso y división origen */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Curso de Origen</label>
            <select
              className="form-select"
              value={cursoOrigen}
              onChange={(e) => setCursoOrigen(e.target.value)}
            >
              <option value="">Seleccionar curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">División de Origen</label>
            <select
              className="form-select"
              value={divisionOrigen}
              onChange={(e) => setDivisionOrigen(e.target.value)}
            >
              <option value="">Seleccionar división</option>
              {divisiones.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla de alumnos */}
        <h5 className="mt-4">Alumnos en esta división</h5>
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th></th>
              <th>Apellido</th>
              <th>Nombre</th>
              <th>DNI</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.length > 0 ? (
              alumnos.map((a) => (
                <tr key={a.id}>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(a.id)}
                      onChange={() => toggleSeleccion(a.id)}
                    />
                  </td>
                  <td>{a.apellido}</td>
                  <td>{a.nombre}</td>
                  <td>{a.dni}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No hay alumnos cargados
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Curso y división destino */}
        <h5 className="mt-4">Destino de promoción (manual)</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Curso destino</label>
            <select
              className="form-select"
              value={cursoDestino}
              onChange={(e) => setCursoDestino(e.target.value)}
            >
              <option value="">Seleccionar curso destino</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">División destino</label>
            <select
              className="form-select"
              value={divisionDestino}
              onChange={(e) => setDivisionDestino(e.target.value)}
            >
              <option value="">Seleccionar división destino</option>
              {divisionesDestino.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button variant="success" className="w-100" onClick={handlePromocionManual}>
          🧩 Promover Alumnos Seleccionados
        </Button>

        <hr className="my-4" />

        {/* Botones de promoción automática */}
        <div className="d-flex gap-3">
          <Button variant="info" className="w-50" onClick={handlePrevisualizacion}>
            🔍 Previsualizar Promoción Automática
          </Button>
          <Button variant="warning" className="w-50" onClick={handlePromocionAutomatica}>
            🚀 Promoción Automática Directa
          </Button>
        </div>

        {/* Modal de previsualización */}
        <Modal show={mostrarModalPrevio} onHide={() => setMostrarModalPrevio(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Previsualización de Promoción</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {previsualizacion && (
              <>
                <p>
                  <strong>Promueven:</strong> {previsualizacion.resumen.promueve} |{" "}
                  <strong>Revisión:</strong> {previsualizacion.resumen.revisar} |{" "}
                  <strong>Sin datos:</strong> {previsualizacion.resumen.sin_datos}
                </p>
                <table className="table table-bordered table-sm">
                  <thead>
                    <tr>
                      <th>Apellido</th>
                      <th>Nombre</th>
                      <th>DNI</th>
                      <th>Total Materias</th>
                      <th>Desaprobadas</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previsualizacion.detalle.map((a) => (
                      <tr
                        key={a.id}
                        className={
                          a.estado === "promueve"
                            ? "table-success"
                            : a.estado === "revisar"
                            ? "table-warning"
                            : "table-secondary"
                        }
                      >
                        <td>{a.apellido}</td>
                        <td>{a.nombre}</td>
                        <td>{a.dni}</td>
                        <td>{a.total}</td>
                        <td>{a.desaprobadas}</td>
                        <td>
                          {a.estado === "promueve"
                            ? "✅ Promueve"
                            : a.estado === "revisar"
                            ? "⚠️ Revisar"
                            : "⛔ Sin datos"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModalPrevio(false)}>
              Cerrar
            </Button>
            <Button variant="success" onClick={handlePromocionAutomatica}>
              Confirmar Promoción Automática
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Protegido>
  );
}
