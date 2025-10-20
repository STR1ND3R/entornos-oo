package com.distribuido.interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IArchivo extends Remote {
    void subirArchivo(String nombre, byte[] datos) throws RemoteException;
    byte[] descargarArchivo(String nombre) throws RemoteException;
}