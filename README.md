Proyecto ejemplo: Sistema distribuido con Java RMI + Spring Boot gateway y React (Vite) frontend.

Ejecución (resumen):
1. Construir interfaces jar:
   cd backend
   mvn -pl rmi-interfaces -am package

2. Compilar e instalar los jars locales si es necesario, luego construir resto:
   mvn package

3. Ejecutar servidores RMI (desde el classpath que incluya interfaces and impl):
   java -cp backend/rmi-interfaces/target/rmi-interfaces-1.0-SNAPSHOT.jar:backend/rmi-impl/target/rmi-impl-1.0-SNAPSHOT.jar:backend/rmi-servers/target/rmi-servers-1.0-SNAPSHOT.jar com.distribuido.servidores.ServidorUsuarios
   java -cp ... com.distribuido.servidores.ServidorArchivos
   java -cp ... com.distribuido.servidores.ServidorAuditoria

4. Ejecutar gateway:
   cd backend/gateway
   mvn spring-boot:run

5. Ejecutar frontend:
   cd frontend
   npm install
   npm run dev

Nota: este repo es una plantilla educativa. Ajusta classpath y versiones en tu entorno.