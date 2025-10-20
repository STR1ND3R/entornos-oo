package com.distribuido.impl;

import com.distribuido.interfaces.IUsuario;
import java.rmi.server.UnicastRemoteObject;
import java.rmi.RemoteException;
import java.util.concurrent.ConcurrentHashMap;

public class UsuarioImpl extends UnicastRemoteObject implements IUsuario {
    private ConcurrentHashMap<String, String> usuarios = new ConcurrentHashMap<>();

    public UsuarioImpl() throws RemoteException {
        super();
        usuarios.put("admin", "1234");
    }

    @Override
    public boolean autenticar(String nombre, String password) throws RemoteException {
        return usuarios.containsKey(nombre) && usuarios.get(nombre).equals(password);
    }

    @Override
    public void registrar(String nombre, String password) throws RemoteException {
        usuarios.put(nombre, password);
        System.out.println("Nuevo usuario registrado: " + nombre);
    }
}