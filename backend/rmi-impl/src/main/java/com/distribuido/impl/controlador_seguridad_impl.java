package com.distribuido.impl;

import com.distribuido.interfaces.IControladorSeguridad;
import com.distribuido.interfaces.IUsuario;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

public class ControladorSeguridadImpl extends UnicastRemoteObject implements IControladorSeguridad {
    
    // Tokens activos: {token -> {usuario, timestamp, permisos}}
    private ConcurrentHashMap<String, TokenInfo> tokensActivos = new ConcurrentHashMap<>();
    
    // Permisos por usuario: {usuario -> [permiso1, permiso2, ...]}
    private ConcurrentHashMap<String, Set<String>> permisosPorUsuario = new ConcurrentHashMap<>();
    
    private static final long TOKEN_TIMEOUT = 3600000; // 1 hora
    private static final String SECRET_KEY = "MiClaveSecreta16"; // 16 bytes para AES
    
    public ControladorSeguridadImpl() throws RemoteException {
        super();
        inicializarPermisos();
        iniciarLimpiezaTokens();
    }
    
    @Override
    public String generarToken(String usuario, String password) throws RemoteException {
        try {
            // Validar credenciales contra servidor de usuarios
            Registry registry = LocateRegistry.getRegistry("localhost", 1099);
            IUsuario servicioUsuario = (IUsuario) registry.lookup("UsuarioService");
            
            if (!servicioUsuario.autenticar(usuario, password)) {
                return null;
            }
            
            // Generar token JWT simplificado
            String token = UUID.randomUUID().toString() + "." + usuario + "." + System.currentTimeMillis();
            String tokenEncoded = Base64.getEncoder().encodeToString(token.getBytes());
            
            // Guardar token activo
            TokenInfo info = new TokenInfo(usuario, System.currentTimeMillis());
            tokensActivos.put(tokenEncoded, info);
            
            System.out.println("🔑 Token generado para usuario: " + usuario);
            return tokenEncoded;
            
        } catch (Exception e) {
            throw new RemoteException("Error generando token", e);
        }
    }
    
    @Override
    public boolean validarToken(String token) throws RemoteException {
        TokenInfo info = tokensActivos.get(token);
        if (info == null) {
            return false;
        }
        
        // Verificar si expiró
        long ahora = System.currentTimeMillis();
        if (ahora - info.timestamp > TOKEN_TIMEOUT) {
            tokensActivos.remove(token);
            return false;
        }
        
        return true;
    }
    
    @Override
    public String obtenerUsuarioDeToken(String token) throws RemoteException {
        TokenInfo info = tokensActivos.get(token);
        return info != null ? info.usuario : null;
    }
    
    @Override
    public boolean verificarPermiso(String token, String recurso, String accion) throws RemoteException {
        if (!validarToken(token)) {
            return false;
        }
        
        String usuario = obtenerUsuarioDeToken(token);
        Set<String> permisos = permisosPorUsuario.get(usuario);
        
        if (permisos == null) {
            return false;
        }
        
        String permisoRequerido = recurso + ":" + accion;
        return permisos.contains("*:*") || permisos.contains(recurso + ":*") || permisos.contains(permisoRequerido);
    }
    
    @Override
    public void invalidarToken(String token) throws RemoteException {
        tokensActivos.remove(token);
        System.out.println("🚪 Token invalidado (logout)");
    }
    
    @Override
    public String encriptarDatos(byte[] datos) throws RemoteException {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(datos);
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RemoteException("Error encriptando datos", e);
        }
    }
    
    @Override
    public byte[] desencriptarDatos(String datosEncriptados) throws RemoteException {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decoded = Base64.getDecoder().decode(datosEncriptados);
            return cipher.doFinal(decoded);
        } catch (Exception e) {
            throw new RemoteException("Error desencriptando datos", e);
        }
    }
    
    /**
     * Inicializa permisos por defecto
     */
    private void inicializarPermisos() {
        // Admin tiene todos los permisos
        Set<String> permisosAdmin = new HashSet<>();
        permisosAdmin.add("*:*");
        permisosPorUsuario.put("admin", permisosAdmin);
        
        // Usuario normal solo puede leer archivos propios
        Set<String> permisosUsuario = new HashSet<>();
        permisosUsuario.add("archivo:READ");
        permisosUsuario.add("archivo:WRITE");
        permisosPorUsuario.put("default", permisosUsuario);
    }
    
    /**
     * Limpia tokens expirados periódicamente
     */
    private void iniciarLimpiezaTokens() {
        Thread limpiador = new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(300000); // Cada 5 minutos
                    long ahora = System.currentTimeMillis();
                    
                    tokensActivos.entrySet().removeIf(entry -> 
                        ahora - entry.getValue().timestamp > TOKEN_TIMEOUT
                    );
                    
                } catch (InterruptedException e) {
                    break;
                }
            }
        });
        limpiador.setDaemon(true);
        limpiador.start();
    }
    
    // Clase interna para información de tokens
    private static class TokenInfo {
        String usuario;
        long timestamp;
        
        TokenInfo(String usuario, long timestamp) {
            this.usuario = usuario;
            this.timestamp = timestamp;
        }
    }
}