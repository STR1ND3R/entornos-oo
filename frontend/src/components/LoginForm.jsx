import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/usuarios/login?nombre=${encodeURIComponent(nombre)}&password=${encodeURIComponent(password)}`, {
        method: "POST"
      });
      const text = await res.text();
      if (text === "true") {
        setMensaje("✅ Login exitoso");
        onLogin(nombre);
      } else {
        setMensaje("❌ Credenciales incorrectas");
      }
    } catch (e) {
      setMensaje("Error conectando con el gateway");
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h2>Iniciar Sesión</h2>
      <input placeholder="Usuario" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div>
        <button onClick={handleLogin}>Entrar</button>
      </div>
      <p>{mensaje}</p>
    </div>
  );
}