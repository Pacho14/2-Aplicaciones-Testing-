# 🧪 Guía Completa de Testing - Sistema Acuario AR

## Resumen

Tienes **3 formas de testing** sin necesidad de tablet:

1. **Script .bat** → Inicia todo automáticamente
2. **test-api.html** → Interface web interactiva para simular detecciones
3. **test-flow.js** → Script Node.js para automación CLI

---

## 🚀 Opción 1: Script .bat (EL MÁS FÁCIL)

### Uso Rápido

```bash
# Solo doble-click en:
start-all.bat
```

### ¿Qué hace?

```
✅ Verifica Node.js
✅ Inicia API en puerto 3001
✅ Inicia servidor web en puerto 8000
✅ Abre 3 pestañas en navegador:
   • http://localhost:8000/app-ar/          (Scanner AR)
   • http://localhost:8000/app-visualizer/  (Visualizador)
   • http://localhost:8000/test-api.html    (Testing)
```

### Resultado

```
╔════════════════════════════════════════════════════════════════╗
║      🌊 ACUARIO AR - Script de Inicio Automático 🌊           ║
╚════════════════════════════════════════════════════════════════╝

✅ Sistema Iniciado
📋 Servicios activos:
  • API REST:      http://localhost:3001
  • Servidor Web:  http://localhost:8000
  • Scanner AR:    http://localhost:8000/app-ar/
  • Visualizador:  http://localhost:8000/app-visualizer/
  • Testing:       http://localhost:8000/test-api.html
```

---

## 🖥️ Opción 2: test-api.html (INTERFAZ GRÁFICA)

### Acceso

Una vez que `start-all.bat` abre las pestañas, ve a:

```
http://localhost:8000/test-api.html
```

### Funcionalidades

#### 🎯 Simulador de Detecciones

```
Seleccionar Marcador:
- 🐠 Pez (Pez1.glb)
- 🐢 Tortuga (tortuga.glb)
- 🦈 Tiburón (tiburon.glb)

Opciones:
  ✅ Botones individuales: Enviar cada modelo por separado
  ✅ Test automático:      Enviar los 3 modelos en secuencia (2s entre cada uno)
```

#### 📡 Verificar API

```
Click: "📡 Verificar API"

Respuestas:
  ✅ Verde: "API ACTIVA" → Funcionando correctamente
  ❌ Rojo:  "API DESCONECTADA" → Ejecutar: cd api && npm start
```

#### 📊 Estadísticas en Tiempo Real

```
Muestra:
  • Total de modelos enviados
  • Exitosos
  • Fallidos

Se actualiza automáticamente
```

#### 📬 Respuesta del API

```
Muestra en JSON:
  • Últimos datos enviados
  • Historial de modelos
  • Status de API
  • Errores (si los hay)
```

### Flujo Completo de Testing en test-api.html

```
1. Abre test-api.html
   ↓
2. Click "📡 Verificar API"
   ✅ Si verde → Continuar
   ❌ Si rojo → Abrir Terminal: cd api && npm start
   ↓
3. Abre Visualizador en otra pestaña
   http://localhost:8000/app-visualizer/
   ↓
4. En test-api.html, click "▶️ Ejecutar Test"
   Esto envía 3 modelos automáticamente
   ↓
5. En Visualizador, verás:
   • Primer modelo carga en preview
   • Segunda detección actualiza preview
   • Tercera detección actualiza preview
   ↓
6. Haz click "➕ Agregar" en visualizador
   ✅ Modelos aparecen en entorno 3D
   ↓
7. En test-api.html, verás estadísticas:
   • 3 enviados
   • 3 exitosos
   • 0 fallidos
```

---

## 💻 Opción 3: test-flow.js (AUTOMACIÓN CLI)

### Uso

```bash
# Terminal 1: Iniciar API
cd api
npm start

# Terminal 2: Ejecutar test
cd ..
node test-flow.js
```

### Output Esperado

```
ℹ️  [12:34:56] Verificando API...
✅ [12:34:56] API activa (uptime: 5.23s)

ℹ️  [12:34:56] --- PASO 2: Enviando Modelos ---
🔍 [12:34:56] Enviando: 🐠 Pez
✅ [12:34:56] 🐠 Pez enviado correctamente

🔍 [12:34:58] Enviando: 🐢 Tortuga
✅ [12:34:58] 🐢 Tortuga enviado correctamente

🔍 [12:34:59] Enviando: 🦈 Tiburón
✅ [12:34:59] 🦈 Tiburón enviado correctamente

ℹ️  [12:35:01] --- PASO 3: Verificando Último Modelo ---
✅ [12:35:01] Último modelo: tiburon.glb

ℹ️  [12:35:01] --- PASO 4: Verificando Historial ---
✅ [12:35:01] Historial: 3 modelos totales

📋 Últimos modelos:
  1. tiburon.glb (Tiburón) - 12:34:59
  2. tortuga.glb (Tortuga) - 12:34:58
  3. Pez1.glb (Pez) - 12:34:56

╔════════════════════════════════════╗
║        📊 ESTADÍSTICAS FINALES     ║
╚════════════════════════════════════╝

Total enviado:    3
Exitosos:         3
Fallidos:         0
Tasa de éxito:    100.0%

✅ [12:35:02] Testing completado
```

