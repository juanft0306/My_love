// ============================================================
// CONFIGURACIÓN - Gestión de estado y localStorage
// ============================================================
const DEFAULT_CONFIG = {
    fechaInicio: '2026-03-19T00:00',
    titulo: 'Felices 5 Meses, Mi Amor',
    subtitulo: 'Cada día a tu lado es un regalo',
    foto: 'https://via.placeholder.com/400x400/f9e0e0/7a2e3e?text=Tu+Foto+Aqui',
    cancion: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    colorVino: '#7a2e3e',
    colorRosa: '#f9e0e0',
    eventos: [
        { fecha: '24 de diciembre de 2025', titulo: 'El inicio de todo', desc: 'La primera vez que ella me habló.' },
        { fecha: '20 de enero de 2026', titulo: 'Nuestra primera cita', desc: 'Con su suéter azul.' },
        { fecha: '19 de marzo de 2026', titulo: 'Le pedí que fuera mi novia', desc: 'Después de comer pizza.' }
    ],
    acordeon1Titulo: '❤️ Tu sonrisa ilumina mi mundo',
    acordeon1Contenido: 'Cuando sonríes, el día se vuelve soleado.',
    acordeon2Titulo: '💕 Tu forma de verme',
    acordeon2Contenido: 'Esa mirada que dice más que mil palabras.',
    acordeon3Titulo: '✨ Tu carácter y pasión',
    acordeon3Contenido: 'Eres fuerte y sueñas en grande.',
    gusto1Titulo: 'Cheetos Flamin\' Hot',
    gusto1Desc: 'Le encanta el picante, y a mí me encanta verla feliz.',
    gusto2Titulo: 'Lirios',
    gusto2Desc: 'Sus flores favoritas, tan elegantes como ella.',
    carta: 'Han pasado 5 meses...\n\nEres mi refugio...\n\nCon todo mi amor,\nTu chico'
};

function cargarConfiguracion() {
    const guardada = localStorage.getItem('miAmorConfig');
    if (guardada) {
        try {
            const config = JSON.parse(guardada);
            if (!config.eventos || !Array.isArray(config.eventos)) {
                config.eventos = [...DEFAULT_CONFIG.eventos];
            }
            return { ...DEFAULT_CONFIG, ...config };
        } catch (e) {
            return { ...DEFAULT_CONFIG };
        }
    }
    return { ...DEFAULT_CONFIG };
}

let config = cargarConfiguracion();
let timeoutAutoSave = null;

function guardarConfiguracion() {
    localStorage.setItem('miAmorConfig', JSON.stringify(config));
}

function autoGuardar() {
    if (timeoutAutoSave) clearTimeout(timeoutAutoSave);
    timeoutAutoSave = setTimeout(() => {
        guardarConfiguracion();
        console.log('💾 Auto-guardado');
    }, 500);
}

// Exponer para otros módulos
window.config = config;
window.guardarConfiguracion = guardarConfiguracion;
window.autoGuardar = autoGuardar;
window.DEFAULT_CONFIG = DEFAULT_CONFIG;
