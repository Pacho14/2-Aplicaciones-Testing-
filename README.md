# 🌊 Sistema Acuario AR - Arquitectura Modular

Sistema dividido en **3 aplicaciones independientes** conectadas por una **API REST**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    📡 API REST (Node.js/Express)                │
│                     http://localhost:3001                        │
├──────────────────────┬──────────────────┬───────────────────────┤
│   🎯 Scanner AR      │                  │  🌊 Visualizador 3D   │
│  (MindAR Detection)  │                  │  (Three.js Preview)   │
│  - Detecta marcador  │   POST/GET APIs  │  - Consulta API       │
│  - Envía a API REST  │                  │  - Carga y muestra    │
│  - No lógica 3D      │                  │  - Múltiples copias   │
└──────────────────────┴──────────────────┴───────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
ACUARIO/
├── api/                              # 🔌 API REST
│   ├── server.js                    # Servidor Express
│   └── package.json                 # Dependencias Node.js
│
├── app-ar/                          # 🎯 Scanner AR
│   └── index.html                   # Interface de detección
│
├── app-visualizer/                  # 🌊 Visualizador 3D
│   └── index.html                   # Interface 3D
│
├── Pez1.glb                         # Modelos 3D (en raíz)
├── tortuga.glb
├── tiburon.glb
│
└── targets.mind                     # Marcadores MindAR (generado)
```

---

## 🚀 Instalación y Uso

### Paso 1: Instalar dependencias de la API

```bash
cd api
npm install
```

### Paso 2: Generar marcadores MindAR

1. Ir a https://www.mindappadmin.com/
2. Crear cuenta y cargar imágenes de referencia:
   - Una imagen del pez (ej: "pez.png")
   - Una imagen de la tortuga (ej: "tortuga.png")
   - Una imagen del tiburón (ej: "tiburon.png")
3. Descargar el archivo `targets.mind` generado
4. Colocar en la carpeta raíz (junto a `app-ar/` y `api/`)

> **Alternativas si no tenemos imágenes:**
> - Usar las imágenes que ya existen en `/assets/example_mv_images/`
> - O cargar screenshots de modelos 3D especiales

### Paso 3: Obtener/Crear archivos GLB

Los modelos deben estar en la raíz (`ACUARIO/`):
- `Pez1.glb`
- `tortuga.glb`
- `tiburon.glb`

Puedes usar:
- Modelos existentes en `Hunyuan3D-2/assets/example_images/`
- O descargarlos de https://sketchfab.com/ (buscar "GLB free")

### Paso 4: Iniciar la API

```bash
cd api
npm start
```

Output esperado:
```
╔════════════════════════════════════════╗
║     🌊 ACUARIO API REST INICIADA 🌊    ║
╚════════════════════════════════════════╝

  📡 http://localhost:3001
```

### Paso 5: Abrir las aplicaciones

En el navegador:

1. **Scanner AR**: http://localhost/app-ar/index.html
   - O abre directamente el archivo: `file:///C:/Users/Pacho/Documents/ACUARIO/app-ar/index.html`

2. **Visualizador 3D**: http://localhost/app-visualizer/index.html
   - O abre directamente el archivo: `file:///C:/Users/Pacho/Documents/ACUARIO/app-visualizer/index.html`

---

## 📡 API REST - Endpoints

### `POST /api/send-model`
Envía un modelo detectado del Scanner AR

**Request:**
```json
{
  "name": "Pez1.glb",
  "path": "Pez1.glb",
  "markerName": "Pez"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Modelo recibido correctamente",
  "data": {
    "id": 1711270800000,
    "name": "Pez1.glb",
    "path": "Pez1.glb",
    "markerName": "Pez",
    "timestamp": "2026-03-24T10:00:00.000Z"
  }
}
```

---

### `GET /api/latest-model`
Obtiene el último modelo enviado

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1711270800000,
    "name": "Pez1.glb",
    "path": "Pez1.glb",
    "markerName": "Pez",
    "timestamp": "2026-03-24T10:00:00.000Z"
  }
}
```

---

### `GET /api/history`
Obtiene historial de modelos (últimos 10 por defecto)

**Query Parameters:**
- `limit` (opcional): número de registros a devolver (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 25
}
```

---

### `GET /api/health`
Verifica que el servidor está activo

**Response:**
```json
{
  "success": true,
  "status": "API activa",
  "uptime": 123.456,
  "timestamp": "2026-03-24T10:00:00.000Z"
}
```

---

## 🎯 Flujo de Funcionamiento

### 1️⃣ **Scanner AR Detecta Marcador**
```
Usuario apunta cámara → MindAR detecta → Identifica marcador → 
Obtiene ruta del modelo → POST /api/send-model
```

### 2️⃣ **API Almacena en Memoria**
```
Recibe POST → Guarda en latestModel → Mantiene historial
```

### 3️⃣ **Visualizador Consulta API**
```
Cada 2 segundos → GET /api/latest-model → 
Si es nuevo → Carga en preview → Usuario vê el modelo
```

### 4️⃣ **Usuario Agrega al Entorno**
```
Click "Agregar" → Clona modelo → Posición aleatoria → 
Rota automáticamente → Múltiples copias posibles
```

---

## 🔧 Configuración

### En `app-ar/index.html`

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
const SEND_COOLDOWN = 3000; // Esperar 3s entre envíos

