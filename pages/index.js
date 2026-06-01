import Link from 'next/link';

export default function Home() {
  return (
    <div className="container py-4">

      <div className="text-center mb-5">
        <img
          src="/images/edunova-logo.png"
          alt="EduNova"
          style={{ maxWidth: '120px' }}
        />

        <h1 className="mt-3 fw-bold">
          EduNova
        </h1>

        <p className="text-muted">
          Plataforma Integral de Gestión Académica
        </p>
      </div>

      <div className="row g-4">

        <div className="col-12">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">

              <h3>📘</h3>

              <h4>Consultar Calificaciones</h4>

              <p>
                Consulta boletines y calificaciones
                ingresando el DNI del estudiante.
              </p>

              <Link
                href="/tutores"
                className="btn btn-primary w-100"
              >
                Consultar
              </Link>

            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">

              <h3>🔐</h3>

              <h4>Acceso Administrativo</h4>

              <p>
                Ingreso exclusivo para personal autorizado.
              </p>

              <Link
                href="/login"
                className="btn btn-dark w-100"
              >
                Ingresar
              </Link>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}