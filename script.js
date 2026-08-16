// ============================================================
// 1. CONFIGURACIÓN INICIAL (¡CAMBIA ESTA FECHA!)
// ============================================================
const FECHA_INICIO = new Date(2026, 2, 19, 0, 0, 0); // 19 de marzo de 2026, 00:00:00

// ============================================================
// 2. CONTADOR EN VIVO
// ============================================================
function actualizarContador() {
    const ahora = new Date();
    const diff = ahora - FECHA_INICIO; // milisegundos

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
// 3. ACORDEÓN (sección "Cosas que amo")
// ============================================================
document.querySelectorAll('.acordeon-header').forEach(header => {
    header.addEventListener('click', function() {
        const item = this.parentElement;
        const estaAbierto = item.classList.contains('abierto');

        // Cerrar todos
        document.querySelectorAll('.acordeon-item').forEach(el => {
            el.classList.remove('abierto');
        });

        if (!estaAbierto) {
            item.classList.add('abierto');
        }
    });
});

// ============================================================
// 4. REPRODUCTOR DE MÚSICA (funcional con audio de ejemplo)
// ============================================================
const playBtn = document.getElementById('playBtn');
const estadoMusica = document.getElementById('estadoMusica');
let audio = null;
let reproduciendo = false;

// Usamos un archivo de música libre de derechos (cambia la URL si prefieres)
// Puedes reemplazar con tu propia canción (subida a un hosting)
const URL_CANCION = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

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
// 5. CONFETI DE CORAZONES (botón sorpresa)
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
// 6. MENSAJE EN CONSOLA (detalle extra)
// ============================================================
console.log('%c💖 Felices 5 meses, amor. Este sitio es para ti. 💖', 'font-size: 20px; color: #7a2e3e; font-weight: bold;');
