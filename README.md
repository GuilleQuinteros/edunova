# EduNova - Plataforma Integral de Gestión Académica

## Descripción

EduNova es una plataforma web desarrollada con Next.js, React y Supabase para la gestión integral de instituciones educativas.

Permite administrar alumnos, cursos, divisiones, materias y calificaciones, generando boletines académicos dinámicos en tiempo real sin necesidad de almacenar archivos PDF previamente generados.

La plataforma incluye un portal para tutores, un panel administrativo y soporte para instalación como aplicación PWA.

---

## Características Principales

### Portal de Tutores

* Consulta de calificaciones mediante DNI del estudiante.
* Visualización del boletín académico en línea.
* Descarga e impresión en formato PDF.
* Adaptado para dispositivos móviles.

### Panel Administrativo

* Gestión de alumnos.
* Gestión de cursos.
* Gestión de divisiones.
* Gestión de materias.
* Carga y edición de calificaciones.
* Historial académico por alumno.
* Promoción de alumnos entre cursos.
* Gestión de usuarios administrativos.

### Importación Masiva

* Importación de alumnos desde archivos Excel (.xlsx) o CSV.
* Vista previa antes de confirmar la carga.
* Validación automática de registros duplicados.

### Boletines Dinámicos

* Boletines trimestrales para ciclo básico.
* Boletines cuatrimestrales para ciclo superior.
* Generación en tiempo real desde la base de datos.
* Impresión optimizada para PDF.

### Institucional

* Personalización de datos institucionales.
* Logo institucional configurable.
* Información de contacto configurable.

### PWA (Progressive Web App)

* Instalación en dispositivos móviles y escritorio.
* Iconos personalizados.
* Experiencia similar a una aplicación nativa.

---

## Tecnologías Utilizadas

### Frontend

* Next.js
* React
* Bootstrap 5

### Backend

* Next.js API Routes

### Base de Datos

* Supabase PostgreSQL

### Almacenamiento

* Supabase Storage

### Autenticación

* JWT
* Cookies HTTP Only

---

## Requisitos

* Node.js 18 o superior
* npm o yarn
* Proyecto Supabase configurado

---

## Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
SUPABASE_URL=TU_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
JWT_SECRET=TU_CLAVE_SECRETA
```

Si se utiliza Supabase desde el frontend:

```env
NEXT_PUBLIC_SUPABASE_URL=TU_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

---

## Instalación

```bash
git clone https://github.com/GuilleQuinteros/edunova.git
cd edunova
npm install
```

---

## Ejecución en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

---

## Estructura General

```text
pages/
 ├── admin/
 ├── api/
 ├── login.js
 ├── index.js
 └── tutores/

components/
lib/
public/
```

---

## Funcionalidades Implementadas

* Gestión de alumnos.
* Gestión de cursos.
* Gestión de divisiones.
* Gestión de materias.
* Registro de usuarios.
* Inicio de sesión administrativo.
* Carga de notas.
* Edición de notas.
* Historial académico.
* Promoción de alumnos.
* Importación masiva desde Excel.
* Portal de consulta para tutores.
* Boletines dinámicos.
* Impresión PDF.
* Configuración institucional.
* PWA.

---

## Desarrollado por

Net-Ing Soluciones IT

Proyecto EduNova - Plataforma Integral de Gestión Académica.
