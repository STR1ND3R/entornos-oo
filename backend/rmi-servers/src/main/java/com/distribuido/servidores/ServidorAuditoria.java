package com.distribuido.servidores;

import com.distribuido.interfaces.IAuditor;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;
import java.rmi.RemoteException;
import java.io.FileWriter;
import java.io.IOException;

public class ServidorAuditoria {
    public static class AuditorImpl extends UnicastRemoteObject implements IAuditor {
        public AuditorImpl() throws RemoteException { super(); }
        @Override
        public synchronized void registrarEvento(String usuario, String accion, String recurso) throws RemoteException {
            try (FileWriter fw = new FileWriter("auditoria.log", true)) {
                fw.write(usuario + " -> " + accion + " en " + recurso + "\n");
            } catch (IOException e) {
                throw new RemoteException("Error en auditoría", e);
            }
        }
    }

    public static void main(String[] args) {
        try {
            int port = 1101;
            AuditorImpl auditor = new AuditorImpl();
            Registry registry = LocateRegistry.createRegistry(port);
            registry.rebind("AuditorService", auditor);
            System.out.println("Servidor de auditoría listo en puerto " + port);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}