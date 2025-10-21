import { useState, useEffect } from "react";

export default function Dashboard({ usuario }) {
  const [stats, setStats] = useState({
    archivosSubidos: 0,
    eventosAuditoria: 0,
    nodosActivos: 6,
    tiempoSesion: 0
  });

  const [estadoServicios, setEstadoServicios] = useState({
    usuarios: true,
    archivos: true,
    auditoria: true,
    nodos: true,
    seguridad: true,
    balanceador: true
  });

  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

  // Timer de sesión
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setStats(prev => ({ ...prev, tiempoSesion: elapsed }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Verificar estado de servicios cada 5 segundos
  useEffect(() => {
    const verificarEstado = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/monitor/estado');
        const data = await res.json();

        setEstadoServicios(data.servicios);
        setStats(prev => ({ ...prev, nodosActivos: data.nodosActivos }));
        setUltimaActualizacion(new Date(data.timestamp));
      } catch (e) {
        console.error('Error verificando estado:', e);
      }
    };

    verificarEstado(); // Primera verificación
    const interval = setInterval(verificarEstado, 5000); // Cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="dashboard">
      <div className="welcome-banner">
        <h2>Bienvenido de nuevo, {usuario}</h2>
        <p>Tu sistema distribuido está funcionando correctamente</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>Archivos</h3>
            <p className="stat-number">{stats.archivosSubidos}</p>
            <p className="stat-label">Archivos gestionados</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Auditoría</h3>
            <p className="stat-number">{stats.eventosAuditoria}</p>
            <p className="stat-label">Eventos registrados</p>
          </div>
        </div>

        <div className={`stat-card ${stats.nodosActivos === 6 ? 'info' : 'danger'}`}>
          <div className="stat-icon">🖥️</div>
          <div className="stat-content">
            <h3>Nodos</h3>
            <p className="stat-number">{stats.nodosActivos}/6</p>
            <p className="stat-label">Servicios activos</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>Sesión</h3>
            <p className="stat-number">{formatTime(stats.tiempoSesion)}</p>
            <p className="stat-label">Tiempo activo</p>
          </div>
        </div>
      </div>

      {stats.nodosActivos < 6 && (
        <div className="alerta-sistema">
          ⚠️ Atención: {6 - stats.nodosActivos} servicio(s) inactivo(s)
        </div>
      )}

      <div className="dashboard-grid">
        <div className="info-card">
          <h3>Seguridad del Sistema</h3>
          <div className="feature-list">
            <div className="feature-item">
              <span className="check">✓</span>
              <span>Tokens JWT activos</span>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <span>Encriptación AES-128</span>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <span>Control de permisos</span>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <span>Auditoría completa</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Balanceo de Carga</h3>
          <div className="feature-list">
            <div className="feature-item">
              <span className="badge">ACTIVO</span>
              <span>Round Robin</span>
            </div>
            <div className="feature-item">
              <span className="badge">DISPONIBLE</span>
              <span>Least Connections</span>
            </div>
            <div className="feature-item">
              <span className="badge">DISPONIBLE</span>
              <span>Least Load</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Tolerancia a Fallos</h3>
          <div className="feature-list">
            <div className="feature-item">
              <span className="check">✓</span>
              <span>Heartbeat cada 10s</span>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <span>Detección automática</span>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <span>Failover inmediato</span>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <span>Recuperación automática</span>
            </div>
          </div>
        </div>
      </div>

      <div className="services-status">
        <div className="section-header">
          <h3>Estado de Servicios RMI</h3>
          <span className="ultima-actualizacion">
            Actualizado: {ultimaActualizacion.toLocaleTimeString()}
          </span>
        </div>
        <div className="services-list">
          <div className={`service-item ${estadoServicios.nodos ? 'active' : 'inactive'}`}>
            <span className="status-indicator"></span>
            <span className="service-name">ServidorNodos</span>
            <span className="service-port">:1102</span>
            <span className="service-status">{estadoServicios.nodos ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div className={`service-item ${estadoServicios.seguridad ? 'active' : 'inactive'}`}>
            <span className="status-indicator"></span>
            <span className="service-name">ServidorSeguridad</span>
            <span className="service-port">:1103</span>
            <span className="service-status">{estadoServicios.seguridad ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div className={`service-item ${estadoServicios.balanceador ? 'active' : 'inactive'}`}>
            <span className="status-indicator"></span>
            <span className="service-name">ServidorBalanceador</span>
            <span className="service-port">:1104</span>
            <span className="service-status">{estadoServicios.balanceador ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div className={`service-item ${estadoServicios.usuarios ? 'active' : 'inactive'}`}>
            <span className="status-indicator"></span>
            <span className="service-name">ServidorUsuarios</span>
            <span className="service-port">:1099</span>
            <span className="service-status">{estadoServicios.usuarios ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div className={`service-item ${estadoServicios.archivos ? 'active' : 'inactive'}`}>
            <span className="status-indicator"></span>
            <span className="service-name">ServidorArchivos</span>
            <span className="service-port">:1100</span>
            <span className="service-status">{estadoServicios.archivos ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div className={`service-item ${estadoServicios.auditoria ? 'active' : 'inactive'}`}>
            <span className="status-indicator"></span>
            <span className="service-name">ServidorAuditoria</span>
            <span className="service-port">:1101</span>
            <span className="service-status">{estadoServicios.auditoria ? 'Activo' : 'Inactivo'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}