package com.distribuido.interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

/**
 * Interface para gestionar seguridad centralizada del sistema.
 * Genera tokens JWT, valida permisos y gestiona sesiones.
 */
public interface IControladorSeguridad extends Remote {
    /**
     * Genera token JWT para usuario autenticado
     * @param usuario Nombre de usuario
     * @param password Contraseña
     * @return Token JWT o null si falla autenticación
     */
    String generarToken(String usuario, String password) throws RemoteException;
    
    /**
     * Valida token JWT
     * @param token Token a validar
     * @return true si el token es válido
     */
    boolean validarToken(String token) throws RemoteException;
    
    /**
     * Extrae usuario del token
     * @param token Token JWT
     * @return Nombre de usuario
     */
    String obtenerUsuarioDeToken(String token) throws RemoteException;
    
    /**
     * Verifica permisos de usuario para una acción
     * @param token Token del usuario
     * @param recurso Recurso a acceder
     * @param accion Acción a realizar (READ, WRITE, DELETE)
     * @return true si tiene permiso
     */
    boolean verificarPermiso(String token, String recurso, String accion) throws RemoteException;
    
    /**
     * Invalida token (logout)
     * @param token Token a invalidar
     */
    void invalidarToken(String token) throws RemoteException;
    
    /**
     * Encripta datos para transmisión segura
     * @param datos Datos a encriptar
     * @return Datos encriptados en Base64
     */
    String encriptarDatos(byte[] datos) throws RemoteException;
    
    /**
     * Desencripta datos recibidos
     * @param datosEncriptados Datos en Base64
     * @return Datos originales
     */
    byte[] desencriptarDatos(String datosEncriptados) throws RemoteException;
}