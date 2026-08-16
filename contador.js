// ============================================================
// CONTADOR - Depende de window.config
// ============================================================
let FECHA_INICIO = new Date(2026, 2, 19, 0, 0, 0);

function actualizarContador() {
    const ahora = new Date();
    const diff = ahora - FECHA_INICIO;
    if (diff <= 0) {
        ['dias','horas','minutos','segundos'].forEach(id => document.getElementById(id).textContent='00');
        return;
    }
    const s = Math.floor(diff/1000), m = Math.floor(s/60), h = Math.floor(m/60), d = Math.floor(h/24);
    document.getElementById('dias').textContent = String(d).padStart(2,'0');
    document.getElementById('horas').textContent = String(h%24).padStart(2,'0');
    document.getElementById('minutos').textContent = String(m%60).padStart(2,'0');
    document.getElementById('segundos').textContent = String(s%60).padStart(2,'0');
}

// Inicializar y actualizar cada segundo
actualizarContador();
setInterval(actualizarContador, 1000);

// Exportar función para que main pueda actualizar si cambia la fecha
window.actualizarContador = actualizarContador;
