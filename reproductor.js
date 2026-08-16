// ============================================================
// REPRODUCTOR DE MÚSICA
// ============================================================
const playBtn = document.getElementById('playBtn');
const estadoMusica = document.getElementById('estadoMusica');
let audio = null;
let reproduciendo = false;

function initReproductor() {
    const url = window.config.cancion || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    if (!audio) {
        audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0.5;
        audio.addEventListener('ended', () => {
            if (reproduciendo) { audio.currentTime = 0; audio.play(); }
        });
    } else {
        audio.src = url;
    }
}

playBtn.addEventListener('click', function() {
    if (!audio) initReproductor();
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
        }).catch(() => alert('No se pudo reproducir la música.'));
    }
});

// Inicializar al cargar
initReproductor();
