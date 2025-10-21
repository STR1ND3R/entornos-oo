package com.distribuido.servidores;

import com.distribuido.impl.NodoImpl;
import com.distribuido.interfaces.INodo;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

/**
 * Servidor que gestiona el registro y descubrimiento de nodos.
 * Puerto: 1102
 */
public class ServidorNodos {
    public static void main(String[] args) {
        try {
            int port = 1102;
            INodo nodo = new NodoImpl();
            Registry registry = LocateRegistry.createRegistry(port);
            registry.rebind("NodoService", nodo);
            
            System.out.println("═══════════════════════════════════════════════");
            System.out.println("🌐 Servidor de Nodos listo en puerto " + port);
            System.out.println("   Funciones:");
            System.out.println("   - Registro de nodos");
            System.out.println("   - Monitoreo de heartbeat");
            System.out.println("   - Descubrimiento de servicios");
            System.out.println("═══════════════════════════════════════════════");
        } catch (Exception e) {
            System.err.println("❌ Error al iniciar servidor de nodos: " + e.getMessage());
            e.printStackTrace();
        }
    }
}