import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegistroForm from "./components/RegistroForm";
import Dashboard from "./components/Dashboard";
import ArchivoManager from "./components/ArchivoManager";
import AuditoriaViewer from "./components/AuditoriaViewer";
import SistemaMonitor from "./components/SistemaMonitor";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [vistaActual, setVistaActual] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  // Recuperar sesión del localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUsuario(savedUser);
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (nombreUsuario, userToken) => {
    setUsuario(nombreUsuario);
    setToken(userToken);
    localStorage.setItem("usuario", nombreUsuario);
    localStorage.setItem("token", userToken);
    setVistaActual("dashboard");
  };

  const handleLogout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setVistaActual("dashboard");
  };

  if (!usuario) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="#667eea" opacity="0.2"/>
                <circle cx="25" cy="25" r="15" fill="#667eea" opacity="0.4"/>
                <circle cx="25" cy="25" r="10" fill="#667eea"/>
              </svg>
            </div>
            <h1>Sistema Distribuido</h1>
            <p className="subtitle">Gestión de Usuarios, Archivos y Auditoría</p>
          </div>

          <div className="login-tabs">
            <LoginForm onLogin={handleLogin} />
            <div className="divider">
              <span>o</span>
            </div>
            <RegistroForm />
          </div>

          <div className="login-footer">
            <p>🔐 Sistema seguro con JWT + AES</p>
            <p>⚖️ Balanceo de carga automático</p>
            <p>🛡️ Tolerancia a fallos integrada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-small">
            <svg width="40" height="40" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="#667eea" opacity="0.2"/>
              <circle cx="25" cy="25" r="15" fill="#667eea" opacity="0.4"/>
              <circle cx="25" cy="25" r="10" fill="#667eea"/>
            </svg>
          </div>
          <h2>Sistema</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${vistaActual === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setVistaActual('dashboard'); setMenuOpen(false); }}
          >
            <span className="icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${vistaActual === 'archivos' ? 'active' : ''}`}
            onClick={() => { setVistaActual('archivos'); setMenuOpen(false); }}
          >
            <span className="icon">📁</span>
            <span>Archivos</span>
          </button>

          <button
            className={`nav-item ${vistaActual === 'auditoria' ? 'active' : ''}`}
            onClick={() => { setVistaActual('auditoria'); setMenuOpen(false); }}
          >
            <span className="icon">📋</span>
            <span>Auditoría</span>
          </button>

          <button
            className={`nav-item ${vistaActual === 'monitor' ? 'active' : ''}`}
            onClick={() => { setVistaActual('monitor'); setMenuOpen(false); }}
          >
            <span className="icon">🖥️</span>
            <span>Monitor</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{usuario.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <p className="user-name">{usuario}</p>
              <p className="user-role">Usuario</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          <h1 className="page-title">
            {vistaActual === 'dashboard' && '📊 Dashboard'}
            {vistaActual === 'archivos' && '📁 Gestión de Archivos'}
            {vistaActual === 'auditoria' && '📋 Registro de Auditoría'}
            {vistaActual === 'monitor' && '🖥️ Monitor del Sistema'}
          </h1>
          <div className="user-badge">
            <span className="status-dot"></span>
            <span>{usuario}</span>
          </div>
        </header>

        <div className="content-area">
          {vistaActual === 'dashboard' && <Dashboard usuario={usuario} />}
          {vistaActual === 'archivos' && <ArchivoManager usuario={usuario} token={token} />}
          {vistaActual === 'auditoria' && <AuditoriaViewer usuario={usuario} />}
          {vistaActual === 'monitor' && <SistemaMonitor />}
        </div>
      </main>
    </div>
  );
}