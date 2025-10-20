package com.distribuido.interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IAuditor extends Remote {
    void registrarEvento(String usuario, String accion, String recurso) throws RemoteException;
}