import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>EduNova - Plataforma Integral de Gestión Académica</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="description"
          content="EduNova - Plataforma integral para la gestión académica de instituciones educativas."
        />
        <meta name="theme-color" content="#0d6efd" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Banner superior */}
      <div className="bg-primary text-white py-4 shadow-sm">
        <div className="container d-flex align-items-center">
          <img
            src="/images/logo-edunova.png"
            alt="EduNova"
            style={{ width: '100px', height: '100px' }}
            className="me-3"
          />

          <div>
            <h2 className="mb-0 fw-bold">EduNova</h2>
            <small>Plataforma Académica Inteligente</small>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand">EduNova</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="ms-auto">
            <Link href="/admin/dashboard" className="btn btn-light">
              ← Volver al panel
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container py-5" style={{
              minHeight: '70vh'
            }}
          >
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-light text-center py-3 mt-auto border-top">
        <div className="container">
          <small>
              © {new Date().getFullYear()} EduNova · Desarrollado por Net-Ing Soluciones IT
            </small>
        </div>
      </footer>
    </>
  );
}
