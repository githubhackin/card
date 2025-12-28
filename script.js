const $ = id => document.getElementById(id);
const genres = new Set();

$('in-title').oninput = e =>
    $('card-title').textContent = e.target.value || 'Título del Manhwa';

// Description input - CORREGIDO: Ahora actualiza correctamente sin necesidad de saltos de línea
$('in-desc').oninput = e => {
    const text = e.target.value;
    const length = text.length;
    
    // Actualización corregida: usa textContent en lugar de innerHTML
    $('card-desc').textContent = text || 'Descripción del manhwa...';
    $('char-count').textContent = `${length}/300`;
    
    // Cambiar color del contador según la longitud
    const counter = $('char-count');
    if (length < 250) {
        counter.className = 'text-xs text-slate-500';
    } else if (length >= 250 && length <= 300) {
        counter.className = 'text-xs text-green-400 font-bold';
    } else {
        counter.className = 'text-xs text-red-400 font-bold';
    }
};

// Hashtags input
$('in-hashtags').oninput = e => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
    $('card-hashtags').innerHTML = tags.map(t => `<span class="hashtag">${t}</span>`).join(' ');
};

// Status selector
$('in-status').onchange = e => {
    const status = e.target.value;
    const badge = $('status-badge');
    const statusTexts = {
        ongoing: 'En Emisión',
        completed: 'Completado',
        hiatus: 'En Pausa',
        cancelled: 'Cancelado'
    };
    
    if (status) {
        badge.textContent = statusTexts[status];
        badge.className = `status-badge status-${status}`;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
};

// Theme selector
let currentTheme = 'default';

document.querySelectorAll('.design-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.design-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTheme = btn.dataset.theme;
        applyTheme();
    };
});

function applyTheme() {
    const card = $('capture-target');
    card.className = `capture-area shadow-2xl card-${currentTheme}`;
}

// Font size
$('title-font-size').oninput = e => {
    const size = e.target.value;
    $('card-title').style.fontSize = size + 'px';
    $('font-size-display').textContent = size + 'px';
};

// Title color
$('title-color').oninput = e => {
    $('card-title').style.color = e.target.value;
};

// Desc color
$('desc-color').oninput = e => {
    $('card-desc').style.color = e.target.value;
};

$('in-file').onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => $('preview-img').src = ev.target.result;
    r.readAsDataURL(f);
};

document.querySelectorAll('.genre-toggle').forEach(btn => {
    btn.onclick = () => {
        const g = btn.dataset.genre;
        btn.classList.toggle('active');
        btn.classList.contains('active') ? genres.add(g) : genres.delete(g);

        $('card-genres').innerHTML =
            [...genres].map(g => `<div class="genre-pill">${g}</div>`).join('');
    };
});

/* ================= EXPORT ULTRA HD 4K ================= */
function saveCard() {
    const node = $('capture-target');
    const scale = 5; // 🔥 5x = 2000x3000px (calidad profesional)

    // Mostrar indicador de carga
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Generando imagen HD...';
    btn.disabled = true;

    domtoimage.toPng(node, {
        quality: 1,
        width: 400 * scale,
        height: 600 * scale,
        style: {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: '400px',
            height: '600px'
        }
    })
    .then(dataUrl => {
        const a = document.createElement('a');
        const filename = ($('in-title').value || 'manhwa').replace(/\s+/g, '_').toLowerCase();
        a.download = `card-${filename}-4k.png`;
        a.href = dataUrl;
        a.click();
        
        // Restaurar botón
        btn.innerHTML = '✅ ¡Descargado!';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        btn.innerHTML = '❌ Error. Intenta de nuevo';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    });
}

// Initialize
applyTheme();
$('card-title').style.fontSize = '30px';
$('card-title').style.color = '#ffffff';
$('card-desc').style.color = '#cbd5e1';