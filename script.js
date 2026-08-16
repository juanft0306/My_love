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
    eventos: [
        { fecha: '24 de diciembre de 2025', titulo: 'El inicio de todo', desc: 'La primera vez que ella me habló. El mejor regalo de Navidad.' },
        { fecha: '20 de enero de 2026', titulo: 'Nuestra primera cita en persona', desc: 'Con ese suéter azul que me regaló y que aún guardo con cariño.' },
        { fecha: '19 de marzo de 2026', titulo: 'El día que le pedí que fuera mi novia', desc: 'Después de invitarla a comer pizza, supo que sería para siempre.' }
    ],
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
// 2. CARGAR Y GUARDAR
// ============================================================
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
        console.log('💾 Auto-guardado correcto');
    }, 500);
}

// ============================================================
// 3. RENDERIZAR EVENTOS EN LA PÁGINA PRINCIPAL
// ============================================================
function renderizarEventos() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    if (!config.eventos || config.eventos.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--vino-claro);">Aún no hay eventos. Agrega algunos desde la configuración ❤️</p>';
        return;
    }
    let html = '';
    config.eventos.forEach(ev => {
        html += `
            <div class="evento">
                <div class="fecha">${ev.fecha || ''}</div>
                <div class="titulo-evento">${ev.titulo || ''}</div>
                <div class="descripcion">${ev.desc || ''}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ============================================================
// 4. APLICAR CONFIGURACIÓN COMPLETA
// ============================================================
function aplicarConfiguracion() {
    // Fecha inicio
    if (config.fechaInicio) {
        const parts = config.fechaInicio.split('T');
        const fecha = parts[0].split('-');
        const hora = parts[1] ? parts[1].split(':') : ['0','0'];
        FECHA_INICIO = new Date(parseInt(fecha[0]), parseInt(fecha[1])-1, parseInt(fecha[2]), parseInt(hora[0]), parseInt(hora[1]));
        actualizarContador();
    }
    // Títulos
    document.getElementById('tituloPrincipal').textContent = config.titulo || DEFAULT_CONFIG.titulo;
    document.getElementById('subtituloPrincipal').textContent = config.subtitulo || DEFAULT_CONFIG.subtitulo;
    // Foto
    if (config.foto) document.getElementById('fotoPolaroid').src = config.foto;
    // Canción
    if (config.cancion && audio) { audio.src = config.cancion; if (reproduciendo) audio.play().catch(()=>{}); }
    // Colores
    const root = document.documentElement;
    if (config.colorVino) {
        root.style.setProperty('--vino', config.colorVino);
        root.style.setProperty('--vino-claro', ajustarBrillo(config.colorVino, 30));
    }
    if (config.colorRosa) {
        root.style.setProperty('--rose', config.colorRosa);
        root.style.setProperty('--rose-claro', ajustarBrillo(config.colorRosa, 10));
    }
    // Eventos
    renderizarEventos();
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
    // Carta
    if (config.carta) {
        const parrafos = config.carta.split('\n\n').filter(p => p.trim() !== '');
        const contenedor = document.getElementById('cartaTexto');
        contenedor.innerHTML = parrafos.map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('');
    }
}

function ajustarBrillo(hex, p) {
    let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    r = Math.min(255, r+p); g = Math.min(255, g+p); b = Math.min(255, b+p);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ============================================================
// 5. CONTADOR
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
actualizarContador();
setInterval(actualizarContador, 1000);

// ============================================================
// 6. ACORDEÓN
// ============================================================
document.querySelectorAll('.acordeon-header').forEach(h => {
    h.addEventListener('click', function() {
        const item = this.parentElement;
        const abierto = item.classList.contains('abierto');
        document.querySelectorAll('.acordeon-item').forEach(el => el.classList.remove('abierto'));
        if (!abierto) item.classList.add('abierto');
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
    for (let p of particulas) {
        p.actualizar();
        p.dibujar(ctx);
    }
    animacionId = requestAnimationFrame(animarConfeti);
}

document.getElementById('btnConfeti').addEventListener('click', function() {
    iniciarConfeti();
    document.getElementById('mensajeOculto').classList.add('visible');
    this.textContent = '🎉 ¡Sorpresa! 🎉';
    setTimeout(() => this.textContent = '✨ ¡Presiona para una sorpresa! ✨', 3000);
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
// 9. PANEL DE CONFIGURACIÓN CON VISTA PREVIA EN VIVO
// ============================================================
const configBtn = document.getElementById('configBtn');
const configModal = document.getElementById('configModal');
const configClose = document.getElementById('configClose');

// Sincroniza los inputs del modal con el objeto config y aplica los cambios en vivo
function sincronizarInputs() {
    config.fechaInicio = document.getElementById('cfgFechaInicio').value;
    config.titulo = document.getElementById('cfgTitulo').value;
    config.subtitulo = document.getElementById('cfgSubtitulo').value;
    config.cancion = document.getElementById('cfgCancion').value;
    config.colorVino = document.getElementById('cfgVino').value;
    config.colorRosa = document.getElementById('cfgRosa').value;
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

    // Eventos
    const eventosNodes = document.querySelectorAll('.evento-config');
    const nuevosEventos = [];
    eventosNodes.forEach(node => {
        const fecha = node.querySelector('.ev-fecha').value;
        const titulo = node.querySelector('.ev-titulo').value;
        const desc = node.querySelector('.ev-desc').value;
        nuevosEventos.push({ fecha, titulo, desc });
    });
    config.eventos = nuevosEventos;

    aplicarConfiguracion();
    autoGuardar();
}

function abrirModal() {
    configModal.classList.add('mostrar');
    document.getElementById('cfgFechaInicio').value = config.fechaInicio || '';
    document.getElementById('cfgTitulo').value = config.titulo || '';
    document.getElementById('cfgSubtitulo').value = config.subtitulo || '';
    document.getElementById('cfgCancion').value = config.cancion || '';
    document.getElementById('cfgVino').value = config.colorVino || '#7a2e3e';
    document.getElementById('cfgRosa').value = config.colorRosa || '#f9e0e0';
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

    const preview = document.getElementById('cfgFotoPreview');
    if (config.foto && config.foto.startsWith('data:image')) {
        preview.src = config.foto;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
    renderizarEventosConfig();
}

function cerrarModal() {
    configModal.classList.remove('mostrar');
}

configBtn.addEventListener('click', abrirModal);
configClose.addEventListener('click', cerrarModal);
window.addEventListener('click', (e) => { if (e.target === configModal) cerrarModal(); });

// Listeners en vivo para todos los inputs (excepto file)
document.querySelectorAll('#configForm input, #configForm textarea').forEach(input => {
    if (input.type !== 'file') {
        input.addEventListener('input', sincronizarInputs);
        input.addEventListener('change', sincronizarInputs);
    }
});

// --- Gestión de eventos en el formulario ---
const eventosContainer = document.getElementById('eventosContainer');

function renderizarEventosConfig() {
    if (!eventosContainer) return;
    eventosContainer.innerHTML = '';
    if (!config.eventos || config.eventos.length === 0) {
        eventosContainer.innerHTML = '<p style="color:var(--vino-claro);">No hay eventos. Agrega uno con el botón de abajo.</p>';
        return;
    }
    config.eventos.forEach((ev, index) => {
        const div = document.createElement('div');
        div.className = 'evento-config';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="color:var(--vino);">#${index + 1}</strong>
                <div>
                    ${index > 0 ? `<button type="button" class="mover-evento" data-index="${index}" data-dir="-1" style="background:var(--rose); border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; font-size:1rem;">⬆️</button>` : ''}
                    ${index < config.eventos.length - 1 ? `<button type="button" class="mover-evento" data-index="${index}" data-dir="1" style="background:var(--rose); border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; font-size:1rem;">⬇️</button>` : ''}
                    <button type="button" class="eliminar-evento" data-index="${index}" style="background:#ff6b6b; color:white; border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; font-size:1rem;">✕</button>
                </div>
            </div>
            <div class="config-group"><label>Fecha:</label><input type="text" class="ev-fecha" value="${ev.fecha || ''}" placeholder="Ej: 24 de diciembre de 2025" /></div>
            <div class="config-group"><label>Título:</label><input type="text" class="ev-titulo" value="${ev.titulo || ''}" placeholder="Ej: El inicio de todo" /></div>
            <div class="config-group"><label>Descripción:</label><input type="text" class="ev-desc" value="${ev.desc || ''}" placeholder="Breve descripción" /></div>
        `;
        eventosContainer.appendChild(div);
    });

    document.querySelectorAll('.evento-config input').forEach(inp => {
        inp.addEventListener('input', sincronizarInputs);
        inp.addEventListener('change', sincronizarInputs);
    });

    document.querySelectorAll('.eliminar-evento').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            config.eventos.splice(idx, 1);
            sincronizarInputs();
            renderizarEventosConfig();
        });
    });

    document.querySelectorAll('.mover-evento').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            const dir = parseInt(this.dataset.dir);
            const newIdx = idx + dir;
            if (newIdx < 0 || newIdx >= config.eventos.length) return;
            const temp = config.eventos[idx];
            config.eventos[idx] = config.eventos[newIdx];
            config.eventos[newIdx] = temp;
            sincronizarInputs();
            renderizarEventosConfig();
        });
    });
}

