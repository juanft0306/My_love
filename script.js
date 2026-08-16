// ============================================================
// 1. CONFIGURACIÓN POR DEFECTO
// ============================================================
const DEFAULT_CONFIG = {
    fechaInicio: '2026-03-19T00:00',
    titulo: 'Felices 5 Meses, Mi Amor',
    subtitulo: 'Cada día a tu lado es un regalo',
    foto: 'https://via.placeholder.com/400x400/f9e0e0/7a2e3e?text=Tu+Foto+Aqui',
    cancion: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    colorVino: '#7a2e3e',
    colorRosa: '#f9e0e0',
    evento1Fecha: '24 de diciembre de 2025',
    evento1Titulo: 'El inicio de todo',
    evento1Desc: 'La primera vez que ella me habló. El mejor regalo de Navidad.',
    evento2Fecha: '20 de enero de 2026',
    evento2Titulo: 'Nuestra primera cita en persona',
    evento2Desc: 'Con ese suéter azul que me regaló y que aún guardo con cariño.',
    evento3Fecha: '19 de marzo de 2026',
    evento3Titulo: 'El día que le pedí que fuera mi novia',
    evento3Desc: 'Después de invitarla a comer pizza, supo que sería para siempre.',
    acordeon1Titulo: '❤️ Tu sonrisa ilumina mi mundo',
    acordeon1Contenido: 'Cuando sonríes, hasta el día más gris se vuelve soleado. Es mi razón para sonreír siempre.',
    acordeon2Titulo: '💕 Tu forma de verme',
    acordeon2Contenido: 'Esa mirada tuya que dice más que mil palabras. Me hace sentir el hombre más afortunado.',
    acordeon3Titulo: '✨ Tu carácter y tu pasión',
    acordeon3Contenido: 'Eres fuerte, decidida y sueñas en grande. Admiro cada parte de ti, incluso cuando te enojas.',
    gusto1Titulo: 'Cheetos Flamin\' Hot',
    gusto1Desc: '¡No hay día que no disfrutes unos buenos Cheetos! Ese toque picante te encanta, y a mí me encanta verte feliz cuando los comes.',
    gusto2Titulo: 'Lirios',
    gusto2Desc: 'Tus flores favoritas, tan elegantes y dulces como tú. Siempre que veo uno pienso en ti.',
    carta: 'Han pasado 5 meses desde que decidimos emprender este viaje juntos, y cada día confirmo que fuiste la mejor elección de mi vida.\n\nEres mi refugio, mi alegría y mi mayor inspiración. Gracias por cada sonrisa, cada abrazo y por hacerme sentir tan especial.\n\nEspero que este pequeño detalle te haga sonreír tanto como tú me haces sonreír a mí.\n\nCon todo mi amor,\nTu chico'
};

// ============================================================
// 2. CARGAR CONFIGURACIÓN DESDE localStorage
// ============================================================
function cargarConfiguracion() {
    const guardada = localStorage.getItem('miAmorConfig');
    if (guardada) {
        try {
            const config = JSON.parse(guardada);
            // Combinar con los valores por defecto (por si faltan campos)
            return { ...DEFAULT_CONFIG, ...config };
        } catch (e) {
            console.warn('Error al cargar configuración, usando valores por defecto');
            return { ...DEFAULT_CONFIG };
        }
    }
    return { ...DEFAULT_CONFIG };
}

let config = cargarConfiguracion();

// ============================================================
// 3. GUARDAR CONFIGURACIÓN
// ============================================================
function guardarConfiguracion() {
    localStorage.setItem('miAmorConfig', JSON.stringify(config));
}

