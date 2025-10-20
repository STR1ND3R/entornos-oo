package com.distribuido.impl;

import com.distribuido.interfaces.INodo;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class NodoImpl extends UnicastRemoteObject implements INodo {
    
    // Estructura: {idNodo -> {tipo, host, puerto, ultimoHeartbeat, activo}}
    private ConcurrentHashMap<String, NodoInfo> nodos = new ConcurrentHashMap<>();
    
    // Índice por tipo de servicio: {tipoServicio -> [idNodo1, idNodo2, ...]}
    private ConcurrentHashMap<String, List<String>> indiceServicios = new ConcurrentHashMap<>();
    
    private static final long TIMEOUT_HEARTBEAT = 30000; // 30 segundos
    
    public NodoImpl() throws RemoteException {
        super();
        iniciarMonitorHeartbeat();
    }
    
    @Override
    public String registrarNodo(String tipoServicio, String host, int puerto) throws RemoteException {
        String idNodo = UUID.randomUUID().toString();
        NodoInfo info = new NodoInfo(tipoServicio, host, puerto);
        nodos.put(idNodo, info);
        
        // Actualizar índice de servicios
        indiceServicios.computeIfAbsent(tipoServicio, k -> new ArrayList<>()).add(idNodo);
        
        System.out.println("✅ Nodo registrado: " + idNodo + " (" + tipoServicio + " en " + host + ":" + puerto + ")");
        return idNodo;
    }
    
    @Override
    public boolean heartbeat(String idNodo) throws RemoteException {
        NodoInfo info = nodos.get(idNodo);
        if (info != null) {
            info.actualizarHeartbeat();
            info.activo = true;
            return true;
        }
        return false;
    }
    
    @Override
    public List<String> obtenerNodosDisponibles(String tipoServicio) throws RemoteException {
        List<String> disponibles = new ArrayList<>();
        List<String> nodosDelTipo = indiceServicios.get(tipoServicio);
        
        if (nodosDelTipo != null) {
            for (String idNodo : nodosDelTipo) {
                NodoInfo info = nodos.get(idNodo);
                if (info != null && info.activo) {
                    disponibles.add(info.host + ":" + info.puerto);
                }
            }
        }
        return disponibles;
    }
    
    @Override
    public void marcarNodoCaido(String idNodo) throws RemoteException {
        NodoInfo info = nodos.get(idNodo);
        if (info != null) {
            info.activo = false;
            System.out.println("⚠️ Nodo marcado como caído: " + idNodo);
        }
    }
    
    @Override
    public String obtenerEstadisticas(String idNodo) throws RemoteException {
        NodoInfo info = nodos.get(idNodo);
        if (info != null) {
            return String.format(
                "{\"id\":\"%s\",\"tipo\":\"%s\",\"host\":\"%s\",\"puerto\":%d,\"activo\":%b,\"ultimoHeartbeat\":%d}",
                idNodo, info.tipoServicio, info.host, info.puerto, info.activo, info.ultimoHeartbeat
            );
        }
        return "{}";
    }
    
    /**
     * Monitorea heartbeats y marca nodos caídos
     */
    private void iniciarMonitorHeartbeat() {
        Thread monitor = new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(10000); // Revisar cada 10 segundos
                    long ahora = System.currentTimeMillis();
                    
                    for (Map.Entry<String, NodoInfo> entry : nodos.entrySet()) {
                        NodoInfo info = entry.getValue();
                        if (ahora - info.ultimoHeartbeat > TIMEOUT_HEARTBEAT && info.activo) {
                            info.activo = false;
                            System.out.println("💀 Nodo sin heartbeat detectado: " + entry.getKey());
                        }
                    }
                } catch (InterruptedException e) {
                    break;
                }
            }
        });
        monitor.setDaemon(true);
        monitor.start();
    }
    
    // Clase interna para información de nodos
    private static class NodoInfo {
        String tipoServicio;
        String host;
        int puerto;
        long ultimoHeartbeat;
        boolean activo;
        
        NodoInfo(String tipoServicio, String host, int puerto) {
            this.tipoServicio = tipoServicio;
            this.host = host;
            this.puerto = puerto;
            this.ultimoHeartbeat = System.currentTimeMillis();
            this.activo = true;
        }
        
        void actualizarHeartbeat() {
            this.ultimoHeartbeat = System.currentTimeMillis();
        }
    }
}