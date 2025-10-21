package com.distribuido.servidores;

import com.distribuido.impl.BalanceadorCargaImpl;
import com.distribuido.interfaces.IBalanceadorCarga;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

/**
 * Servidor que balancea carga entre múltiples nodos.
 * Puerto: 1104
 */
public class ServidorBalanceador {
    public static void main(String[] args) {
        try {
            int port = 1104;
            IBalanceadorCarga balanceador = new BalanceadorCargaImpl();
            Registry registry = LocateRegistry.createRegistry(port);
            registry.rebind("BalanceadorService", balanceador);
            
            System.out.println("═══════════════════════════════════════════════");
            System.out.println("⚖️ Servidor de Balanceador listo en puerto " + port);
            System.out.println("   Algoritmos disponibles:");
            System.out.println("   - ROUND_ROBIN (por defecto)");
            System.out.println("   - LEAST_CONNECTIONS");
            System.out.println("   - LEAST_LOAD");
            System.out.println("═══════════════════════════════════════════════");
        } catch (Exception e) {
            System.err.println("❌ Error al iniciar servidor balanceador: " + e.getMessage());
            e.printStackTrace();
        }
    }
}