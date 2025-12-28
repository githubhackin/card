// ===== Constants =====
const GENRES = [
    'Acción', 'Aventura', 'Fantasía', 'Romance', 'Drama', 'Comedia',
    'Horror', 'Misterio', 'Isekai', 'Reencarnación', 'Regresión',
    'Artes Marciales', 'Sobrenatural', 'Psicológico', 'Sci-Fi',
    'Shounen', 'Shoujo', 'Seinen', 'Josei', 'Slice of Life',
    'Boys Love', 'Girls Love', 'Harem', 'Militar', 'Cultivación',
    'Wuxia', 'Xianxia', 'Murim', 'Sistema', 'Venganza',
    'Supervivencia', 'Apocalíptico', 'Zombies', 'Vampiros', 'Demonios',
    'Magia', 'Escolar', 'Deportes', 'Música', 'Cocina',
    'Médico', 'Histórico', 'Realeza', 'Villana', 'Transmigración',
    'Dungeons', 'Cazadores', 'Torres', 'Jugadores', 'Necromante',
    'Overpowered', 'Underdog', 'Anti-héroe', 'Tragedia', 'Maduro',
    'Gore', 'Thriller', 'Crimen', 'Mecha', 'Virtual Reality',
    'Time Loop', 'Segunda Oportunidad', 'Familia', 'Amistad', 'Traición'
];

const STATUS_MAP = {
    'none': '',
    'ongoing': 'En Emisión',
    'completed': 'Completado',
    'paused': 'En Pausa',
    'cancelled': 'Cancelado'
};

const THEME_COLORS = {
    classic: { title: '#ffffff', desc: '#9ca3af', accent: '#3b82f6' },
    dark: { title: '#ffffff', desc: '#9ca3af', accent: '#22c55e' },
    neon: { title: '#00ff88', desc: '#00ffff', accent: '#ff00ff' },
    vintage: { title: '#ffffff', desc: '#9ca3af', accent: '#8b4513' }
};

// ===== State =====
const state = {
    title: '',
    synopsis: '',
    hashtags: '',
    status: 'none',
    theme: 'dark',
    titleSize: 28,
    titleColor: '#ffffff',
    descColor: '#9ca3af',
    selectedGenres: [],
    coverImage: null
};

// ===== DOM Elements =====
const elements = {
    titleInput: document.getElementById('title'),
    synopsisInput: document.getElementById('synopsis'),
    hashtagsInput: document.getElementById('hashtags'),
    statusSelect: document.getElementById('status'),
    themeRadios: document.querySelectorAll('input[name="theme"]'),
    titleSizeSlider: document.getElementById('title-size'),
    titleSizeValue: document.getElementById('title-size-value'),
    titleColorPicker: document.getElementById('title-color'),
    descColorPicker: document.getElementById('desc-color'),
    genresContainer: document.getElementById('genres-container'),
    coverImageInput: document.getElementById('cover-image'),
    fileNameDisplay: document.getElementById('file-name'),
    downloadBtn: document.getElementById('download-btn'),
    charCounter: document.getElementById('char-counter'),
    card: document.getElementById('card'),
    cardTitle: document.getElementById('card-title'),
    cardSynopsis: document.getElementById('card-synopsis'),
    cardHashtags: document.getElementById('card-hashtags'),
    cardStatus: document.getElementById('card-status'),
    cardImage: document.getElementById('card-image'),
    cardGenresOverlay: document.getElementById('card-genres-overlay')
};

// ===== Input Handlers =====
function handleTitleChange(e) {
    state.title = e.target.value;
    updateCardTitle();
}

function handleSynopsisChange(e) {
    const text = e.target.value;
    state.synopsis = text.substring(0, 300);
    e.target.value = state.synopsis;
    updateCharCounter();
    updateCardSynopsis();
}

function handleHashtagsChange(e) {
    state.hashtags = e.target.value;
    updateCardHashtags();
}

function handleStatusChange(e) {
    state.status = e.target.value;
    updateCardStatus();
}

function handleThemeChange(e) {
    state.theme = e.target.value;
    updateCardTheme();
}

function handleTitleSizeChange(e) {
    state.titleSize = parseInt(e.target.value);
    elements.titleSizeValue.textContent = state.titleSize;
    updateCardTitleStyle();
}

function handleTitleColorChange(e) {
    state.titleColor = e.target.value;
    updateCardTitleStyle();
}

function handleDescColorChange(e) {
    state.descColor = e.target.value;
    updateCardDescStyle();
}

function handleGenreClick(genre) {
    const index = state.selectedGenres.indexOf(genre);
    if (index === -1) {
        state.selectedGenres.push(genre);
    } else {
        state.selectedGenres.splice(index, 1);
    }
    updateGenreButtons();
    updateCardGenres();
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Por favor selecciona una imagen válida (JPG, PNG o WEBP)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        state.coverImage = event.target.result;
        elements.fileNameDisplay.textContent = file.name;
        updateCardImage();
    };
    reader.readAsDataURL(file);
}

