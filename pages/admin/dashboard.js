// pages/admin/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  
  // Asegurar autenticación antes de mostrar el dashboard
  useEffect(() => {
  const usuarioStr = localStorage.getItem('usuario');

  if (!usuarioStr) {
    router.push('/login');
    return;
  }

  const usuarioData = JSON.parse(usuarioStr);

  setUsuario(usuarioData);
}, []);

 const accesosAdmin = [
    {
      titulo: 'Cargar Alumnos',
      icono: '/icons/alumnos.png',
      link: '/admin/cargar-alumno',
    },
    {
      titulo: 'Ver Alumnos',
      icono: '/icons/alumnos.png',
      link: '/admin/ver-alumnos',
    },
    {
      titulo: 'Cargar Materias',
      icono: '/icons/materias.png',
      link: '/admin/cargar-materia',
    },
    {
      titulo: 'Cargar Cursos',
      icono: '/icons/cursos.png',
      link: '/admin/cargar-curso',
    },
    {
      titulo: 'Ver Cursos',
      icono: '/icons/cursos.png',
      link: '/admin/ver-cursos',
    },
    {
      titulo: 'Cargar Divisiones',
      icono: '/icons/divisiones.png',
      link: '/admin/cargar-division',
    },
    {
      titulo: 'Ver Divisiones',
      icono: '/icons/divisiones.png',
      link: '/admin/ver-divisiones',
    },
    {
      titulo: "Importar Alumnos",
      descripcion: "Carga masiva desde Excel",
      icono: "/icons/importar.png",
      link: "/admin/importar-alumnos"
    },
    {
      titulo: 'Promover Alumnos',
      icono: '/icons/usuario.png',
      link: '/admin/promover-alumnos',
    },
    {
      titulo: 'Usuarios',
      icono: '/icons/usuario.png',
      link: '/admin/usuarios',
    },
    {
      titulo: 'Historial Alumno',
      icono: '/icons/usuario.png',
      link: '/admin/historial-alumno',
    },
    {
      titulo: 'Habilitar Boletines',
      icono: '/icons/boletin.png',
      link: '/admin/configuracion-boletines',
    },
    {
      titulo: 'Salir',
      icono: '/icons/salir.png',
      link: '/login', // se puede mantener, o quitar si redirigís manualmente
      accion: async () => {
        try {
          await fetch('/api/logout', {
            method: 'POST',
          });
          localStorage.removeItem('usuario');
          window.location.href = '/login'; // redirigís manualmente
        } catch (err) {
          console.error('Error al cerrar sesión:', err);
        }
      },
    },

  ];

  // Accesos para el rol Editor
const accesosEditor = [
  {
    titulo: 'Cargar Alumnos',
    icono: '/icons/alumnos.png',
    link: '/admin/cargar-alumno',
  },
  {
    titulo: 'Ver Alumnos',
    icono: '/icons/alumnos.png',
    link: '/admin/ver-alumnos',
  },
  {
    titulo: 'Historial Alumno',
    icono: '/icons/usuario.png',
    link: '/admin/historial-alumno',
  },
  {
    titulo: 'Salir',
    icono: '/icons/salir.png',
    accion: async () => {
      await fetch('/api/logout', {
        method: 'POST',
      });

      localStorage.removeItem('usuario');
      window.location.href = '/login';
    },
  },
];

// Si el usuario es editor verá menos opciones
const accesos =
  usuario?.rol === 'editor'
    ? accesosEditor
    : accesosAdmin;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Panel Administrativo</h2>
      {usuario && (
          <div className="text-center mb-4">
            <strong>{usuario.email}</strong>
            <br />
            <span className="badge bg-secondary">
              {usuario.rol}
            </span>
          </div>
        )}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {accesos.map((item, i) => (
          <div className="col" key={i}>
            <div
              className="card h-100 text-center"
              onClick={() => {
                  console.log(item);

                  if (item.accion) {
                    item.accion();
                    return;
                  }

                  if (item.link) {
                    router.push(item.link);
                  }
                }}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={item.icono}
                className="card-img-top p-4"
                alt={item.titulo}
                style={{ maxHeight: '120px', objectFit: 'contain' }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.titulo}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
