package com.distribuido.gateway.controllers;

import org.springframework.web.bind.annotation.*;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import com.distribuido.interfaces.IUsuario;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @PostMapping("/login")
    public String autenticar(@RequestParam String nombre, @RequestParam String password) {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", 1099);
            IUsuario usuario = (IUsuario) registry.lookup("UsuarioService");
            boolean ok = usuario.autenticar(nombre, password);
            return Boolean.toString(ok);
        } catch (Exception e) {
            e.printStackTrace();
            return "false";
        }
    }

    @PostMapping("/registrar")
    public String registrar(@RequestParam String nombre, @RequestParam String password) {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", 1099);
            IUsuario usuario = (IUsuario) registry.lookup("UsuarioService");
            usuario.registrar(nombre, password);
            return "Usuario registrado correctamente";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}