// Mapeo de marcadores a modelos
const MARKERS_CONFIG = {
    0: { name: 'Pez', model: 'Pez1.glb', icon: '🐠' },
    1: { name: 'Tortuga', model: 'tortuga.glb', icon: '🐢' },
    2: { name: 'Tiburón', model: 'tiburon.glb', icon: '🦈' }
};
```

### En `app-visualizer/index.html`

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
const MODELS_PATH = '../';        // Ruta a modelos GLB
const POLL_INTERVAL = 2000;       // Consultar API cada 2s
```

---

## 🎨 Features

### ✅ Scanner AR
- ✔️ Detección automática de múltiples marcadores
- ✔️ Interfaz limpia y minimalista
- ✔️ Display de FPS en tiempo real
- ✔️ Indicador de estado (detectado/escaneando)
- ✔️ Envío automático a API sin lógica 3D
- ✔️ Soporte para múltiples iconos emoji

### ✅ Visualizador 3D
- ✔️ Preview 3D automático del modelo detectado
- ✔️ Rotación automática en preview
- ✔️ Entorno 3D principal con grid
- ✔️ Controles OrbitControls (ratón)
- ✔️ Agregar múltiples instancias
- ✔️ Posición y rotación aleatoria
- ✔️ Historial de modelos detallado
- ✔️ Botón limpiar entorno

### ✅ API REST
- ✔️ Almacenamiento en memoria (escalable a BD)
- ✔️ Historial de hasta 50 modelos
- ✔️ CORS habilitado
- ✔️ Health checks
- ✔️ Respuestas JSON estándar

---

## 🔮 Próximas Mejoras (Roadmap)

### Fase 2: Persistencia
- [ ] MongoDB o SQLite para guardar historial
- [ ] Estadísticas de uso (modelos más detectados, etc)

### Fase 3: WebSocket
- [ ] Comunicación en tiempo real (en lugar de polling)
- [ ] Múltiples usuarios simultáneos
- [ ] Broadcasting de detecciones

### Fase 4: Firebase
- [ ] Authentication de usuarios
- [ ] Storage de archivos GLB
- [ ] Hosting en Firebase Hosting

### Fase 5: Mobile
- [ ] App React Native
- [ ] AR con ARCore/ARKit nativo
- [ ] Sincronización cross-platform

---

## 📝 Solución de Problemas

### "API desconectada"
- ✅ Verificar que `npm start` se ejecutó en `/api`
- ✅ Verificar que puerto 3001 no está en uso: `netstat -ano | findstr :3001`
- ✅ Revisar consola del terminal API para errores

### "Modelo no aparece en preview"
- ✅ Verificar que archivo `.glb` existe en carpeta raíz
- ✅ Verificar ruta en `MARKERS_CONFIG`
- ✅ Abrir DevTools (F12) → Console para ver errores de carga

### "MindAR no detecta"
- ✅ Verificar que `targets.mind` está en la carpeta raíz
- ✅ Asegurarse de que las imágenes de referencia tienen contraste alto
- ✅ Probar con imagen física bajo buena iluminación

### "El ratón no rota la vista 3D"
- ✅ Hacer click en el canvas del entorno ANTES de usar el ratón
- ✅ Click izq = rotación, Click der = pan, Scroll = zoom

---

## 📊 Monitoreo

### Ver logs de la API
```bash
# Terminal donde ejecutaste `npm start`
# Verás logs como:
✅ Modelo recibido: Pez1.glb (Pez)
```

### Comprobar estado
```bash
curl http://localhost:3001/api/health
```

### Ver último modelo
```bash
curl http://localhost:3001/api/latest-model
```

### Ver historial
```bash
curl "http://localhost:3001/api/history?limit=5"
```

---

## 🎓 Apuntes Técnicos

### Arquitectura de Comunicación

```
        CLIENTE                         SERVIDOR
    (Navegador)                         (API)
    
  Scanner AR                        Express Server
      │                                  │
      ├─ Inicializa MindAR ────────────┐ │
      │                                 │ │
      ├─ Escucha eventos de detección  │ │
      │                                 │ │
      ├─ Al detectar → POST ────────────►│
      │                                 │ │ recv json
      │                                 │ │ update
      │                                 │ │ latestModel
      │                                 │ │
      │◄─────────┐ GET last model ◄────┤ │
      │          │                      │ │
  Visualizador   │ (cada 2s)            │ │
      │          │                      │ │ send json
      └──────────┘                      │ │
      
      * Sin Database = Solo memoria RAM
      * Escalable: Add Redis, MongoDB, Firebase
```

### Por qué esta arquitectura:

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Acoplamiento | Alto (todo en un HTML) | Bajo (3 apps independientes) |
| Escalabilidad | Difícil | Fácil (añadir workers, load balancer) |
| Mantenimiento | Complejo | Simple (cada app bajo 200 líneas JS) |
| Testing | Imposible | Fácil (curl de endpoints) |
| Deploy | Monolítico | Microservicios |

---

## 📄 Licencia

MIT - Libre para usar y modificar

---

## 🤝 Contribuciones

Este sistema está diseñado para ser modular y escalable. Para agregar features:

1. Entender el flujo API (POST request, GET response)
2. Modificar solo la sección relevante (Scanner/Visualizador/API)
3. Checkear con `curl` que los endpoints devuelven correctamente

---

**Creado:** Mar 24, 2026  
**Versión:** 1.0.0 - Sistema Modular Inicial  
**Status:** ✅ Funcional y Escalable
