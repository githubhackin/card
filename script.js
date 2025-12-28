const $ = id => document.getElementById(id);
const genres = new Set();
const hashtags = [];
let currentDesign = 'gradient';
let currentBorder = 'none';

// ============= TÍTULO =============
$('in-title').oninput = e => {
    $('card-title').textContent = e.target.value || 'Título del Manhwa';
};

// ============= DESCRIPCIÓN =============
$('in-desc').oninput = e => {
    const text = e.target.value;
    const length = text.length;
    
    $('card-desc').textContent = text || 'Descripción del manhwa...';
    $('char-count').textContent = `${length}/300`;
    
    const counter = $('char-count');
    if (length < 200) {
        counter.className = 'text-xs text-slate-500';
    } else if (length >= 200 && length <= 300) {
        counter.className = 'text-xs text-green-400 font-bold';
    } else {
        counter.className = 'text-xs text-red-400 font-bold';
    }
};

// ============= ESTADO =============
$('in-status').onchange = e => {
    const status = e.target.value;
    const badge = $('status-badge');
    const statusTexts = {
        ongoing: '📡 En Emisión',
        completed: '✅ Completado',
        hiatus: '⏸️ En Pausa',
        cancelled: '❌ Cancelado'
    };
    
    if (status) {
        badge.textContent = statusTexts[status];
        badge.className = `status-badge status-${status}`;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
};

// ============= IMAGEN =============
let imageLoaded = true;

$('in-file').onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
        const img = $('preview-img');
        imageLoaded = false;
        img.onload = () => {
            imageLoaded = true;
        };
        img.src = ev.target.result;
    };
    r.readAsDataURL(f);
};

// ============= GÉNEROS =============
document.querySelectorAll('.genre-toggle').forEach(btn => {
    btn.onclick = () => {
        const g = btn.dataset.genre;
        
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
            genres.delete(g);
        } else {
            if (genres.size >= 5) {
                alert('⚠️ Máximo 5 géneros permitidos');
                return;
            }
            btn.classList.add('active');
            genres.add(g);
        }
        
        updateGenres();
    };
});

function updateGenres() {
    $('card-genres').innerHTML =
        [...genres].map(g => `<div class="genre-pill">${g}</div>`).join('');
}

// ============= HASHTAGS =============
const hashtagInputs = document.querySelectorAll('.hashtag-input');

hashtagInputs.forEach((input, index) => {
    input.oninput = (e) => {
        let value = e.target.value;
        
        // Asegurar que comience con #
        if (value && !value.startsWith('#')) {
            value = '#' + value;
            e.target.value = value;
        }
        
        // Remover espacios
        value = value.replace(/\s/g, '');
        e.target.value = value;
        
        hashtags[index] = value;
        updateHashtags();
    };
});

function updateHashtags() {
    const validHashtags = hashtags.filter(tag => tag && tag.length > 1);
    $('card-hashtags').innerHTML = validHashtags.length > 0
        ? validHashtags.map(tag => `<span class="hashtag">${tag}</span>`).join(' ')
        : '';
}

function addHashtag(tag) {
    // Buscar primer input vacío
    for (let i = 0; i < hashtagInputs.length; i++) {
        if (!hashtagInputs[i].value) {
            hashtagInputs[i].value = tag;
            hashtags[i] = tag;
            updateHashtags();
            break;
        }
    }
}

// ============= TABS =============
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    $(`tab-${tabName}`).classList.add('active');
}

// ============= DISEÑO =============
function changeDesign(design) {
    currentDesign = design;
    document.querySelectorAll('[data-design]').forEach(opt => opt.classList.remove('active'));
    event.target.closest('.design-option').classList.add('active');
    
    const overlay = $('card-overlay');
    overlay.className = `card-overlay-${design}`;
}

// ============= BORDE =============
function changeBorder(border) {
    currentBorder = border;
    document.querySelectorAll('[data-border]').forEach(opt => opt.classList.remove('active'));
    event.target.closest('.design-option').classList.add('active');
    
    const target = $('capture-target');
    target.className = `capture-area shadow-2xl border-${border}-style`;
}

// ============= EXPORTAR 4K =============
function saveCard() {
    if (!imageLoaded) {
        alert('⏳ Espera a que la imagen se cargue completamente.');
        return;
    }
    
    const node = $('capture-target');
    const scale = 5; // 2000x3000px
    
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Generando imagen HD...';
    btn.disabled = true;
    
    setTimeout(() => {
        domtoimage.toPng(node, {
            width: 400 * scale,
            height: 600 * scale,
            quality: 1,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: '400px',
                height: '600px'
            },
            cacheBust: true
        })
        .then(dataUrl => {
            const a = document.createElement('a');
            const filename = ($('in-title').value || 'manhwa').replace(/\s+/g, '_').toLowerCase();
            a.download = `card-${filename}-4k.png`;
            a.href = dataUrl;
            a.click();
            
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
    }, 500);
}