// ============================================================
// MAIN - Inicialización y eventos de interfaz
// ============================================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // 1. Aplicar configuración inicial
    aplicarConfiguracion();

    // 2. Acordeón
    document.querySelectorAll('.acordeon-header').forEach(h => {
        h.addEventListener('click', function() {
            const item = this.parentElement;
            const abierto = item.classList.contains('abierto');
            document.querySelectorAll('.acordeon-item').forEach(el => el.classList.remove('abierto'));
            if (!abierto) item.classList.add('abierto');
        });
    });

    // 3. Botón de confeti (en la carta)
    document.getElementById('btnConfeti').addEventListener('click', function() {
        window.iniciarConfeti();
        document.getElementById('mensajeOculto').classList.add('visible');
        this.textContent = '🎉 ¡Sorpresa! 🎉';
        setTimeout(() => this.textContent = '✨ ¡Presiona para una sorpresa! ✨', 3000);
    });

    // 4. Botón Cuento 3D
    document.getElementById('btnCuento3d').addEventListener('click', window.iniciarCuento3D);
    document.getElementById('cerrarCuento').addEventListener('click', window.cerrarCuento3D);
    document.getElementById('btnSiguiente').addEventListener('click', window.siguienteCapitulo);

    // 5. Cerrar cuento con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('cuentoOverlay');
            if (overlay.classList.contains('abierto')) window.cerrarCuento3D();
        }
    });

    // 6. Panel de configuración
    const configBtn = document.getElementById('configBtn');
    const configModal = document.getElementById('configModal');
    const configClose = document.getElementById('configClose');

    configBtn.addEventListener('click', abrirModal);
    configClose.addEventListener('click', cerrarModal);
    window.addEventListener('click', (e) => {
        if (e.target === configModal) cerrarModal();
    });

    // 7. Eventos en vivo del formulario de configuración
    document.querySelectorAll('#configForm input, #configForm textarea').forEach(input => {
        if (input.type !== 'file') {
            input.addEventListener('input', sincronizarInputs);
            input.addEventListener('change', sincronizarInputs);
        }
    });

    // 8. Agregar evento
    document.getElementById('agregarEventoBtn').addEventListener('click', function() {
        window.config.eventos.push({ fecha: '', titulo: '', desc: '' });
        sincronizarInputs();
        renderizarEventosConfig();
        document.getElementById('eventosContainer').scrollTop = document.getElementById('eventosContainer').scrollHeight;
    });

    // 9. Guardar y restaurar
    document.getElementById('configGuardar').addEventListener('click', function() {
        sincronizarInputs();
        window.guardarConfiguracion();
        cerrarModal();
        alert('✅ ¡Cambios guardados!');
    });
    document.getElementById('configRestaurar').addEventListener('click', function() {
        if (confirm('¿Restaurar valores por defecto?')) {
            window.config = { ...window.DEFAULT_CONFIG };
            window.guardarConfiguracion();
            // Actualizar reproductor
            const audio = window.audio;
            if (audio) audio.src = window.config.cancion;
            aplicarConfiguracion();
            cerrarModal();
            alert('↩️ Restaurado.');
        }
    });

    // 10. Carga de imagen
    document.getElementById('cfgFotoFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            const dataUrl = event.target.result;
            window.config.foto = dataUrl;
            document.getElementById('cfgFotoPreview').src = dataUrl;
            document.getElementById('cfgFotoPreview').style.display = 'block';
            document.getElementById('fotoPolaroid').src = dataUrl;
            window.autoGuardar();
        };
        reader.readAsDataURL(file);
    });

    // 11. Doble clic en canvas de confeti para detener
    document.getElementById('confeti-canvas').addEventListener('dblclick', function() {
        if (window.confetiActivo) {
            // No tenemos acceso directo, pero podemos recargar la página o simplemente no hacer nada
            // Mejor dejarlo así.
        }
    });

    console.log('🚀 Todo listo y funcionando.');
});

// ============================================================
// FUNCIONES COMPARTIDAS (usadas por main y config)
// ============================================================

