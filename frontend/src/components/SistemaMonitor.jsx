import { useState, useEffect } from "react";

export default function SistemaMonitor() {
  const [nodos, setNodos] = useState([
    { nombre: "ServidorNodos", puerto: 1102, estado: "activo", carga: 15, conexiones: 3, heartbeat: "Normal" },
    { nombre: "ServidorSeguridad", puerto: 1103, estado: "activo", carga: 22, conexiones: 5, heartbeat: "Normal" },
    { nombre: "ServidorBalanceador", puerto: 1104, estado: "activo", carga: 18, conexiones: 4, heartbeat: "Normal" },
    { nombre: "ServidorUsuarios", puerto: 1099, estado: "activo", carga: 35, conexiones: 8, heartbeat: "Normal" },
    { nombre: "ServidorArchivos", puerto: 1100, estado: "activo", carga: 42, conexiones: 12, heartbeat: "Normal" },
    { nombre: "ServidorAuditoria", puerto: 1101, estado: "activo", carga: 12, conexiones: 2, heartbeat: "Normal" }
  ]);

  const [algoritmoBalanceo, setAlgoritmoBalanceo] = useState("ROUND_ROBIN");

  useEffect(() => {
    // Simular actualización de métricas
    const interval = setInterval(() => {
      setNodos(prev => prev.map(nodo => ({
        ...nodo,
        carga: Math.min(100, Math.max(5, nodo.carga + Math.floor(Math.random() * 10 - 5))),
        conexiones: Math.max(0, nodo.conexiones + Math.floor(Math.random() * 3 - 1))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getEstadoColor = (estado) => {
    return estado === "activo" ? "estado-activo" : "estado-inactivo";
  };

  const getCargaColor = (carga) => {
    if (carga < 30) return "carga-baja";
    if (carga < 70) return "carga-media";
    return "carga-alta";
  };

  const cambiarAlgoritmo = (algoritmo) => {
    setAlgoritmoBalanceo(algoritmo);
    // En producción aquí iría la llamada al backend
    console.log("Algoritmo cambiado a:", algoritmo);
  };

  return (
    <div className="sistema-monitor">
      <div className="monitor-header">
        <div className="header-info">
          <h2>🖥️ Monitor del Sistema</h2>
          <p>Monitoreo en tiempo real de todos los servicios</p>
        </div>
        <div className="monitor-stats">
          <div className="stat-badge success">
            <span className="stat-value">{nodos.filter(n => n.estado === "activo").length}/6</span>
            <span className="stat-label">Activos</span>
          </div>
          <div className="stat-badge info">
            <span className="stat-value">{nodos.reduce((sum, n) => sum + n.conexiones, 0)}</span>
            <span className="stat-label">Conexiones</span>
          </div>
        </div>
      </div>

      <div className="balanceo-config">
        <h3>⚖️ Configuración de Balanceo de Carga</h3>
        <div className="algoritmo-selector">
          <button
            className={`algoritmo-btn ${algoritmoBalanceo === 'ROUND_ROBIN' ? 'active' : ''}`}
            onClick={() => cambiarAlgoritmo('ROUND_ROBIN')}
          >
            <span className="algoritmo-icon">🔄</span>
            <span>Round Robin</span>
            {algoritmoBalanceo === 'ROUND_ROBIN' && <span className="activo-badge">Activo</span>}
          </button>
          <button
            className={`algoritmo-btn ${algoritmoBalanceo === 'LEAST_CONNECTIONS' ? 'active' : ''}`}
            onClick={() => cambiarAlgoritmo('LEAST_CONNECTIONS')}
          >
            <span className="algoritmo-icon">🔗</span>
            <span>Least Connections</span>
            {algoritmoBalanceo === 'LEAST_CONNECTIONS' && <span className="activo-badge">Activo</span>}
          </button>
          <button
            className={`algoritmo-btn ${algoritmoBalanceo === 'LEAST_LOAD' ? 'active' : ''}`}
            onClick={() => cambiarAlgoritmo('LEAST_LOAD')}
          >
            <span className="algoritmo-icon">📊</span>
            <span>Least Load</span>
            {algoritmoBalanceo === 'LEAST_LOAD' && <span className="activo-badge">Activo</span>}
          </button>
        </div>
      </div>

      <div className="nodos-grid">
        {nodos.map((nodo, index) => (
          <div key={index} className="nodo-card">
            <div className="nodo-header">
              <div className="nodo-title">
                <h4>{nodo.nombre}</h4>
                <span className="puerto-badge">:{nodo.puerto}</span>
              </div>
              <span className={`estado-badge ${getEstadoColor(nodo.estado)}`}>
                {nodo.estado === "activo" ? "✓ Activo" : "✗ Inactivo"}
              </span>
            </div>

            <div className="nodo-metricas">
              <div className="metrica">
                <div className="metrica-header">
                  <span className="metrica-label">CPU</span>
                  <span className="metrica-valor">{nodo.carga}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${getCargaColor(nodo.carga)}`}
                    style={{ width: `${nodo.carga}%` }}
                  ></div>
                </div>
              </div>

              <div className="metrica-row">
                <div className="metrica-item">
                  <span className="metrica-icon">🔗</span>
                  <span className="metrica-text">{nodo.conexiones} conexiones</span>
                </div>
                <div className="metrica-item">
                  <span className="metrica-icon">💓</span>
                  <span className="metrica-text">{nodo.heartbeat}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="info-panels">
        <div className="info-panel">
          <h3>🔐 Características de Seguridad</h3>
          <ul className="features-list">
            <li>✓ Tokens JWT con expiración de 1 hora</li>
            <li>✓ Encriptación AES-128 para datos</li>
            <li>✓ Control de permisos granular</li>
            <li>✓ Auditoría completa de operaciones</li>
            <li>✓ Limpieza automática de tokens</li>
          </ul>
        </div>

        <div className="info-panel">
          <h3>🛡️ Tolerancia a Fallos</h3>
          <ul className="features-list">
            <li>✓ Heartbeat cada 10 segundos</li>
            <li>✓ Timeout de detección: 30 segundos</li>
            <li>✓ Failover automático</li>
            <li>✓ Recuperación automática de nodos</li>
            <li>✓ Replicación en 3 nodos</li>
          </ul>
        </div>

        <div className="info-panel">
          <h3>📈 Escalabilidad</h3>
          <ul className="features-list">
            <li>✓ Auto-registro de nodos</li>
            <li>✓ Descubrimiento dinámico</li>
            <li>✓ Balanceo con 3 algoritmos</li>
            <li>✓ Sin configuración manual</li>
            <li>✓ Escalamiento horizontal</li>
          </ul>
        </div>
      </div>

      <div className="arquitectura-info">
        <h3>🏗️ Arquitectura del Sistema</h3>
        <div className="arquitectura-diagram">
          <div className="capa">
            <div className="capa-title">Frontend</div>
            <div className="componente">React + Vite :5173</div>
          </div>
          <div className="flecha">↓</div>
          <div className="capa">
            <div className="capa-title">Gateway</div>
            <div className="componente">Spring Boot :8080</div>
          </div>
          <div className="flecha">↓</div>
          <div className="capa">
            <div className="capa-title">Servicios Críticos</div>
            <div className="componentes-grid">
              <div className="componente small">Nodos :1102</div>
              <div className="componente small">Seguridad :1103</div>
              <div className="componente small">Balanceador :1104</div>
            </div>
          </div>
          <div className="flecha">↓</div>
          <div className="capa">
            <div className="capa-title">Servicios de Negocio</div>
            <div className="componentes-grid">
              <div className="componente small">Usuarios :1099</div>
              <div className="componente small">Archivos :1100</div>
              <div className="componente small">Auditoría :1101</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}