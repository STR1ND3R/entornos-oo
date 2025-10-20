package com.distribuido.interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

/**
 * Interface para balancear carga entre múltiples nodos.
 * Implementa Round Robin y algoritmo de menor carga.
 */
public interface IBalanceadorCarga extends Remote {
    /**
     * Obtiene siguiente nodo disponible para un servicio (Round Robin)
     * @param tipoServicio Tipo de servicio (USUARIO, ARCHIVO, AUDITOR)
     * @return Dirección del nodo [host:puerto]
     */
    String obtenerSiguienteNodo(String tipoServicio) throws RemoteException;
    
    /**
     * Obtiene nodo con menor carga
     * @param tipoServicio Tipo de servicio
     * @return Dirección del nodo con menor carga
     */
    String obtenerNodoMenorCarga(String tipoServicio) throws RemoteException;
    
    /**
     * Registra métrica de carga para un nodo
     * @param idNodo ID del nodo
     * @param cargaCPU Porcentaje de CPU usado (0-100)
     * @param conexionesActivas Número de conexiones activas
     */
    void registrarCarga(String idNodo, double cargaCPU, int conexionesActivas) throws RemoteException;
    
    /**
     * Obtiene estadísticas de todos los nodos
     * @param tipoServicio Tipo de servicio
     * @return JSON con estadísticas de carga
     */
    String obtenerEstadisticasCarga(String tipoServicio) throws RemoteException;
    
    /**
     * Configura algoritmo de balanceo
     * @param algoritmo ROUND_ROBIN, LEAST_CONNECTIONS, LEAST_LOAD
     */
    void configurarAlgoritmo(String algoritmo) throws RemoteException;
}