// ============================================================
// 4. APLICAR CONFIGURACIÓN A LA PÁGINA
// ============================================================
function aplicarConfiguracion() {
    // Fecha de inicio (para el contador)
    if (config.fechaInicio) {
        const fechaParts = config.fechaInicio.split('T');
        const fecha = fechaParts[0].split('-');
        const hora = fechaParts[1] ? fechaParts[1].split(':') : ['0','0'];
        FECHA_INICIO = new Date(
            parseInt(fecha[0]),
            parseInt(fecha[1]) - 1,
            parseInt(fecha[2]),
            parseInt(hora[0]),
            parseInt(hora[1])
        );
        // Actualizar el contador inmediatamente
        actualizarContador();
    }

    // Título y subtítulo
    document.getElementById('tituloPrincipal').textContent = config.titulo || DEFAULT_CONFIG.titulo;
    document.getElementById('subtituloPrincipal').textContent = config.subtitulo || DEFAULT_CONFIG.subtitulo;

    // Foto polaroid
    if (config.foto) {
        document.getElementById('fotoPolaroid').src = config.foto;
    }

    // Canción (se actualiza en el reproductor al recargar)
    if (config.cancion && audio) {
        // Si el audio ya existe, cambiamos la fuente
        audio.src = config.cancion;
        if (reproduciendo) {
            audio.play().catch(() => {});
        }
    }

    // Colores (variables CSS)
    const root = document.documentElement;
    if (config.colorVino) {
        root.style.setProperty('--vino', config.colorVino);
        // Calcular variantes claras (se puede mejorar)
        root.style.setProperty('--vino-claro', ajustarBrillo(config.colorVino, 30));
    }
    if (config.colorRosa) {
        root.style.setProperty('--rose', config.colorRosa);
        root.style.setProperty('--rose-claro', ajustarBrillo(config.colorRosa, 10));
    }

    // Eventos de la línea de tiempo
    document.getElementById('ev1Fecha').textContent = config.evento1Fecha || DEFAULT_CONFIG.evento1Fecha;
    document.getElementById('ev1Titulo').textContent = config.evento1Titulo || DEFAULT_CONFIG.evento1Titulo;
    document.getElementById('ev1Desc').textContent = config.evento1Desc || DEFAULT_CONFIG.evento1Desc;
    document.getElementById('ev2Fecha').textContent = config.evento2Fecha || DEFAULT_CONFIG.evento2Fecha;
    document.getElementById('ev2Titulo').textContent = config.evento2Titulo || DEFAULT_CONFIG.evento2Titulo;
    document.getElementById('ev2Desc').textContent = config.evento2Desc || DEFAULT_CONFIG.evento2Desc;
    document.getElementById('ev3Fecha').textContent = config.evento3Fecha || DEFAULT_CONFIG.evento3Fecha;
    document.getElementById('ev3Titulo').textContent = config.evento3Titulo || DEFAULT_CONFIG.evento3Titulo;
    document.getElementById('ev3Desc').textContent = config.evento3Desc || DEFAULT_CONFIG.evento3Desc;

    // Acordeón
    document.getElementById('acordeon1Titulo').textContent = config.acordeon1Titulo || DEFAULT_CONFIG.acordeon1Titulo;
    document.querySelector('#acordeon1Contenido p').textContent = config.acordeon1Contenido || DEFAULT_CONFIG.acordeon1Contenido;
    document.getElementById('acordeon2Titulo').textContent = config.acordeon2Titulo || DEFAULT_CONFIG.acordeon2Titulo;
    document.querySelector('#acordeon2Contenido p').textContent = config.acordeon2Contenido || DEFAULT_CONFIG.acordeon2Contenido;
    document.getElementById('acordeon3Titulo').textContent = config.acordeon3Titulo || DEFAULT_CONFIG.acordeon3Titulo;
    document.querySelector('#acordeon3Contenido p').textContent = config.acordeon3Contenido || DEFAULT_CONFIG.acordeon3Contenido;

    // Gustos
    document.getElementById('gusto1Titulo').textContent = config.gusto1Titulo || DEFAULT_CONFIG.gusto1Titulo;
    document.getElementById('gusto1Desc').textContent = config.gusto1Desc || DEFAULT_CONFIG.gusto1Desc;
    document.getElementById('gusto2Titulo').textContent = config.gusto2Titulo || DEFAULT_CONFIG.gusto2Titulo;
    document.getElementById('gusto2Desc').textContent = config.gusto2Desc || DEFAULT_CONFIG.gusto2Desc;

    // Carta de amor
    if (config.carta) {
        const parrafos = config.carta.split('\n\n').filter(p => p.trim() !== '');
        const contenedor = document.getElementById('cartaTexto');
        contenedor.innerHTML = parrafos.map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('');
    }
}

