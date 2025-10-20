#!/bin/bash

# Script para detener todo el sistema distribuido

set -e

echo "═══════════════════════════════════════════════════════════"
echo "🛑 DETENIENDO SISTEMA DISTRIBUIDO"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función para detener proceso por PID file
stop_service() {
    local service_name=$1
    local pid_file="logs/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            kill $pid
            print_success "$service_name detenido (PID: $pid)"
        else
            print_warning "$service_name ya estaba detenido"
        fi
        rm -f "$pid_file"
    else
        print_warning "No se encontró PID para $service_name"
    fi
}

# Detener servicios en orden inverso
echo "Deteniendo Frontend..."
stop_service "frontend"

echo "Deteniendo Gateway..."
stop_service "gateway"

echo "Deteniendo servidores RMI..."
stop_service "auditoria"
stop_service "archivos"
stop_service "usuarios"
stop_service "balanceador"
stop_service "seguridad"
stop_service "nodos"

# Cleanup adicional (por si acaso)
echo ""
echo "Limpieza adicional..."
pkill -f "ServidorNodos" 2>/dev/null || true
pkill -f "ServidorSeguridad" 2>/dev/null || true
pkill -f "ServidorBalanceador" 2>/dev/null || true
pkill -f "ServidorUsuarios" 2>/dev/null || true
pkill -f "ServidorArchivos" 2>/dev/null || true
pkill -f "ServidorAuditoria" 2>/dev/null || true

echo ""
echo "═══════════════════════════════════════════════════════════"
print_success "Sistema detenido completamente"
echo "═══════════════════════════════════════════════════════════"