package com.distribuido.servidores;

import com.distribuido.interfaces.IArchivo;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;
import java.io.*;
import java.rmi.RemoteException;

public class ServidorArchivos {
    public interface IArchivoLocal extends IArchivo {}
    public static class ArchivoImpl extends UnicastRemoteObject implements IArchivo {
        private final String rutaBase = "archivos/";
        public ArchivoImpl() throws RemoteException {
            super();
            new File(rutaBase).mkdirs();
        }
        @Override
        public void subirArchivo(String nombre, byte[] datos) throws RemoteException {
            try (FileOutputStream fos = new FileOutputStream(rutaBase + nombre)) {
                fos.write(datos);
            } catch (IOException e) {
                throw new RemoteException("Error al subir archivo", e);
            }
        }
        @Override
        public byte[] descargarArchivo(String nombre) throws RemoteException {
            try {
                return java.nio.file.Files.readAllBytes(new File(rutaBase + nombre).toPath());
            } catch (IOException e) {
                throw new RemoteException("Error al descargar archivo", e);
            }
        }
    }

    public static void main(String[] args) {
        try {
            int port = 1100;
            ArchivoImpl archivo = new ArchivoImpl();
            Registry registry = LocateRegistry.createRegistry(port);
            registry.rebind("ArchivoService", archivo);
            System.out.println("Servidor de archivos listo en puerto " + port);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}