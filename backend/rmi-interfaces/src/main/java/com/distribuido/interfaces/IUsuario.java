package com.distribuido.interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IUsuario extends Remote {
    boolean autenticar(String nombre, String password) throws RemoteException;
    void registrar(String nombre, String password) throws RemoteException;
}