function aplicarConfiguracion() {
    const config = window.config;
    // Fecha inicio
    if (config.fechaInicio) {
        const parts = config.fechaInicio.split('T');
        const fecha = parts[0].split('-');
        const hora = parts[1] ? parts[1].split(':') : ['0','0'];
        const FECHA_INICIO = new Date(parseInt(fecha[0]), parseInt(fecha[1])-1, parseInt(fecha[2]), parseInt(hora[0]), parseInt(hora[1]));
        // Actualizar contador (global)
        window.FECHA_INICIO = FECHA_INICIO;
        if (window.actualizarContador) window.actualizarContador();
    }
    // Títulos
    document.getElementById('tituloPrincipal').textContent = config.titulo || 'Felices 5 Meses, Mi Amor';
    document.getElementById('subtituloPrincipal').textContent = config.subtitulo || 'Cada día a tu lado es un regalo';
    // Foto
    if (config.foto) document.getElementById('fotoPolaroid').src = config.foto;
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
    document.getElementById('acordeon1Titulo').textContent = config.acordeon1Titulo || '';
    document.querySelector('#acordeon1Contenido p').textContent = config.acordeon1Contenido || '';
    document.getElementById('acordeon2Titulo').textContent = config.acordeon2Titulo || '';
    document.querySelector('#acordeon2Contenido p').textContent = config.acordeon2Contenido || '';
    document.getElementById('acordeon3Titulo').textContent = config.acordeon3Titulo || '';
    document.querySelector('#acordeon3Contenido p').textContent = config.acordeon3Contenido || '';
    // Gustos
    document.getElementById('gusto1Titulo').textContent = config.gusto1Titulo || '';
    document.getElementById('gusto1Desc').textContent = config.gusto1Desc || '';
    document.getElementById('gusto2Titulo').textContent = config.gusto2Titulo || '';
    document.getElementById('gusto2Desc').textContent = config.gusto2Desc || '';
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

function renderizarEventos() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    const eventos = window.config.eventos || [];
    if (eventos.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--vino-claro);">Agrega eventos desde configuración ❤️</p>';
        return;
    }
    let html = '';
    eventos.forEach(ev => {
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

function renderizarEventosConfig() {
    const container = document.getElementById('eventosContainer');
    if (!container) return;
    const eventos = window.config.eventos || [];
    container.innerHTML = '';
    if (eventos.length === 0) {
        container.innerHTML = '<p style="color:var(--vino-claro);">No hay eventos. Agrega uno.</p>';
        return;
    }
    eventos.forEach((ev, index) => {
        const div = document.createElement('div');
        div.className = 'evento-config';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="color:var(--vino);">#${index + 1}</strong>
                <div>
                    ${index > 0 ? `<button type="button" class="mover-evento" data-index="${index}" data-dir="-1" style="background:var(--rose); border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; font-size:1rem;">⬆️</button>` : ''}
                    ${index < eventos.length - 1 ? `<button type="button" class="mover-evento" data-index="${index}" data-dir="1" style="background:var(--rose); border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; font-size:1rem;">⬇️</button>` : ''}
                    <button type="button" class="eliminar-evento" data-index="${index}" style="background:#ff6b6b; color:white; border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; font-size:1rem;">✕</button>
                </div>
            </div>
            <div class="config-group"><label>Fecha:</label><input type="text" class="ev-fecha" value="${ev.fecha || ''}" placeholder="Ej: 24 de diciembre de 2025" /></div>
            <div class="config-group"><label>Título:</label><input type="text" class="ev-titulo" value="${ev.titulo || ''}" placeholder="Ej: El inicio de todo" /></div>
            <div class="config-group"><label>Descripción:</label><input type="text" class="ev-desc" value="${ev.desc || ''}" placeholder="Breve descripción" /></div>
        `;
        container.appendChild(div);
    });

    // Asignar eventos a los nuevos inputs
    document.querySelectorAll('.evento-config input').forEach(inp => {
        inp.addEventListener('input', sincronizarInputs);
        inp.addEventListener('change', sincronizarInputs);
    });

    // Eliminar eventos
    document.querySelectorAll('.eliminar-evento').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            window.config.eventos.splice(idx, 1);
            sincronizarInputs();
            renderizarEventosConfig();
        });
    });

    // Mover eventos
    document.querySelectorAll('.mover-evento').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            const dir = parseInt(this.dataset.dir);
            const newIdx = idx + dir;
            if (newIdx < 0 || newIdx >= window.config.eventos.length) return;
            const temp = window.config.eventos[idx];
            window.config.eventos[idx] = window.config.eventos[newIdx];
            window.config.eventos[newIdx] = temp;
            sincronizarInputs();
            renderizarEventosConfig();
        });
    });
}

function sincronizarInputs() {
    const config = window.config;
    // Leer todos los campos del formulario y actualizar config
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

    // Eventos: leer desde los inputs dinámicos
    const eventosNodes = document.querySelectorAll('.evento-config');
    const nuevosEventos = [];
    eventosNodes.forEach(node => {
        const fecha = node.querySelector('.ev-fecha').value;
        const titulo = node.querySelector('.ev-titulo').value;
        const desc = node.querySelector('.ev-desc').value;
        nuevosEventos.push({ fecha, titulo, desc });
    });
    config.eventos = nuevosEventos;

    // Aplicar cambios en vivo
    aplicarConfiguracion();
    window.autoGuardar();
}

function abrirModal() {
    const config = window.config;
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
    document.getElementById('configModal').classList.add('mostrar');
}

function cerrarModal() {
    document.getElementById('configModal').classList.remove('mostrar');
}
