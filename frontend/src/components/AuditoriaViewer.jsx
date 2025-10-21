import { useState, useEffect } from "react";

export default function AuditoriaViewer({ usuario }) {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    // Simular eventos de auditoría
    const eventosIniciales = [
      {
        id: 1,
        usuario: usuario,
        accion: "LOGIN",
        recurso: "sistema",
        fecha: new Date().toLocaleString(),
        tipo: "seguridad"
      },
      {
        id: 2,
        usuario: "admin",
        accion: "REGISTRO_USUARIO",
        recurso: usuario,
        fecha: new Date(Date.now() - 3600000).toLocaleString(),
        tipo: "usuario"
      }
    ];
    setEventos(eventosIniciales);
  }, [usuario]);

  const registrarEvento = async () => {
    const nuevoEvento = {
      id: eventos.length + 1,
      usuario: usuario,
      accion: "CONSULTA_AUDITORIA",
      recurso: "logs",
      fecha: new Date().toLocaleString(),
      tipo: "sistema"
    };

    try {
      await fetch(
        `http://localhost:8080/api/auditoria/registrar?usuario=${usuario}&accion=CONSULTA_AUDITORIA&recurso=logs`,
        { method: "POST" }
      );
      setEventos([nuevoEvento, ...eventos]);
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const eventosFiltrados = filtro === "todos"
    ? eventos
    : eventos.filter(e => e.tipo === filtro);

  const getIconoAccion = (accion) => {
    const iconos = {
      "LOGIN": "🔐",
      "LOGOUT": "🚪",
      "SUBIR_ARCHIVO": "📤",
      "DESCARGAR_ARCHIVO": "📥",
      "REGISTRO_USUARIO": "👤",
      "CONSULTA_AUDITORIA": "📋",
      "ERROR": "❌"
    };
    return iconos[accion] || "📝";
  };

  const getTipoColor = (tipo) => {
    const colores = {
      "seguridad": "tipo-seguridad",
      "archivo": "tipo-archivo",
      "usuario": "tipo-usuario",
      "sistema": "tipo-sistema"
    };
    return colores[tipo] || "tipo-default";
  };

  return (
    <div className="auditoria-viewer">
      <div className="auditoria-header">
        <div className="header-info">
          <h2>📋 Registro de Auditoría</h2>
          <p>Todos los eventos del sistema son registrados aquí</p>
        </div>
        <button className="btn-refresh" onClick={registrarEvento}>
          🔄 Registrar Evento de Prueba
        </button>
      </div>

      <div className="filtros">
        <button
          className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`}
          onClick={() => setFiltro('todos')}
        >
          Todos ({eventos.length})
        </button>
        <button
          className={`filtro-btn ${filtro === 'seguridad' ? 'active' : ''}`}
          onClick={() => setFiltro('seguridad')}
        >
          🔐 Seguridad
        </button>
        <button
          className={`filtro-btn ${filtro === 'archivo' ? 'active' : ''}`}
          onClick={() => setFiltro('archivo')}
        >
          📁 Archivos
        </button>
        <button
          className={`filtro-btn ${filtro === 'usuario' ? 'active' : ''}`}
          onClick={() => setFiltro('usuario')}
        >
          👤 Usuarios
        </button>
        <button
          className={`filtro-btn ${filtro === 'sistema' ? 'active' : ''}`}
          onClick={() => setFiltro('sistema')}
        >
          ⚙️ Sistema
        </button>
      </div>

      <div className="eventos-lista">
        {eventosFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No hay eventos para mostrar</p>
          </div>
        ) : (
          eventosFiltrados.map((evento) => (
            <div key={evento.id} className="evento-card">
              <div className="evento-icon">
                {getIconoAccion(evento.accion)}
              </div>
              <div className="evento-info">
                <div className="evento-header">
                  <h4>{evento.accion.replace(/_/g, ' ')}</h4>
                  <span className={`tipo-badge ${getTipoColor(evento.tipo)}`}>
                    {evento.tipo}
                  </span>
                </div>
                <p className="evento-detalle">
                  <strong>{evento.usuario}</strong> → {evento.recurso}
                </p>
                <p className="evento-fecha">🕐 {evento.fecha}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="auditoria-stats">
        <div className="stat-mini">
          <span className="stat-icon">📊</span>
          <span className="stat-text">Total: {eventos.length} eventos</span>
        </div>
        <div className="stat-mini">
          <span className="stat-icon">⏱️</span>
          <span className="stat-text">Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="stat-mini">
          <span className="stat-icon">💾</span>
          <span className="stat-text">Almacenado en: auditoria.log</span>
        </div>
      </div>
    </div>
  );
}