// Función auxiliar para ajustar brillo de colores (simple)
function ajustarBrillo(hex, porcentaje) {
    // Convierte hex a RGB, suma el porcentaje a cada canal, y vuelve a hex
    let r = parseInt(hex.slice(1,3), 16);
    let g = parseInt(hex.slice(3,5), 16);
    let b = parseInt(hex.slice(5,7), 16);
    r = Math.min(255, r + porcentaje);
    g = Math.min(255, g + porcentaje);
    b = Math.min(255, b + porcentaje);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ============================================================
// 5. CONTADOR EN VIVO (modificado para usar FECHA_INICIO dinámica)
// ============================================================
let FECHA_INICIO = new Date(2026, 2, 19, 0, 0, 0);

function actualizarContador() {
    const ahora = new Date();
    const diff = ahora - FECHA_INICIO;

    if (diff <= 0) {
        document.getElementById('dias').textContent = '00';
        document.getElementById('horas').textContent = '00';
        document.getElementById('minutos').textContent = '00';
        document.getElementById('segundos').textContent = '00';
        return;
    }

    const segundos = Math.floor(diff / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    document.getElementById('dias').textContent = String(dias).padStart(2, '0');
    document.getElementById('horas').textContent = String(horas % 24).padStart(2, '0');
    document.getElementById('minutos').textContent = String(minutos % 60).padStart(2, '0');
    document.getElementById('segundos').textContent = String(segundos % 60).padStart(2, '0');
}

actualizarContador();
setInterval(actualizarContador, 1000);

// ============================================================
// 6. ACORDEÓN
// ============================================================
document.querySelectorAll('.acordeon-header').forEach(header => {
    header.addEventListener('click', function() {
        const item = this.parentElement;
        const estaAbierto = item.classList.contains('abierto');
        document.querySelectorAll('.acordeon-item').forEach(el => el.classList.remove('abierto'));
        if (!estaAbierto) item.classList.add('abierto');
    });
});

// ============================================================
// 7. REPRODUCTOR DE MÚSICA
// ============================================================
const playBtn = document.getElementById('playBtn');
const estadoMusica = document.getElementById('estadoMusica');
let audio = null;
let reproduciendo = false;
let URL_CANCION = config.cancion || DEFAULT_CONFIG.cancion;

playBtn.addEventListener('click', function() {
    if (!audio) {
        audio = new Audio(URL_CANCION);
        audio.loop = true;
        audio.volume = 0.5;
        audio.addEventListener('ended', () => {
            if (reproduciendo) {
                audio.currentTime = 0;
                audio.play();
            }
        });
    }

    if (reproduciendo) {
        audio.pause();
        reproduciendo = false;
        playBtn.textContent = '▶️';
        estadoMusica.textContent = '⏸️';
    } else {
        audio.play().then(() => {
            reproduciendo = true;
            playBtn.textContent = '⏹️';
            estadoMusica.textContent = '🎵';
        }).catch(err => {
            alert('No se pudo reproducir la música. Asegúrate de que el navegador lo permita.');
            console.warn('Error al reproducir:', err);
        });
    }
});

// ============================================================
// 8. CONFETI
// ============================================================
const canvas = document.getElementById('confeti-canvas');
const ctx = canvas.getContext('2d');
let confetiActivo = false;
let particulas = [];
let animacionId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particula {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 12 + 6;
        this.speedY = Math.random() * 4 + 3;
        this.speedX = (Math.random() - 0.5) * 3;
        this.opacity = 1;
        this.color = `hsl(${Math.random() * 30 + 340}, 80%, 60%)`;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.forma = Math.random() > 0.5 ? 'corazon' : 'circulo';
    }
    dibujar(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        if (this.forma === 'corazon') {
            ctx.beginPath();
            const s = this.size / 2;
            ctx.moveTo(0, -s);
            ctx.bezierCurveTo(-s * 2, -s * 2, -s * 2, s, 0, s * 1.2);
            ctx.bezierCurveTo(s * 2, s, s * 2, -s * 2, 0, -s);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    actualizar() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height + 20) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }
        if (this.y > canvas.height * 0.9) {
            this.opacity = 1 - (this.y - canvas.height * 0.9) / (canvas.height * 0.1);
        } else {
            this.opacity = 1;
        }
    }
}

