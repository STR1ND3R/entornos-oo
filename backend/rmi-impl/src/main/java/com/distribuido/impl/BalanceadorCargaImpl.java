package com.distribuido.impl;

import com.distribuido.interfaces.IBalanceadorCarga;
import com.distribuido.interfaces.INodo;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class BalanceadorCargaImpl extends UnicastRemoteObject implements IBalanceadorCarga {
    
    // Contadores Round Robin por tipo de servicio
    private ConcurrentHashMap<String, AtomicInteger> contadoresRR = new ConcurrentHashMap<>();
    
    // Métricas de carga: {idNodo -> CargaInfo}
    private ConcurrentHashMap<String, CargaInfo> metricasCarga = new ConcurrentHashMap<>();
    
    // Algoritmo actual (por defecto Round Robin)
    private String algoritmoActual = "ROUND_ROBIN";
    
    // Puerto del servicio de nodos
    private static final int PUERTO_NODOS = 1102;
    
    public BalanceadorCargaImpl() throws RemoteException {
        super();
    }
    
    @Override
    public String obtenerSiguienteNodo(String tipoServicio) throws RemoteException {
        try {
            switch (algoritmoActual) {
                case "LEAST_CONNECTIONS":
                    return obtenerNodoMenorConexiones(tipoServicio);
                case "LEAST_LOAD":
                    return obtenerNodoMenorCarga(tipoServicio);
                default:
                    return obtenerNodoRoundRobin(tipoServicio);
            }
        } catch (Exception e) {
            throw new RemoteException("Error obteniendo siguiente nodo", e);
        }
    }
    
    /**
     * Implementación Round Robin
     */
    private String obtenerNodoRoundRobin(String tipoServicio) throws Exception {
        Registry registry = LocateRegistry.getRegistry("localhost", PUERTO_NODOS);
        INodo servicioNodos = (INodo) registry.lookup("NodoService");
        
        List<String> nodosDisponibles = servicioNodos.obtenerNodosDisponibles(tipoServicio);
        
        if (nodosDisponibles.isEmpty()) {
            throw new RemoteException("No hay nodos disponibles para " + tipoServicio);
        }
        
        // Obtener contador y incrementar
        AtomicInteger contador = contadoresRR.computeIfAbsent(tipoServicio, k -> new AtomicInteger(0));
        int indice = contador.getAndIncrement() % nodosDisponibles.size();
        
        return nodosDisponibles.get(indice);
    }
    
    @Override
    public String obtenerNodoMenorCarga(String tipoServicio) throws RemoteException {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", PUERTO_NODOS);
            INodo servicioNodos = (INodo) registry.lookup("NodoService");
            
            List<String> nodosDisponibles = servicioNodos.obtenerNodosDisponibles(tipoServicio);
            
            if (nodosDisponibles.isEmpty()) {
                throw new RemoteException("No hay nodos disponibles para " + tipoServicio);
            }
            
            // Buscar nodo con menor carga
            String mejorNodo = null;
            double menorCarga = Double.MAX_VALUE;
            
            for (String nodo : nodosDisponibles) {
                CargaInfo info = metricasCarga.get(nodo);
                if (info != null && info.cargaCPU < menorCarga) {
                    menorCarga = info.cargaCPU;
                    mejorNodo = nodo;
                }
            }
            
            // Si no hay métricas, usar el primero
            return mejorNodo != null ? mejorNodo : nodosDisponibles.get(0);
            
        } catch (Exception e) {
            throw new RemoteException("Error obteniendo nodo con menor carga", e);
        }
    }
    
    /**
     * Obtiene nodo con menor número de conexiones
     */
    private String obtenerNodoMenorConexiones(String tipoServicio) throws Exception {
        Registry registry = LocateRegistry.getRegistry("localhost", PUERTO_NODOS);
        INodo servicioNodos = (INodo) registry.lookup("NodoService");
        
        List<String> nodosDisponibles = servicioNodos.obtenerNodosDisponibles(tipoServicio);
        
        if (nodosDisponibles.isEmpty()) {
            throw new RemoteException("No hay nodos disponibles para " + tipoServicio);
        }
        
        String mejorNodo = null;
        int menorConexiones = Integer.MAX_VALUE;
        
        for (String nodo : nodosDisponibles) {
            CargaInfo info = metricasCarga.get(nodo);
            if (info != null && info.conexionesActivas < menorConexiones) {
                menorConexiones = info.conexionesActivas;
                mejorNodo = nodo;
            }
        }
        
        return mejorNodo != null ? mejorNodo : nodosDisponibles.get(0);
    }
    
    @Override
    public void registrarCarga(String idNodo, double cargaCPU, int conexionesActivas) throws RemoteException {
        CargaInfo info = metricasCarga.computeIfAbsent(idNodo, k -> new CargaInfo());
        info.cargaCPU = cargaCPU;
        info.conexionesActivas = conexionesActivas;
        info.ultimaActualizacion = System.currentTimeMillis();
    }
    
    @Override
    public String obtenerEstadisticasCarga(String tipoServicio) throws RemoteException {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", PUERTO_NODOS);
            INodo servicioNodos = (INodo) registry.lookup("NodoService");
            
            List<String> nodos = servicioNodos.obtenerNodosDisponibles(tipoServicio);
            StringBuilder json = new StringBuilder("[");
            
            for (int i = 0; i < nodos.size(); i++) {
                String nodo = nodos.get(i);
                CargaInfo info = metricasCarga.get(nodo);
                
                if (info != null) {
                    json.append(String.format(
                        "{\"nodo\":\"%s\",\"cpu\":%.2f,\"conexiones\":%d}",
                        nodo, info.cargaCPU, info.conexionesActivas
                    ));
                    
                    if (i < nodos.size() - 1) {
                        json.append(",");
                    }
                }
            }
            
            json.append("]");
            return json.toString();
            
        } catch (Exception e) {
            throw new RemoteException("Error obteniendo estadísticas", e);
        }
    }
    
    @Override
    public void configurarAlgoritmo(String algoritmo) throws RemoteException {
        if (algoritmo.equals("ROUND_ROBIN") || 
            algoritmo.equals("LEAST_CONNECTIONS") || 
            algoritmo.equals("LEAST_LOAD")) {
            this.algoritmoActual = algoritmo;
            System.out.println("⚙️ Algoritmo de balanceo configurado: " + algoritmo);
        } else {
            throw new RemoteException("Algoritmo no soportado: " + algoritmo);
        }
    }
    
    // Clase interna para métricas de carga
    private static class CargaInfo {
        double cargaCPU = 0.0;
        int conexionesActivas = 0;
        long ultimaActualizacion = System.currentTimeMillis();
    }
}