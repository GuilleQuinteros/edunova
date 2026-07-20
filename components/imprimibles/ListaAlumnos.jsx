import { useEffect, useState } from "react";

export default function ListaAlumnos() {

  const [cursos, setCursos] = useState([]);
  const [divisiones, setDivisiones] = useState([]);

  const [curso, setCurso] = useState("");
  const [division, setDivision] = useState("");

  const [vistaPrevia, setVistaPrevia] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarCursos();
  }, []);

  useEffect(() => {

    if (!curso) {

      setDivisiones([]);
      setDivision("");

      return;

    }

    cargarDivisiones();

  }, [curso]);

  async function cargarCursos() {

    const res = await fetch("/api/cursos");

    const data = await res.json();

    setCursos(data);

  }

  async function cargarDivisiones() {

    const res = await fetch(
      `/api/divisiones?curso_id=${curso}`
    );

    const data = await res.json();

    setDivisiones(data);

    setDivision("");

  }

  async function cargarVistaPrevia() {

    if (!curso || !division) {

      alert("Seleccione curso y división.");

      return;

    }

    setLoading(true);

    try {

      const res = await fetch(

        `/api/imprimibles/alumnos?curso_id=${curso}&division_id=${division}`

      );

      const data = await res.json();

      setVistaPrevia(data);

    }

    catch (e) {

      console.error(e);

      alert("No fue posible obtener la información.");

    }

    finally {

      setLoading(false);

    }

  }

  function descargarPDF() {

    if (!curso || !division) {

      alert("Seleccione curso y división.");

      return;

    }

    window.open(

      `/api/imprimibles/alumnos-pdf?curso_id=${curso}&division_id=${division}`,

      "_blank"

    );

  }

  return (

    <div className="card shadow">

      <div className="card-body">

        <h4 className="mb-4">

          Lista Oficial de Alumnos

        </h4>

        <div className="row g-3">

          <div className="col-md-3">

            <label className="form-label">

              Curso

            </label>

            <select

              className="form-select"

              value={curso}

              onChange={(e) => setCurso(e.target.value)}

            >

              <option value="">

                Seleccione...

              </option>

              {cursos.map((c) => (

                <option

                  key={c.id}

                  value={c.id}

                >

                  {c.nombre}

                </option>

              ))}

            </select>

          </div>

          <div className="col-md-3">

            <label className="form-label">

              División

            </label>

            <select

              className="form-select"

              value={division}

              onChange={(e) => setDivision(e.target.value)}

            >

              <option value="">

                Seleccione...

              </option>

              {divisiones.map((d) => (

                <option

                  key={d.id}

                  value={d.id}

                >

                  {d.nombre}

                </option>

              ))}

            </select>

          </div>

          <div className="col-md-3 d-flex align-items-end">

            <button

              className="btn btn-primary w-100"

              onClick={cargarVistaPrevia}

            >

              Vista previa

            </button>

          </div>

          <div className="col-md-3 d-flex align-items-end">

            <button

              className="btn btn-success w-100"

              onClick={descargarPDF}

            >

              Descargar PDF

            </button>

          </div>

        </div>

        {loading && (

          <div className="text-center mt-5">

            <div className="spinner-border text-primary"></div>

            <p className="mt-3">

              Generando vista previa...

            </p>

          </div>

        )}

        {!loading && vistaPrevia && (

          <>

            <hr className="my-4"/>

            <div className="text-center">

              <h3>

                LISTA OFICIAL DE ALUMNOS

              </h3>

              <h5>

                {vistaPrevia.curso} - División {vistaPrevia.division}

              </h5>

              <p>

                Cantidad de alumnos:{" "}

                <strong>

                  {vistaPrevia.cantidad_alumnos}

                </strong>

              </p>

            </div>

            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle">

                <thead className="table-primary">

                  <tr>

                    <th>N°</th>

                    <th>Apellido</th>

                    <th>Nombre</th>

                    <th>DNI</th>

                    <th>Fecha Nac.</th>

                    <th>Teléfono</th>

                    <th>Domicilio</th>

                    <th>Tutor</th>

                    <th>Localidad</th>

                  </tr>

                </thead>

                <tbody>

                  {vistaPrevia.alumnos.map((a) => (

                    <tr key={a.id}>

                      <td>{a.numero}</td>

                      <td>{a.apellido}</td>

                      <td>{a.nombre}</td>

                      <td>{a.dni}</td>

                      <td>{a.fecha_nac}</td>

                      <td>{a.telefono}</td>

                      <td>{a.domicilio}</td>

                      <td>{a.tutor}</td>

                      <td>{a.localidad}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </>

        )}

      </div>

    </div>

  );

}