async function handleDownload() {
    try {
        elements.downloadBtn.textContent = '⏳ Generando...';
        elements.downloadBtn.disabled = true;
        
        const canvas = await html2canvas(elements.card, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#000000',
            logging: false,
            imageTimeout: 0,
            allowTaint: true
        });
        
        const link = document.createElement('a');
        const fileName = state.title ? state.title.replace(/[^a-z0-9]/gi, '-').toLowerCase() : 'manhwa-card';
        link.download = `${fileName}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
    } catch (error) {
        console.error('Error al generar la imagen:', error);
        alert('Error al generar la imagen. Por favor intenta de nuevo.');
    } finally {
        elements.downloadBtn.textContent = '⬇️ Descargar Card';
        elements.downloadBtn.disabled = false;
    }
}


// ===== Card Update Functions =====
function updateCharCounter() {
    const count = state.synopsis.length;
    elements.charCounter.textContent = `${count}/300`;
    elements.charCounter.style.color = count >= 280 ? '#ef4444' : '';
}

function updateCardTitle() {
    elements.cardTitle.textContent = state.title || 'Título del Manhwa';
}

function updateCardSynopsis() {
    elements.cardSynopsis.textContent = state.synopsis || 'La sinopsis aparecerá aquí...';
}

function updateCardHashtags() {
    const hashtags = state.hashtags.trim();
    if (hashtags) {
        const formatted = hashtags.split(/\s+/)
            .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
            .join(' ');
        elements.cardHashtags.textContent = formatted;
    } else {
        elements.cardHashtags.textContent = '';
    }
}

function updateCardStatus() {
    const statusText = STATUS_MAP[state.status];
    if (statusText) {
        elements.cardStatus.textContent = statusText;
        elements.cardStatus.classList.remove('hidden', 'status-ongoing', 'status-completed', 'status-paused', 'status-cancelled');
        elements.cardStatus.classList.add(`status-${state.status}`);
    } else {
        elements.cardStatus.classList.add('hidden');
    }
}

function updateCardTheme() {
    elements.card.className = `card theme-${state.theme}`;
    
    const colors = THEME_COLORS[state.theme];
    elements.titleColorPicker.value = colors.title;
    elements.descColorPicker.value = colors.desc;
    state.titleColor = colors.title;
    state.descColor = colors.desc;
    
    updateCardTitleStyle();
    updateCardDescStyle();
}

function updateCardTitleStyle() {
    elements.cardTitle.style.fontSize = `${state.titleSize}px`;
    elements.cardTitle.style.color = state.titleColor;
}

function updateCardDescStyle() {
    elements.cardSynopsis.style.color = state.descColor;
}

function updateCardImage() {
    if (state.coverImage) {
        elements.cardImage.innerHTML = `<img src="${state.coverImage}" alt="Cover">`;
    } else {
        elements.cardImage.innerHTML = '<span class="placeholder-text">🖼️</span>';
    }
}

function updateCardGenres() {
    elements.cardGenresOverlay.innerHTML = state.selectedGenres
        .map(genre => `<span class="card-genre-tag">${genre}</span>`)
        .join('');
}

function updateGenreButtons() {
    const buttons = elements.genresContainer.querySelectorAll('.genre-btn');
    buttons.forEach(btn => {
        const genre = btn.dataset.genre;
        btn.classList.toggle('active', state.selectedGenres.includes(genre));
    });
}

// ===== Initialization =====
function initGenres() {
    elements.genresContainer.innerHTML = GENRES
        .map(genre => `<button type="button" class="genre-btn" data-genre="${genre}">${genre}</button>`)
        .join('');
    
    elements.genresContainer.querySelectorAll('.genre-btn').forEach(btn => {
        btn.addEventListener('click', () => handleGenreClick(btn.dataset.genre));
    });
}

function initEventListeners() {
    elements.titleInput.addEventListener('input', handleTitleChange);
    elements.synopsisInput.addEventListener('input', handleSynopsisChange);
    elements.hashtagsInput.addEventListener('input', handleHashtagsChange);
    elements.statusSelect.addEventListener('change', handleStatusChange);
    
    elements.themeRadios.forEach(radio => {
        radio.addEventListener('change', handleThemeChange);
    });
    
    elements.titleSizeSlider.addEventListener('input', handleTitleSizeChange);
    elements.titleColorPicker.addEventListener('input', handleTitleColorChange);
    elements.descColorPicker.addEventListener('input', handleDescColorChange);
    
    elements.coverImageInput.addEventListener('change', handleImageUpload);
    elements.downloadBtn.addEventListener('click', handleDownload);
}

function init() {
    initGenres();
    initEventListeners();
    updateCharCounter();
    updateCardTitleStyle();
}

document.addEventListener('DOMContentLoaded', init);
