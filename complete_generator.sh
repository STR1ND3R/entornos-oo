#!/bin/bash
# GENERADOR COMPLETO DEL PROYECTO
# Ejecutar: bash generate-complete-project.sh

set -e
PROJECT="sistema-distribuido-completo"
echo "🚀 Generando proyecto completo: $PROJECT"
mkdir -p $PROJECT && cd $PROJECT

# Crear estructura
mkdir -p backend/{rmi-interfaces,rmi-impl,rmi-servers,gateway}/{src/main/{java/com/distribuido/{interfaces,impl,servidores,gateway/controllers},resources}}
mkdir -p frontend/src/components logs archivos docs

# ========== INTERFACES ==========
cat > backend/rmi-interfaces/src/main/java/com/distribuido/interfaces/IUsuario.java << 'EOIF'
package com.distribuido.interfaces;
import java.rmi.Remote;
import java.rmi.RemoteException;
public interface IUsuario extends Remote {
    boolean autenticar(String nombre, String password) throws RemoteException;
    void registrar(String nombre, String password) throws RemoteException;
}
EOIF

cat > backend/rmi-interfaces/src/main/java/com/distribuido/interfaces/IArchivo.java << 'EOIF'
package com.distribuido.interfaces;
import java.rmi.Remote;
import java.rmi.RemoteException;
public interface IArchivo extends Remote {
    void subirArchivo(String nombre, byte[] datos) throws RemoteException;
    byte[] descargarArchivo(String nombre) throws RemoteException;
}
EOIF

cat > backend/rmi-interfaces/src/main/java/com/distribuido/interfaces/IAuditor.java << 'EOIF'
package com.distribuido.interfaces;
import java.rmi.Remote;
import java.rmi.RemoteException;
public interface IAuditor extends Remote {
    void registrarEvento(String usuario, String accion, String recurso) throws RemoteException;
}
EOIF

cat > backend/rmi-interfaces/src/main/java/com/distribuido/interfaces/INodo.java << 'EOIF'
package com.distribuido.interfaces;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;
public interface INodo extends Remote {
    String registrarNodo(String tipoServicio, String host, int puerto) throws RemoteException;
    boolean heartbeat(String idNodo) throws RemoteException;
    List<String> obtenerNodosDisponibles(String tipoServicio) throws RemoteException;
    void marcarNodoCaido(String idNodo) throws RemoteException;
    String obtenerEstadisticas(String idNodo) throws RemoteException;
}
EOIF

cat > backend/rmi-interfaces/src/main/java/com/distribuido/interfaces/IControladorSeguridad.java << 'EOIF'
package com.distribuido.interfaces;
import java.rmi.Remote;
import java.rmi.RemoteException;
public interface IControladorSeguridad extends Remote {
    String generarToken(String usuario, String password) throws RemoteException;
    boolean validarToken(String token) throws RemoteException;
    String obtenerUsuarioDeToken(String token) throws RemoteException;
    boolean verificarPermiso(String token, String recurso, String accion) throws RemoteException;
    void invalidarToken(String token) throws RemoteException;
    String encriptarDatos(byte[] datos) throws RemoteException;
    byte[] desencriptarDatos(String datosEncriptados) throws RemoteException;
}
EOIF

cat > backend/rmi-interfaces/src/main/java/com/distribuido/interfaces/IBalanceadorCarga.java << 'EOIF'
package com.distribuido.interfaces;
import java.rmi.Remote;
import java.rmi.RemoteException;
public interface IBalanceadorCarga extends Remote {
    String obtenerSiguienteNodo(String tipoServicio) throws RemoteException;
    String obtenerNodoMenorCarga(String tipoServicio) throws RemoteException;
    void registrarCarga(String idNodo, double cargaCPU, int conexionesActivas) throws RemoteException;
    String obtenerEstadisticasCarga(String tipoServicio) throws RemoteException;
    void configurarAlgoritmo(String algoritmo) throws RemoteException;
}
EOIF

# ========== POMs ==========
cat > backend/pom.xml << 'EOIF'
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.distribuido</groupId>
  <artifactId>sistema-distribuido-backend</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>pom</packaging>
  <modules>
    <module>rmi-interfaces</module>
    <module>rmi-impl</module>
    <module>rmi-servers</module>
    <module>gateway</module>
  </modules>
  <properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
  </properties>
</project>
EOIF

cat > backend/rmi-interfaces/pom.xml << 'EOIF'
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.distribuido</groupId>
  <artifactId>rmi-interfaces</artifactId>
  <version>1.0-SNAPSHOT</version>
  <properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
  </properties>
</project>
EOIF

