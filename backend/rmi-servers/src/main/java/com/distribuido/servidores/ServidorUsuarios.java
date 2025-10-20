package com.distribuido.servidores;

import com.distribuido.impl.UsuarioImpl;
import com.distribuido.interfaces.IUsuario;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class ServidorUsuarios {
    public static void main(String[] args) {
        try {
            int port = 1099;
            IUsuario usuario = new UsuarioImpl();
            Registry registry = LocateRegistry.createRegistry(port);
            registry.rebind("UsuarioService", usuario);
            System.out.println("Servidor de usuarios listo en puerto " + port);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}