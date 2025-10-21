import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/usuarios/login?nombre=${encodeURIComponent(nombre)}&password=${encodeURIComponent(password)}`,
        { method: "POST" }
      );

      const text = await res.text();

      if (text === "true") {
        setMensaje("✅ Login exitoso");
        // Generar token simple (en producción vendría del backend)
        const token = btoa(`${nombre}:${Date.now()}`);
        setTimeout(() => onLogin(nombre, token), 500);
      } else {
        setMensaje("❌ Credenciales incorrectas");
      }
    } catch (e) {
      setMensaje("❌ Error conectando con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={cargando}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={cargando}
          required
        />
        <button
          type="submit"
          className={`btn-primary ${cargando ? 'loading' : ''}`}
          disabled={cargando}
        >
          {cargando ? 'Iniciando sesión...' : '🔐 Iniciar Sesión'}
        </button>
      </form>
      {mensaje && (
        <div className={`mensaje ${mensaje.startsWith('✅') ? 'success' : 'error'}`}>
          {mensaje}
        </div>
      )}
      <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>
        Usuario de prueba: <strong>admin</strong> / Contraseña: <strong>1234</strong>
      </p>
    </div>
  );
}