cat > backend/rmi-impl/pom.xml << 'EOIF'
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.distribuido</groupId>
  <artifactId>rmi-impl</artifactId>
  <version>1.0-SNAPSHOT</version>
  <properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
  </properties>
  <dependencies>
    <dependency>
      <groupId>com.distribuido</groupId>
      <artifactId>rmi-interfaces</artifactId>
      <version>1.0-SNAPSHOT</version>
      <scope>system</scope>
      <systemPath>${project.basedir}/../rmi-interfaces/target/rmi-interfaces-1.0-SNAPSHOT.jar</systemPath>
    </dependency>
  </dependencies>
</project>
EOIF

cat > backend/rmi-servers/pom.xml << 'EOIF'
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.distribuido</groupId>
  <artifactId>rmi-servers</artifactId>
  <version>1.0-SNAPSHOT</version>
  <properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
  </properties>
  <dependencies>
    <dependency>
      <groupId>com.distribuido</groupId>
      <artifactId>rmi-interfaces</artifactId>
      <version>1.0-SNAPSHOT</version>
      <scope>system</scope>
      <systemPath>${project.basedir}/../rmi-interfaces/target/rmi-interfaces-1.0-SNAPSHOT.jar</systemPath>
    </dependency>
    <dependency>
      <groupId>com.distribuido</groupId>
      <artifactId>rmi-impl</artifactId>
      <version>1.0-SNAPSHOT</version>
      <scope>system</scope>
      <systemPath>${project.basedir}/../rmi-impl/target/rmi-impl-1.0-SNAPSHOT.jar</systemPath>
    </dependency>
  </dependencies>
</project>
EOIF

cat > backend/gateway/pom.xml << 'EOIF'
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.distribuido</groupId>
  <artifactId>gateway</artifactId>
  <version>1.0-SNAPSHOT</version>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.12</version>
  </parent>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>com.distribuido</groupId>
      <artifactId>rmi-interfaces</artifactId>
      <version>1.0-SNAPSHOT</version>
      <scope>system</scope>
      <systemPath>${project.basedir}/../rmi-interfaces/target/rmi-interfaces-1.0-SNAPSHOT.jar</systemPath>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
EOIF

# ========== README ==========
cat > README.md << 'EOIF'
# Sistema Distribuido con Java RMI + Spring Boot + React

Sistema completo con 6 servicios distribuidos implementando seguridad, balanceo de carga y tolerancia a fallos.

## 🚀 Inicio Rápido

```bash
# 1. Compilar
cd backend
mvn -pl rmi-interfaces -am package && mvn package

# 2. Ejecutar
cd ..
chmod +x start-system.sh
./start-system.sh

# 3. Abrir http://localhost:5173
# Usuario: admin / Contraseña: 1234
```

## 📊 Servicios

| Puerto | Servicio | Función |
|--------|----------|---------|
| 1099 | Usuario | Autenticación |
| 1100 | Archivo | Gestión archivos |
| 1101 | Auditoría | Logging |
| 1102 | Nodo | Discovery |
| 1103 | Seguridad | JWT + AES |
| 1104 | Balanceador | Load balancing |
| 8080 | Gateway | API REST |
| 5173 | Frontend | React UI |

## 📝 Documentación Completa

Ver archivos en `/docs` para arquitectura detallada, diseño de seguridad, escalabilidad y tolerancia a fallos.
EOIF

# ========== IMPLEMENTACIÓN MÍNIMA (Para que compile) ==========
cat > backend/rmi-impl/src/main/java/com/distribuido/impl/UsuarioImpl.java << 'EOIF'
package com.distribuido.impl;
import com.distribuido.interfaces.IUsuario;
import java.rmi.server.UnicastRemoteObject;
import java.rmi.RemoteException;
import java.util.concurrent.ConcurrentHashMap;
public class UsuarioImpl extends UnicastRemoteObject implements IUsuario {
    private ConcurrentHashMap<String, String> usuarios = new ConcurrentHashMap<>();
    public UsuarioImpl() throws RemoteException {
        super();
        usuarios.put("admin", "1234");
    }
    @Override
    public boolean autenticar(String nombre, String password) throws RemoteException {
        return usuarios.containsKey(nombre) && usuarios.get(nombre).equals(password);
    }
    @Override
    public void registrar(String nombre, String password) throws RemoteException {
        usuarios.put(nombre, password);
        System.out.println("Usuario registrado: " + nombre);
    }
}
EOIF

# ========== ARCHIVO DE INSTRUCCIONES ==========
cat > LEEME.txt << 'EOIF'
==============================================
PROYECTO GENERADO - PRÓXIMOS PASOS
==============================================

✅ LO QUE SE HA GENERADO:
- Estructura completa de directorios
- 6