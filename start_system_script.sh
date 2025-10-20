#!/bin/bash

# Script para iniciar todo el sistema distribuido
# Autor: Sistema Distribuido con Java RMI
# Fecha: 2025

set -e

echo "═══════════════════════════════════════════════════════════"
echo "🚀 INICIANDO SISTEMA DISTRIBUIDO"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar Java
if ! command -v java &> /dev/null; then
    print_error "Java no está instalado"
    exit 1
fi

# Verificar Maven
if ! command -v mvn &> /dev/null; then
    print_error "Maven no está instalado"
    exit 1
fi

print_success "Java y Maven detectados"

# Paso 1: Compilar el proyecto
echo ""
echo "───────────────────────────────────────────────────────────"
echo "📦 PASO 1: Compilando proyecto..."
echo "───────────────────────────────────────────────────────────"

cd backend

# Compilar interfaces primero
print_warning "Compilando rmi-interfaces..."
mvn -pl rmi-interfaces -am package -q
print_success "Interfaces compiladas"

# Compilar implementaciones
print_warning "Compilando rmi-impl..."
mvn -pl rmi-impl -am package -q
print_success "Implementaciones compiladas"

# Compilar servidores
print_warning "Compilando rmi-servers..."
mvn -pl rmi-servers -am package -q
print_success "Servidores compilados"

# Compilar gateway
print_warning "Compilando gateway..."
mvn -pl gateway -am package -q
print_success "Gateway compilado"

cd ..

# Crear directorios necesarios
mkdir -p archivos
mkdir -p logs

# Paso 2: Iniciar servidores RMI
echo ""
echo "───────────────────────────────────────────────────────────"
echo "🌐 PASO 2: Iniciando servidores RMI..."
echo "───────────────────────────────────────────────────────────"

# Construir classpath
INTERFACES_JAR="backend/rmi-interfaces/target/rmi-interfaces-1.0-SNAPSHOT.jar"
IMPL_JAR="backend/rmi-impl/target/rmi-impl-1.0-SNAPSHOT.jar"
SERVERS_JAR="backend/rmi-servers/target/rmi-servers-1.0-SNAPSHOT.jar"
CLASSPATH="$INTERFACES_JAR:$IMPL_JAR:$SERVERS_JAR"

# Función para iniciar servidor RMI en background
start_rmi_server() {
    local server_class=$1
    local server_name=$2
    local log_file="logs/${server_name}.log"
    
    print_warning "Iniciando $server_name..."
    nohup java -cp "$CLASSPATH" "$server_class" > "$log_file" 2>&1 &
    local pid=$!
    echo $pid > "logs/${server_name}.pid"
    sleep 2
    
    if ps -p $pid > /dev/null; then
        print_success "$server_name iniciado (PID: $pid)"
    else
        print_error "$server_name falló al iniciar. Ver $log_file"
        return 1
    fi
}

# Iniciar servidores en orden de criticidad
start_rmi_server "com.distribuido.servidores.ServidorNodos" "nodos"
start_rmi_server "com.distribuido.servidores.ServidorSeguridad" "seguridad"
start_rmi_server "com.distribuido.servidores.ServidorBalanceador" "balanceador"
start_rmi_server "com.distribuido.servidores.ServidorUsuarios" "usuarios"
start_rmi_server "com.distribuido.servidores.ServidorArchivos" "archivos"
start_rmi_server "com.distribuido.servidores.ServidorAuditoria" "auditoria"

# Paso 3: Iniciar Gateway
echo ""
echo "───────────────────────────────────────────────────────────"
echo "🌉 PASO 3: Iniciando Gateway Spring Boot..."
echo "───────────────────────────────────────────────────────────"

cd backend/gateway
print_warning "Iniciando Gateway en puerto 8080..."
nohup mvn spring-boot:run > ../../logs/gateway.log 2>&1 &
GATEWAY_PID=$!
echo $GATEWAY_PID > ../../logs/gateway.pid
cd ../..

sleep 5

if ps -p $GATEWAY_PID > /dev/null; then
    print_success "Gateway iniciado (PID: $GATEWAY_PID)"
else
    print_error "Gateway falló al iniciar. Ver logs/gateway.log"
fi

# Paso 4: Iniciar Frontend
echo ""
echo "───────────────────────────────────────────────────────────"
echo "🎨 PASO 4: Iniciando Frontend React..."
echo "───────────────────────────────────────────────────────────"

cd frontend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    print_warning "Instalando dependencias de npm..."
    npm install
fi

print_warning "Iniciando servidor Vite en puerto 5173..."
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid
cd ..

sleep 3

if ps -p $FRONTEND_PID > /dev/null; then
    print_success "Frontend iniciado (PID: $FRONTEND_PID)"
else
    print_error "Frontend falló al iniciar. Ver logs/frontend.log"
fi

# Resumen final
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✨ SISTEMA INICIADO CORRECTAMENTE"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Servicios RMI activos:"
echo "   • ServidorNodos        → localhost:1102"
echo "   • ServidorSeguridad    → localhost:1103"
echo "   • ServidorBalanceador  → localhost:1104"
echo "   • ServidorUsuarios     → localhost:1099"
echo "   • ServidorArchivos     → localhost:1100"
echo "   • ServidorAuditoria    → localhost:1101"
echo ""
echo "🌉 Gateway Spring Boot:"
echo "   • API REST             → http://localhost:8080"
echo ""
echo "🎨 Frontend React:"
echo "   • Interfaz Web         → http://localhost:5173"
echo ""
echo "📁 Logs disponibles en:"
echo "   • logs/*.log"
echo ""
echo "🛑 Para detener el sistema:"
echo "   • ./stop-system.sh"
echo ""
echo "═══════════════════════════════════════════════════════════"