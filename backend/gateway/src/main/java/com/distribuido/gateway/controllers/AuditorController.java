package com.distribuido.gateway.controllers;

import org.springframework.web.bind.annotation.*;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import com.distribuido.interfaces.IAuditor;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin(origins = "*")
public class AuditorController {

    @PostMapping("/registrar")
    public String registrar(@RequestParam String usuario, @RequestParam String accion, @RequestParam String recurso) {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", 1101);
            IAuditor auditor = (IAuditor) registry.lookup("AuditorService");
            auditor.registrarEvento(usuario, accion, recurso);
            return "ok";
        } catch (Exception e) {
            e.printStackTrace();
            return "error: " + e.getMessage();
        }
    }
}