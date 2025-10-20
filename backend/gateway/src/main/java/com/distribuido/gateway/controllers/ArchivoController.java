package com.distribuido.gateway.controllers;

import org.springframework.web.bind.annotation.*;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import com.distribuido.interfaces.IArchivo;

@RestController
@RequestMapping("/api/archivos")
@CrossOrigin(origins = "*")
public class ArchivoController {

    @PostMapping("/subir")
    public String subir(@RequestParam String nombre, @RequestBody byte[] datos) {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", 1100);
            IArchivo archivo = (IArchivo) registry.lookup("ArchivoService");
            archivo.subirArchivo(nombre, datos);
            return "ok";
        } catch (Exception e) {
            e.printStackTrace();
            return "error: " + e.getMessage();
        }
    }

    @GetMapping("/descargar")
    public byte[] descargar(@RequestParam String nombre) {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", 1100);
            IArchivo archivo = (IArchivo) registry.lookup("ArchivoService");
            return archivo.descargarArchivo(nombre);
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }
}