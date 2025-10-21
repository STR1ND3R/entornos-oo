package com.distribuido.gateway.controllers;

import org.springframework.web.bind.annotation.*;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.*;

@RestController
@RequestMapping("/api/monitor")
@CrossOrigin(origins = "*")
public class MonitorController {

    @GetMapping("/estado")
    public Map<String, Object> obtenerEstado() {
        Map<String, Object> estado = new HashMap<>();
        Map<String, Boolean> servicios = new HashMap<>();

        // Verificar cada servicio
        servicios.put("usuarios", verificarServicio(1099, "UsuarioService"));
        servicios.put("archivos", verificarServicio(1100, "ArchivoService"));
        servicios.put("auditoria", verificarServicio(1101, "AuditorService"));
        servicios.put("nodos", verificarServicio(1102, "NodoService"));
        servicios.put("seguridad", verificarServicio(1103, "SeguridadService"));
        servicios.put("balanceador", verificarServicio(1104, "BalanceadorService"));

        int activos = (int) servicios.values().stream().filter(v -> v).count();

        estado.put("servicios", servicios);
        estado.put("nodosActivos", activos);
        estado.put("timestamp", System.currentTimeMillis());

        return estado;
    }

    private boolean verificarServicio(int puerto, String nombre) {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", puerto);
            registry.lookup(nombre);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}