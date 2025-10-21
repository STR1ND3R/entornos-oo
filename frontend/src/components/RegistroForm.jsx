import { useState } from "react";

export default function RegistroForm() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/usuarios/registrar?nombre=${encodeURIComponent(nombre)}&password=${encodeURIComponent(password)}`,
        { method: "POST" }
      );

      const text = await res.text();

      if (text.includes("correctamente")) {
        setMensaje("✅ " + text);
        setNombre("");
        setPassword("");
      } else {
        setMensaje("❌ " + text);
      }
    } catch (e) {
      setMensaje("❌ Error conectando con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Crear Cuenta</h2>
      <form onSubmit={handleRegistro}>
        <input
          type="text"
          placeholder="Nuevo usuario"
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
          {cargando ? 'Registrando...' : '👤 Registrar Usuario'}
        </button>
      </form>
      {mensaje && (
        <div className={`mensaje ${mensaje.startsWith('✅') ? 'success' : 'error'}`}>
          {mensaje}
        </div>
      )}
    </div>
  );
}