document.getElementById('agregarEventoBtn').addEventListener('click', function() {
    config.eventos.push({ fecha: '', titulo: '', desc: '' });
    sincronizarInputs();
    renderizarEventosConfig();
    eventosContainer.scrollTop = eventosContainer.scrollHeight;
});

// Carga de imagen
document.getElementById('cfgFotoFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const dataUrl = event.target.result;
        config.foto = dataUrl;
        document.getElementById('cfgFotoPreview').src = dataUrl;
        document.getElementById('cfgFotoPreview').style.display = 'block';
        document.getElementById('fotoPolaroid').src = dataUrl;
        autoGuardar();
    };
    reader.readAsDataURL(file);
});

// Botón Guardar (ahora solo feedback)
document.getElementById('configGuardar').addEventListener('click', function() {
    sincronizarInputs();
    guardarConfiguracion();
    cerrarModal();
    alert('✅ ¡Cambios guardados y aplicados al instante!');
});

// Restaurar
document.getElementById('configRestaurar').addEventListener('click', function() {
    if (confirm('¿Restaurar todos los valores por defecto?')) {
        config = { ...DEFAULT_CONFIG };
        guardarConfiguracion();
        if (audio) audio.src = config.cancion;
        aplicarConfiguracion();
        cerrarModal();
        alert('↩️ Configuración restaurada.');
    }
});

// ============================================================
// 10. INICIALIZAR
// ============================================================
aplicarConfiguracion();
console.log('%c💖 Modo edición rápida activado: escribe y mira los cambios en vivo', 'font-size:16px; color:#7a2e3e;');
