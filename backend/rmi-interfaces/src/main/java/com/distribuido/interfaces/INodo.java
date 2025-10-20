package com.distribuido.interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

/**
 * Interface para gestionar nodos del sistema distribuido.
 * Permite registro, heartbeat y descubrimiento de servicios.
 */
public interface INodo extends Remote {
    /**
     * Registra un nodo en el sistema
     * @param tipoServicio Tipo de servicio (USUARIO, ARCHIVO, AUDITOR)
     * @param host Dirección del nodo
     * @param puerto Puerto del servicio
     * @return ID único del nodo registrado
     */
    String registrarNodo(String tipoServicio, String host, int puerto) throws RemoteException;
    
    /**
     * Envía señal de vida del nodo
     * @param idNodo ID del nodo
     * @return true si el nodo está activo
     */
    boolean heartbeat(String idNodo) throws RemoteException;
    
    /**
     * Obtiene nodos disponibles por tipo de servicio
     * @param tipoServicio Tipo de servicio
     * @return Lista de direcciones [host:puerto]
     */
    List<String> obtenerNodosDisponibles(String tipoServicio) throws RemoteException;
    
    /**
     * Marca un nodo como caído
     * @param idNodo ID del nodo
     */
    void marcarNodoCaido(String idNodo) throws RemoteException;
    
    /**
     * Obtiene estadísticas del nodo
     * @param idNodo ID del nodo
     * @return JSON con estadísticas (carga CPU, memoria, conexiones)
     */
    String obtenerEstadisticas(String idNodo) throws RemoteException;
}