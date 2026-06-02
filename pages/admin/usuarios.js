import { useEffect, useState } from 'react';
import Protegido from '@/components/Protegido';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
    const [usuarioEditando, setUsuarioEditando] = useState(null);

    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('editor');
    const [activo, setActivo] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();

      setUsuarios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="container mt-4">
        Cargando usuarios...
      </div>
    );
  }

  const desactivarUsuario = async (id) => {

  const confirmar = confirm(
    '¿Desea desactivar este usuario?'
  );

  if (!confirmar) return;

  try {

    const res = await fetch(
      `/api/usuarios/${id}`,
      {
        method: 'DELETE'
      }
    );

    const data = await res.json();

    alert(data.mensaje);

    cargarUsuarios();

  } catch (error) {

    console.error(error);

    alert('Error al desactivar');
  }
};

const editarUsuario = (usuario) => {

  setUsuarioEditando(usuario);

  setEmail(usuario.email);
  setRol(usuario.rol);
  setActivo(usuario.activo);
};

const guardarCambios = async () => {

  const res = await fetch(
    `/api/usuarios/${usuarioEditando.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        rol,
        activo
      })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  alert('Usuario actualizado');

  setUsuarioEditando(null);

  cargarUsuarios();
};
  return (
     <Protegido rolesPermitidos={['admin']}>
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>

        <a
          href="/admin/registrar-usuario"
          className="btn btn-primary"
        >
          + Nuevo Usuario
        </a>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">

          <thead className="table-light">
            <tr>
              <th>Email</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Creado</th>
              <th width="180">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>

                <td>{usuario.email}</td>

                <td>
                  <span className="badge bg-primary">
                    {usuario.rol}
                  </span>
                </td>

                <td>
                    {usuario.activo ? (
                        <span className="badge bg-success">
                        Activo
                        </span>
                    ) : (
                        <span className="badge bg-danger">
                        Inactivo
                        </span>
                    )}
                    </td>

                <td>
                  {new Date(usuario.creado_en)
                    .toLocaleDateString('es-AR')}
                </td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editarUsuario(usuario)}
                    >
                    Editar
                    </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => desactivarUsuario(usuario.id)}
                    >
                    Desactivar
                    </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    {usuarioEditando && (
  <>
    <div
      className="modal fade show"
      style={{
        display: 'block',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              Editar Usuario
            </h5>

            <button
              className="btn-close"
              onClick={() => setUsuarioEditando(null)}
            />
          </div>

          <div className="modal-body">

            <div className="mb-3">
              <label>Email</label>

              <input
                className="form-control"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label>Rol</label>

              <select
                className="form-select"
                value={rol}
                onChange={(e) =>
                  setRol(e.target.value)
                }
              >
                <option value="admin">
                  Admin
                </option>

                <option value="editor">
                  Editor
                </option>

                <option value="alumnado">
                  Alumnado
                </option>

                <option value="preceptor">
                  Preceptor
                </option>

              </select>
            </div>

            <div className="mb-3">
              <label>Estado</label>

              <select
                className="form-select"
                value={activo ? 'true' : 'false'}
                onChange={(e) =>
                  setActivo(
                    e.target.value === 'true'
                  )
                }
              >
                <option value="true">
                  Activo
                </option>

                <option value="false">
                  Inactivo
                </option>
              </select>
            </div>

          </div>

          <div className="modal-footer">

            <button
              className="btn btn-secondary"
              onClick={() =>
                setUsuarioEditando(null)
              }
            >
              Cancelar
            </button>

            <button
              className="btn btn-primary"
              onClick={guardarCambios}
            >
              Guardar
            </button>

          </div>

        </div>
      </div>
    </div>
  </>
)}
    </div>
    </Protegido>
  );
}