/**
 * 🧪 Script de Testing Automático - Acuario AR
 * 
 * Uso:
 * node test-flow.js
 * 
 * Simula detecciones del Scanner AR y verifica
 * que todo el flujo funciona correctamente
 */

const http = require('http');

const API_BASE_URL = 'http://localhost:3001/api';

const MODELS_CONFIG = {
    0: { name: 'Pez', model: 'Pez1.glb', icon: '🐠' },
    1: { name: 'Tortuga', model: 'tortuga.glb', icon: '🐢' },
    2: { name: 'Tiburón', model: 'tiburon.glb', icon: '🦈' }
};

let stats = {
    totalSent: 0,
    successCount: 0,
    failedCount: 0
};

// ==================== LOGGING ====================

function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('es-ES');
    const icons = {
        info: 'ℹ️ ',
        success: '✅',
        error: '❌',
        warning: '⚠️ ',
        debug: '🔍'
    };
    
    const icon = icons[type] || '•';
    console.log(`${icon} [${timestamp}] ${message}`);
}

// ==================== API REQUESTS ====================

function makeRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(API_BASE_URL + endpoint);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// ==================== HEALTH CHECK ====================

async function checkHealth() {
    log('Verificando API...', 'debug');
    
    try {
        const response = await makeRequest('GET', '/health');
        
        if (response.data.success) {
            log(`API activa (uptime: ${response.data.uptime.toFixed(2)}s)`, 'success');
            return true;
        } else {
            log('API no respondió correctamente', 'error');
            return false;
        }
    } catch (error) {
        log(`No se puede conectar a API: ${error.message}`, 'error');
        log('Asegúrate de ejecutar: cd api && npm start', 'warning');
        return false;
    }
}

// ==================== SEND MODEL ====================

async function sendModel(markerIndex) {
    const config = MODELS_CONFIG[markerIndex];
    
    try {
        log(`Enviando: ${config.icon} ${config.name}`, 'debug');

        const response = await makeRequest('POST', '/send-model', {
            name: config.model,
            path: config.model,
            markerName: config.name
        });

        stats.totalSent++;

        if (response.data.success) {
            stats.successCount++;
            log(`${config.icon} ${config.name} enviado correctamente`, 'success');
            return true;
        } else {
            stats.failedCount++;
            log(`Error: ${response.data.error}`, 'error');
            return false;
        }

    } catch (error) {
        stats.failedCount++;
        log(`Error de conexión: ${error.message}`, 'error');
        return false;
    }
}

// ==================== GET LATEST ====================

async function getLatestModel() {
    try {
        const response = await makeRequest('GET', '/latest-model');

        if (response.data.data) {
            log(`Último modelo: ${response.data.data.name}`, 'success');
            return response.data.data;
        } else {
            log('No hay modelo disponible', 'warning');
            return null;
        }

    } catch (error) {
        log(`Error: ${error.message}`, 'error');
        return null;
    }
}

// ==================== GET HISTORY ====================

async function getHistory(limit = 5) {
    try {
        const response = await makeRequest('GET', `/history?limit=${limit}`);

        if (response.data.data && response.data.data.length > 0) {
            log(`Historial: ${response.data.total} modelos totales`, 'success');
            console.log('\n📋 Últimos modelos:');
            response.data.data.forEach((model, i) => {
                const time = new Date(model.timestamp).toLocaleTimeString('es-ES');
                console.log(`  ${i + 1}. ${model.name} (${model.markerName}) - ${time}`);
            });
        } else {
            log('Historial vacío', 'warning');
        }

    } catch (error) {
        log(`Error: ${error.message}`, 'error');
    }
}

// ==================== PRINT STATS ====================

function printStats() {
    console.log('\n╔════════════════════════════════════╗');
    console.log('║        📊 ESTADÍSTICAS FINALES     ║');
    console.log('╚════════════════════════════════════╝\n');
    
    console.log(`Total enviado:    ${stats.totalSent}`);
    console.log(`Exitosos:         ${stats.successCount}`);
    console.log(`Fallidos:         ${stats.failedCount}`);
    
    if (stats.totalSent > 0) {
        const percentage = ((stats.successCount / stats.totalSent) * 100).toFixed(1);
        console.log(`Tasa de éxito:    ${percentage}%\n`);
    }
}

// ==================== MAIN TEST FLOW ====================

async function runTests() {
    console.log('\n╔════════════════════════════════════╗');
    console.log('║   🧪 TESTING AUTOMÁTICO - ACUARIO   ║');
    console.log('╚════════════════════════════════════╝\n');

    // Paso 1: Health Check
    log('--- PASO 1: Health Check ---', 'debug');
    const isHealthy = await checkHealth();
    
    if (!isHealthy) {
        log('❌ API no disponible. Abortando...', 'error');
        process.exit(1);
    }

    await sleep(1000);

    // Paso 2: Enviar Modelos
    log('\n--- PASO 2: Enviando Modelos ---', 'debug');
    
    for (let i = 0; i < 3; i++) {
        await sendModel(i);
        await sleep(1500);
    }

    await sleep(2000);

    // Paso 3: Verificar Último
    log('\n--- PASO 3: Verificando Último Modelo ---', 'debug');
    await getLatestModel();

    await sleep(1000);

    // Paso 4: Ver Historial
    log('\n--- PASO 4: Verificando Historial ---', 'debug');
    await getHistory(5);

    // Estadísticas finales
    printStats();

    log('\n✅ Testing completado', 'success');
}

// ==================== HELPER ====================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== INICIO ====================

runTests().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
});
