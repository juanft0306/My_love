// ============================================================
// CONFETI - Lluvia de corazones
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

// Exponer para main
window.iniciarConfeti = iniciarConfeti;
