@echo off
REM 🌊 Script de Inicio - Sistema Acuario AR
REM Inicia automáticamente: API + Servidor Web + Abre Navegadores

chcp 65001 >nul
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║      🌊 ACUARIO AR - Script de Inicio Automático 🌊           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM ==================== VERIFICAR DEPENDENCIAS ====================
echo 📋 Verificando dependencias...
echo.

where node >nul 2>nul
if errorlevel 1 (
    color 0C
    echo ❌ ERROR: Node.js no está instalado
    echo.
    echo Descargalo en: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js detectado
)

where python >nul 2>nul
if errorlevel 1 (
    echo ⚠️  Python no encontrado (usaremos Node.js http-server)
) else (
    echo ✅ Python detectado
)

echo.
echo ==================== INICIANDO SERVICIOS ====================
echo.

REM ==================== OBTENER RUTAS ====================
set SCRIPT_DIR=%~dp0
set API_DIR=%SCRIPT_DIR%api
set WEB_DIR=%SCRIPT_DIR%

REM ==================== TERMINAL 1: API ====================
echo 🚀 Iniciando API REST en puerto 3001...
start /d "%API_DIR%" /B cmd /k "npm start"
timeout /t 2 >nul

REM ==================== TERMINAL 2: SERVIDOR WEB ====================
echo 🌐 Iniciando servidor web en puerto 8000...
REM Cambiar a la carpeta ACUARIO para servir desde aquí
start /B cmd /k "cd /d \"%WEB_DIR%\" && python -m http.server 8000"
timeout /t 3 >nul

REM ==================== OBTENER IP LOCAL ====================
echo.
echo 📡 Detectando dirección IP local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R "IPv4"') do (
    set IP=%%a
)
set IP=%IP: =%
echo IP Local: %IP%:8000
echo.

REM ==================== ABRIR NAVEGADORES ====================
echo 🌐 Abriendo aplicaciones en navegador...
echo.

timeout /t 2 >nul

echo ✅ Scanner AR:      http://localhost:8000/app-ar/
start "" "http://localhost:8000/app-ar/"

timeout /t 1 >nul

echo ✅ Visualizador:    http://localhost:8000/app-visualizer/
start "" "http://localhost:8000/app-visualizer/"

timeout /t 1 >nul

echo ✅ Testing:         http://localhost:8000/test-api.html
start "" "http://localhost:8000/test-api.html"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ SISTEMA INICIADO                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📋 Servicios activos:
echo   • API REST:      http://localhost:3001
echo   • Servidor Web:  http://localhost:8000
echo   • Scanner AR:    http://localhost:8000/app-ar/
echo   • Visualizador:  http://localhost:8000/app-visualizer/
echo   • Testing:       http://localhost:8000/test-api.html
echo.
echo 💡 Tip: Abre test-api.html para simular detecciones
echo         sin necesidad de tablet
echo.
echo 📖 Documentación: README.md, QUICKSTART.md
echo.
echo ⏹️  Para detener, cierra estas ventanas de Terminal
echo.
pause
