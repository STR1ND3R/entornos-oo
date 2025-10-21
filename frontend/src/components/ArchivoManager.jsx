import { useState } from "react";

export default function ArchivoManager({ usuario, token }) {
  const [archivos, setArchivos] = useState([]);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoSeleccionado(file);
      setNombreArchivo(file.name);
      setMensaje("");
    }
  };

  const subirArchivo = async () => {
    if (!archivoSeleccionado) {
      setMensaje("⚠️ Por favor selecciona un archivo");
      return;
    }

    setCargando(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);

        const res = await fetch(
          `http://localhost:8080/api/archivos/subir?nombre=${encodeURIComponent(nombreArchivo)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
            },
            body: uint8Array,
          }
        );

        const text = await res.text();

        if (text === "ok") {
          setMensaje("✅ Archivo subido correctamente");
          setArchivos([...archivos, {
            nombre: nombreArchivo,
            fecha: new Date().toLocaleString(),
            tamaño: formatBytes(archivoSeleccionado.size)
          }]);
          setArchivoSeleccionado(null);
          setNombreArchivo("");

          // Registrar en auditoría
          await registrarAuditoria(usuario, "SUBIR_ARCHIVO", nombreArchivo);
        } else {
          setMensaje("❌ Error al subir archivo");
        }
      };
      reader.readAsArrayBuffer(archivoSeleccionado);
    } catch (e) {
      setMensaje("❌ Error: " + e.message);
    } finally {
      setCargando(false);
    }
  };

  const descargarArchivo = async (nombre) => {
    setCargando(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/archivos/descargar?nombre=${encodeURIComponent(nombre)}`
      );

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = nombre;
        a.click();
        setMensaje("✅ Archivo descargado");

        // Registrar en auditoría
        await registrarAuditoria(usuario, "DESCARGAR_ARCHIVO", nombre);
      } else {
        setMensaje("❌ Error al descargar archivo");
      }
    } catch (e) {
      setMensaje("❌ Error: " + e.message);
    } finally {
      setCargando(false);
    }
  };

  const registrarAuditoria = async (usuario, accion, recurso) => {
    try {
      await fetch(
        `http://localhost:8080/api/auditoria/registrar?usuario=${usuario}&accion=${accion}&recurso=${recurso}`,
        { method: "POST" }
      );
    } catch (e) {
      console.error("Error registrando auditoría:", e);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="archivo-manager">
      <div className="upload-section">
        <div className="upload-card">
          <h3>📤 Subir Archivo</h3>

          <div className="file-input-wrapper">
            <input
              type="file"
              id="file-input"
              onChange={handleFileSelect}
              disabled={cargando}
            />
            <label htmlFor="file-input" className="file-input-label">
              {archivoSeleccionado ? (
                <>
                  <span className="file-icon">📄</span>
                  <span>{archivoSeleccionado.name}</span>
                  <span className="file-size">{formatBytes(archivoSeleccionado.size)}</span>
                </>
              ) : (
                <>
                  <span className="upload-icon">📁</span>
                  <span>Seleccionar archivo</span>
                </>
              )}
            </label>
          </div>

          {archivoSeleccionado && (
            <div className="file-name-input">
              <label>Nombre del archivo:</label>
              <input
                type="text"
                value={nombreArchivo}
                onChange={(e) => setNombreArchivo(e.target.value)}
                placeholder="nombre.txt"
                disabled={cargando}
              />
            </div>
          )}

          <button
            className={`btn-primary ${cargando ? 'loading' : ''}`}
            onClick={subirArchivo}
            disabled={!archivoSeleccionado || cargando}
          >
            {cargando ? '⏳ Subiendo...' : '📤 Subir Archivo'}
          </button>

          {mensaje && (
            <div className={`mensaje ${mensaje.startsWith('✅') ? 'success' : 'error'}`}>
              {mensaje}
            </div>
          )}
        </div>

        <div className="info-box">
          <h4>ℹ️ Información</h4>
          <ul>
            <li>✓ Tamaño máximo: 10 MB</li>
            <li>✓ Formatos aceptados: Todos</li>
            <li>✓ Archivos encriptados con AES</li>
            <li>✓ Replicación automática en 3 nodos</li>
          </ul>
        </div>
      </div>

      <div className="files-list-section">
        <div className="section-header">
          <h3>📁 Archivos Subidos</h3>
          <span className="file-count">{archivos.length} archivos</span>
        </div>

        {archivos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <p>No hay archivos subidos aún</p>
            <p className="empty-hint">Sube tu primer archivo usando el formulario arriba</p>
          </div>
        ) : (
          <div className="files-grid">
            {archivos.map((archivo, index) => (
              <div key={index} className="file-card">
                <div className="file-icon-large">📄</div>
                <div className="file-info">
                  <h4>{archivo.nombre}</h4>
                  <p className="file-meta">
                    <span>📅 {archivo.fecha}</span>
                    <span>💾 {archivo.tamaño}</span>
                  </p>
                </div>
                <button
                  className="btn-download"
                  onClick={() => descargarArchivo(archivo.nombre)}
                  disabled={cargando}
                >
                  ⬇️ Descargar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}