---

## 📋 Testing Paso a Paso (COMPLETO)

### Setup Inicial

```bash
# Terminal 1
cd ACUARIO\api
npm install  # Primera vez solo
npm start

# Verás:
# ╔════════════════════════════════════╗
# ║     🌊 ACUARIO API REST INICIADA 🌊║
# ╚════════════════════════════════════╝
# 📡 http://localhost:3001
```

### Opción A: Con start-all.bat (RECOMENDADO)

```bash
# Terminal nueva
cd ACUARIO
start-all.bat

# Se abrirán 3 pestañas automáticamente
# En una de ellas está test-api.html
```

### Opción B: Manual

```bash
# Terminal nueva
cd ACUARIO
python -m http.server 8000

# Luego abre en navegador:
# http://localhost:8000/test-api.html
```

### Opción C: Node.js

```bash
# Terminal nueva (en ACUARIO)
node test-flow.js

# Verá automáticamente el flujo completo
```

---

## ✅ Checklist: Verificar que Todo Funciona

### 1️⃣ API Activa

```bash
# Terminal
curl http://localhost:3001/api/health

# Debe retornar:
# {
#   "success": true,
#   "status": "API activa",
#   ...
# }
```

✅ Si ves JSON → API activa
❌ Si error → Ejecutar: cd api && npm start

### 2️⃣ Servidor Web Activo

```bash
# En navegador
http://localhost:8000/

# Debe listar archivos/carpetas
```

✅ Si ves archivo listing → Servidor activo
❌ Si error → Ejecutar: python -m http.server 8000

### 3️⃣ test-api.html Abre

```bash
http://localhost:8000/test-api.html
```

✅ Si ves interface colorida → Listo
❌ Si error 404 → Asegurar que test-api.html está en ACUARIO/

### 4️⃣ Simulación Funciona

En test-api.html:
1. Click "📡 Verificar API"
   - Debe decir "✅ API ACTIVA"

2. Click "🐠 Enviar Pez"
   - Debe mostrar en Estadísticas: 1 enviado, 1 exitoso

✅ Si funciona → Sistema 100% operativo

### 5️⃣ Visualizador Recibe

Abre en otra pestaña:
```
http://localhost:8000/app-visualizer/
```

En test-api.html, click "▶️ Ejecutar Test"

En Visualizador:
- Debe aparecer modelo en preview
- Debe haber 3 entradas en historial

✅ Si funciona → Polling API trabajando correctamente

---

## 🐛 Troubleshooting

### "API desconectada" en test-api.html

```bash
# Verificar API está corriendo
curl http://localhost:3001/api/health

# Si falla, ejecutar:
cd api
npm install
npm start
```

### "No puedo cargar test-api.html"

```bash
# Verificar servidor web
curl http://localhost:8000/

# Si falla, ejecutar (en ACUARIO/):
python -m http.server 8000
# o
npx http-server --port 8000
```

### "Envío exitoso pero Visualizador no actualiza"

```
Verificar:
1. Visualizador está abierto: http://localhost:8000/app-visualizer/
2. Consola (F12) muestra "GET /api/latest-model" cada 2 segundos
3. API retorna datos: http://localhost:3001/api/latest-model
```

### "¿Cómo detener todo?"

```bash
# Cerrar all.bat y las terminales
# O:

# Terminal 1 (API): Ctrl+C
# Terminal 2 (Web): Ctrl+C
```

---

## 📊 Equivalencia: Testing CLI vs Web

| Acción | test-flow.js | test-api.html |
|--------|-------------|-------------|
| Verificar API | Automático | Click "📡 Verificar API" |
| Enviar 1 modelo | Auto (3) | Click "🐠 Enviar Pez" |
| Enviar 3 modelos | Auto | Click "▶️ Ejecutar Test" |
| Ver último | Muestra en console | Click "🔄 Obtener Último" |
| Ver historial | Muestra en console | Click "📜 Ver Historial" |
| Estadísticas | Mostrador final | Actualiza en tiempo real |

---

## 🎯 Recomendación Final

### Para Testing Rápido:
```bash
double-click start-all.bat
# Automáticamente abre todo
# Usa test-api.html para probar
```

### Para Testing Automatizado:
```bash
cd api && npm start
# (dejar corriendo en background)

node test-flow.js
# Ve los resultados en console
```

### Para Testing Interactivo:
```bash
Abre test-api.html
Click botones según necesites
Ver resultados en tiempo real
```

---

**¡Ahora puedes testear todo sin tablet!** 🎉