function iniciarConfeti() {
    if (confetiActivo) return;
    confetiActivo = true;
    particulas = [];
    for (let i = 0; i < 180; i++) {
        particulas.push(new Particula());
    }
    if (animacionId) cancelAnimationFrame(animacionId);
    animarConfeti();
}

function animarConfeti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activas = false;
    for (let p of particulas) {
        p.actualizar();
        p.dibujar(ctx);
        if (p.y < canvas.height) activas = true;
    }
    if (!activas && particulas.length > 0) {
        for (let i = 0; i < 20; i++) {
            particulas[i].y = -20;
            particulas[i].x = Math.random() * canvas.width;
        }
    }
    animacionId = requestAnimationFrame(animarConfeti);
}

document.getElementById('btnConfeti').addEventListener('click', function() {
    iniciarConfeti();
    const mensaje = document.getElementById('mensajeOculto');
    mensaje.classList.add('visible');
    this.textContent = '🎉 ¡Sorpresa! 🎉';
    setTimeout(() => {
        this.textContent = '✨ ¡Presiona para una sorpresa! ✨';
    }, 3000);
});

canvas.addEventListener('dblclick', function() {
    if (animacionId) {
        cancelAnimationFrame(animacionId);
        animacionId = null;
        confetiActivo = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

// ============================================================
// 9. PANEL DE CONFIGURACIÓN (Modal)
// ============================================================
const configBtn = document.getElementById('configBtn');
const configModal = document.getElementById('configModal');
const configClose = document.getElementById('configClose');
const configForm = document.getElementById('configForm');

// Abrir modal
configBtn.addEventListener('click', () => {
    configModal.classList.add('mostrar');
    // Rellenar los campos con la configuración actual
    document.getElementById('cfgFechaInicio').value = config.fechaInicio || '';
    document.getElementById('cfgTitulo').value = config.titulo || '';
    document.getElementById('cfgSubtitulo').value = config.subtitulo || '';
    document.getElementById('cfgFoto').value = config.foto || '';
    document.getElementById('cfgCancion').value = config.cancion || '';
    document.getElementById('cfgVino').value = config.colorVino || '#7a2e3e';
    document.getElementById('cfgRosa').value = config.colorRosa || '#f9e0e0';
    document.getElementById('cfgEvento1Fecha').value = config.evento1Fecha || '';
    document.getElementById('cfgEvento1Titulo').value = config.evento1Titulo || '';
    document.getElementById('cfgEvento1Desc').value = config.evento1Desc || '';
    document.getElementById('cfgEvento2Fecha').value = config.evento2Fecha || '';
    document.getElementById('cfgEvento2Titulo').value = config.evento2Titulo || '';
    document.getElementById('cfgEvento2Desc').value = config.evento2Desc || '';
    document.getElementById('cfgEvento3Fecha').value = config.evento3Fecha || '';
    document.getElementById('cfgEvento3Titulo').value = config.evento3Titulo || '';
    document.getElementById('cfgEvento3Desc').value = config.evento3Desc || '';
    document.getElementById('cfgAcordeon1Titulo').value = config.acordeon1Titulo || '';
    document.getElementById('cfgAcordeon1Contenido').value = config.acordeon1Contenido || '';
    document.getElementById('cfgAcordeon2Titulo').value = config.acordeon2Titulo || '';
    document.getElementById('cfgAcordeon2Contenido').value = config.acordeon2Contenido || '';
    document.getElementById('cfgAcordeon3Titulo').value = config.acordeon3Titulo || '';
    document.getElementById('cfgAcordeon3Contenido').value = config.acordeon3Contenido || '';
    document.getElementById('cfgGusto1Titulo').value = config.gusto1Titulo || '';
    document.getElementById('cfgGusto1Desc').value = config.gusto1Desc || '';
    document.getElementById('cfgGusto2Titulo').value = config.gusto2Titulo || '';
    document.getElementById('cfgGusto2Desc').value = config.gusto2Desc || '';
    document.getElementById('cfgCarta').value = config.carta || '';
});

// Cerrar modal
function cerrarModal() {
    configModal.classList.remove('mostrar');
}
configClose.addEventListener('click', cerrarModal);
window.addEventListener('click', (e) => {
    if (e.target === configModal) cerrarModal();
});

// Guardar configuración
document.getElementById('configGuardar').addEventListener('click', () => {
    // Recoger todos los valores
    config.fechaInicio = document.getElementById('cfgFechaInicio').value;
    config.titulo = document.getElementById('cfgTitulo').value;
    config.subtitulo = document.getElementById('cfgSubtitulo').value;
    config.foto = document.getElementById('cfgFoto').value;
    config.cancion = document.getElementById('cfgCancion').value;
    config.colorVino = document.getElementById('cfgVino').value;
    config.colorRosa = document.getElementById('cfgRosa').value;
    config.evento1Fecha = document.getElementById('cfgEvento1Fecha').value;
    config.evento1Titulo = document.getElementById('cfgEvento1Titulo').value;
    config.evento1Desc = document.getElementById('cfgEvento1Desc').value;
    config.evento2Fecha = document.getElementById('cfgEvento2Fecha').value;
    config.evento2Titulo = document.getElementById('cfgEvento2Titulo').value;
    config.evento2Desc = document.getElementById('cfgEvento2Desc').value;
    config.evento3Fecha = document.getElementById('cfgEvento3Fecha').value;
    config.evento3Titulo = document.getElementById('cfgEvento3Titulo').value;
    config.evento3Desc = document.getElementById('cfgEvento3Desc').value;
    config.acordeon1Titulo = document.getElementById('cfgAcordeon1Titulo').value;
    config.acordeon1Contenido = document.getElementById('cfgAcordeon1Contenido').value;
    config.acordeon2Titulo = document.getElementById('cfgAcordeon2Titulo').value;
    config.acordeon2Contenido = document.getElementById('cfgAcordeon2Contenido').value;
    config.acordeon3Titulo = document.getElementById('cfgAcordeon3Titulo').value;
    config.acordeon3Contenido = document.getElementById('cfgAcordeon3Contenido').value;
    config.gusto1Titulo = document.getElementById('cfgGusto1Titulo').value;
    config.gusto1Desc = document.getElementById('cfgGusto1Desc').value;
    config.gusto2Titulo = document.getElementById('cfgGusto2Titulo').value;
    config.gusto2Desc = document.getElementById('cfgGusto2Desc').value;
    config.carta = document.getElementById('cfgCarta').value;

    // Guardar en localStorage
    guardarConfiguracion();

    // Actualizar la URL de la canción si cambió
    if (config.cancion && audio) {
        audio.src = config.cancion;
    }

    // Aplicar a la página
    aplicarConfiguracion();

    // Cerrar modal
    cerrarModal();

    // Mostrar feedback
    alert('✅ ¡Configuración guardada con éxito!');
});

// Restaurar valores por defecto
document.getElementById('configRestaurar').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres restaurar todos los valores por defecto?')) {
        config = { ...DEFAULT_CONFIG };
        guardarConfiguracion();
        // Si hay audio, actualizar URL
        if (audio) audio.src = config.cancion;
        aplicarConfiguracion();
        cerrarModal();
        alert('↩️ Configuración restaurada a los valores originales.');
    }
});

// ============================================================
// 10. APLICAR CONFIGURACIÓN AL CARGAR
// ============================================================
aplicarConfiguracion();

console.log('%c💖 Felices 5 meses, amor. Este sitio es para ti. 💖', 'font-size: 20px; color: #7a2e3e; font-weight: bold;');
console.log('⚙️ Puedes modificar todos los textos y colores desde el botón de configuración (engranaje) en la esquina inferior izquierda.');
            
