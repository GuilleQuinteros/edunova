export function obtenerDivisionCompleta(nombre) {
  const divisiones = {
    TA: 'Tecnología de los Alimentos',
    AYS: 'Ambiente y Salud',
    MMO: 'Maestro Mayor de Obras',
  };

  return divisiones[nombre] || nombre;
}