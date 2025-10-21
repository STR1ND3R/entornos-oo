package com.distribuido.servidores;

import com.distribuido.impl.ControladorSeguridadImpl;
import com.distribuido.interfaces.IControladorSeguridad;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

/**
 * Servidor que gestiona autenticación, autorización y encriptación.
 * Puerto: 1103
 */
public class ServidorSeguridad {
    public static void main(String[] args) {
        try {
            int port = 1103;
            IControladorSeguridad seguridad = new ControladorSeguridadImpl();
            Registry registry = LocateRegistry.createRegistry(port);
            registry.rebind("SeguridadService", seguridad);
            
            System.out.println("═══════════════════════════════════════════════");
            System.out.println("🔐 Servidor de Seguridad listo en puerto " + port);
            System.out.println("   Funciones:");
            System.out.println("   - Generación y validación de tokens JWT");
            System.out.println("   - Verificación de permisos");
            System.out.println("   - Encriptación AES de datos");
            System.out.println("═══════════════════════════════════════════════");
        } catch (Exception e) {
            System.err.println("❌ Error al iniciar servidor de seguridad: " + e.getMessage());
            e.printStackTrace();
        }
    }
}