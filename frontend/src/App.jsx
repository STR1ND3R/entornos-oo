import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegistroForm from "./components/RegistroForm";

export default function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "2rem" }}>
      <h1>Sistema Distribuido</h1>
      {usuario ? (
        <p>Bienvenido, {usuario} 👋</p>
      ) : (
        <>
          <LoginForm onLogin={setUsuario} />
          <hr style={{ margin: "1rem 0" }} />
          <RegistroForm />
        </>
      )}
    </div>
  );
}