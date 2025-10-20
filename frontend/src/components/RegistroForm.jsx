import { useState } from "react";

export default function RegistroForm() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegistro = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/usuarios/registrar?nombre=${encodeURIComponent(nombre)}&password=${encodeURIComponent(password)}`, {
        method: "POST"
      });
      const text = await res.text();
      setMensaje(text);
    } catch (e) {
      setMensaje("Error conectando con el gateway");
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h2>Registrar Usuario</h2>
      <input placeholder="Usuario" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div>
        <button onClick={handleRegistro}>Registrar</button>
      </div>
      <p>{mensaje}</p>
    </div>
  );
}