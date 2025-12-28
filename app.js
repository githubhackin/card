// Configuración de Géneros
const genres = [
    'Acción', 'Romance', 'Fantasía', 'Drama', 'Comedia', 'Aventura',
    'Misterio', 'Horror', 'Slice of Life', 'Supernatural', 'Sci-Fi', 
    'Thriller', 'Psicológico', 'Seinen', 'Shounen', 'Histórico',
    'Deportes', 'Musical', 'Ecchi', 'Isekai', 'Boys Love', 'Girls Love'
];

// Configuración de Estados
const statusConfig = {
    none: { text: '', color: '' },
    ongoing: { text: 'En Emisión', color: '#10b981' },
    completed: { text: 'Completado', color: '#3b82f6' },
    paused: { text: 'En Pausa', color: '#f59e0b' },
    cancelled: { text: 'Cancelado', color: '#ef4444' },
    upcoming: { text: 'Próximamente', color: '#8b5cf6' }
};

// Variables Globales
let selectedGenres = [];
let uploadedImage = null;
let currentZoom = 1;
let currentBlur = 30;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeGenres();
    setupEventListeners();
    updatePreview();
});

// Inicializar Géneros
function initializeGenres() {
    const container = document.getElementById('genres-container');
    genres.forEach(genre => {
        const tag = document.createElement('div');
        tag.className = 'genre-tag';
        tag.textContent = genre;
        tag.onclick = () => toggleGenre(genre, tag);
        container.appendChild(tag);
    });
}

// Toggle Género
function toggleGenre(genre, element) {
    if (selectedGenres.includes(genre)) {
        selectedGenres = selectedGenres.filter(g => g !== genre);
        element.classList.remove('active');
    } else {
        if (selectedGenres.length >= 5) {
            showNotification('Máximo 5 géneros permitidos', 'warning');
            return;
        }
        selectedGenres.push(genre);
        element.classList.add('active');
    }
    updateGenresOverlay();
}

// Actualizar Overlay de Géneros
function updateGenresOverlay() {
    const overlay = document.getElementById('card-genres-overlay');
    overlay.innerHTML = '';
    selectedGenres.forEach(genre => {
        const badge = document.createElement('span');
        badge.className = 'genre-badge';
        badge.textContent = genre;
        overlay.appendChild(badge);
    });
}

// Configurar Event Listeners
function setupEventListeners() {
    // Título
    document.getElementById('title').addEventListener('input', (e) => {
        const title = e.target.value || 'Título del Manhwa';
        document.getElementById('card-title').textContent = title;
    });

    // Autor
    document.getElementById('author').addEventListener('input', (e) => {
        const author = e.target.value;
        const authorElement = document.getElementById('card-author');
        authorElement.textContent = author ? `Por ${author}` : '';
        authorElement.style.display = author ? 'block' : 'none';
    });

    // Sinopsis
    document.getElementById('synopsis').addEventListener('input', (e) => {
        const text = e.target.value;
        const counter = document.getElementById('char-counter');
        counter.textContent = `${text.length}/400`;
        
        const synopsis = text || 'La sinopsis de tu manhwa aparecerá aquí. Agrega una descripción atractiva que capture la esencia de la historia.';
        document.getElementById('card-synopsis').textContent = synopsis;
    });

    // Capítulos
    document.getElementById('chapters').addEventListener('input', (e) => {
        const chapters = e.target.value;
        const chaptersElement = document.getElementById('card-chapters');
        chaptersElement.textContent = chapters ? `${chapters} Capítulos` : '';
        chaptersElement.style.display = chapters ? 'inline-block' : 'none';
    });

    // Rating
    document.getElementById('rating').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value).toFixed(1);
        document.getElementById('rating-value').textContent = value;
        document.getElementById('card-rating').querySelector('.rating-number').textContent = value;
    });

    // Hashtags
    document.getElementById('hashtags').addEventListener('input', (e) => {
        document.getElementById('card-hashtags').textContent = e.target.value;
    });

    // Estado
    document.getElementById('status').addEventListener('change', (e) => {
        const status = e.target.value;
        const badge = document.getElementById('card-status');
        const config = statusConfig[status];
        
        if (status === 'none') {
            badge.classList.add('hidden');
        } else {
            badge.classList.remove('hidden');
            badge.textContent = config.text;
            badge.style.backgroundColor = config.color;
            badge.style.color = '#ffffff';
        }
    });

    // Tema
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const card = document.getElementById('card');
            card.className = 'card theme-' + e.target.value;
        });
    });

    // Tamaño del Título
    document.getElementById('title-size').addEventListener('input', (e) => {
        const size = e.target.value;
        document.getElementById('title-size-value').textContent = `${size}px`;
        document.getElementById('card-title').style.fontSize = `${size}px`;
    });

    // Intensidad del Blur
    document.getElementById('blur-intensity').addEventListener('input', (e) => {
        currentBlur = e.target.value;
        document.getElementById('blur-value').textContent = `${currentBlur}px`;
        updateBlur();
    });

    // Colores
    document.getElementById('title-color').addEventListener('input', (e) => {
        document.getElementById('card-title').style.color = e.target.value;
    });

    document.getElementById('text-color').addEventListener('input', (e) => {
        document.getElementById('card-synopsis').style.color = e.target.value;
        document.getElementById('card-author').style.color = e.target.value;
    });

    document.getElementById('accent-color').addEventListener('input', (e) => {
        document.getElementById('card-hashtags').style.color = e.target.value;
    });

    // Marca de Agua
    document.getElementById('show-watermark').addEventListener('change', (e) => {
        const watermark = document.getElementById('watermark');
        watermark.style.display = e.target.checked ? 'block' : 'none';
    });

    // Imagen
    document.getElementById('cover-image').addEventListener('change', handleImageUpload);

    // Posición de Imagen
    document.getElementById('image-position').addEventListener('change', (e) => {
        const mainImage = document.querySelector('.card-image-main');
        if (mainImage) {
            const position = e.target.value;
            mainImage.style.alignItems = position === 'top' ? 'flex-start' : 
                                         position === 'bottom' ? 'flex-end' : 'center';
        }
    });

    // Zoom
    document.getElementById('zoom-in').addEventListener('click', () => adjustZoom(0.1));
    document.getElementById('zoom-out').addEventListener('click', () => adjustZoom(-0.1));
    document.getElementById('zoom-reset').addEventListener('click', () => {
        currentZoom = 1;
        updateZoom();
    });

    // Botones
    document.getElementById('download-btn').addEventListener('click', downloadCard);
    document.getElementById('reset-btn').addEventListener('click', resetForm);
}

// Manejar Carga de Imagen
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }

    document.getElementById('file-name').textContent = file.name;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        uploadedImage = event.target.result;
        updateCardImage();
    };
    reader.readAsDataURL(file);
}

// Actualizar Imagen de la Card
function updateCardImage() {
    const cardImage = document.getElementById('card-image');
    
    if (uploadedImage) {
        cardImage.innerHTML = `
            <div class="card-image-blur" id="blur-bg" style="background-image: url(${uploadedImage})"></div>
            <div class="card-image-main">
                <img src="${uploadedImage}" alt="Cover">
            </div>
        `;
        updateBlur();
    } else {
        cardImage.innerHTML = '<span class="placeholder-icon">🖼️</span>';
    }
}

// Actualizar Blur
function updateBlur() {
    const blurBg = document.getElementById('blur-bg');
    if (blurBg) {
        blurBg.style.filter = `blur(${currentBlur}px) brightness(0.7)`;
    }
}

// Ajustar Zoom
function adjustZoom(delta) {
    currentZoom = Math.max(0.5, Math.min(2, currentZoom + delta));
    updateZoom();
}

function updateZoom() {
    const card = document.getElementById('card');
    card.style.transform = `scale(${currentZoom})`;
    document.getElementById('zoom-reset').textContent = `${Math.round(currentZoom * 100)}%`;
}

// Descargar Card
async function downloadCard() {
    const card = document.getElementById('card');
    const downloadBtn = document.getElementById('download-btn');
    
    try {
        downloadBtn.disabled = true;
        downloadBtn.textContent = '⏳ Generando...';
        
        // Resetear zoom temporalmente
        const originalTransform = card.style.transform;
        card.style.transform = 'scale(1)';
        
        const canvas = await html2canvas(card, {
            scale: 2,
            backgroundColor: null,
            logging: false,
            useCORS: true,
            allowTaint: true
        });
        
        // Restaurar zoom
        card.style.transform = originalTransform;
        
        // Descargar
        const link = document.createElement('a');
        const title = document.getElementById('title').value || 'manhwa-card';
        const filename = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.png';
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showNotification('¡Card descargada exitosamente!', 'success');
    } catch (error) {
        console.error('Error al descargar:', error);
        showNotification('Error al generar la imagen. Intenta de nuevo.', 'error');
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.textContent = '⬇️ Descargar Card';
    }
}

// Resetear Formulario
function resetForm() {
    if (!confirm('¿Estás seguro de que quieres resetear todo?')) return;
    
    // Resetear inputs
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('synopsis').value = '';
    document.getElementById('chapters').value = '';
    document.getElementById('rating').value = '8';
    document.getElementById('hashtags').value = '';
    document.getElementById('status').value = 'none';
    document.getElementById('cover-image').value = '';
    document.getElementById('file-name').textContent = 'Ningún archivo seleccionado';
    
    // Resetear géneros
    selectedGenres = [];
    document.querySelectorAll('.genre-tag').forEach(tag => {
        tag.classList.remove('active');
    });
    
    // Resetear tema
    document.querySelector('input[name="theme"][value="dark"]').checked = true;
    
    // Resetear sliders
    document.getElementById('title-size').value = '32';
    document.getElementById('blur-intensity').value = '30';
    currentBlur = 30;
    
    // Resetear colores
    document.getElementById('title-color').value = '#ffffff';
    document.getElementById('text-color').value = '#e5e7eb';
    document.getElementById('accent-color').value = '#a855f7';
    
    // Resetear checkbox
    document.getElementById('show-watermark').checked = true;
    
    // Resetear imagen
    uploadedImage = null;
    
    // Resetear zoom
    currentZoom = 1;
    updateZoom();
    
    // Actualizar preview
    updatePreview();
    
    showNotification('Formulario reseteado', 'success');
}

// Actualizar Preview
function updatePreview() {
    const card = document.getElementById('card');
    card.className = 'card theme-dark';
    
    document.getElementById('card-title').textContent = 'Título del Manhwa';
    document.getElementById('card-title').style.fontSize = '32px';
    document.getElementById('card-title').style.color = '#ffffff';
    
    document.getElementById('card-author').textContent = '';
    document.getElementById('card-author').style.display = 'none';
    
    document.getElementById('card-synopsis').textContent = 'La sinopsis de tu manhwa aparecerá aquí. Agrega una descripción atractiva que capture la esencia de la historia.';
    document.getElementById('card-synopsis').style.color = '#e5e7eb';
    
    document.getElementById('card-rating').querySelector('.rating-number').textContent = '8.0';
    
    document.getElementById('card-chapters').textContent = '';
    document.getElementById('card-chapters').style.display = 'none';
    
    document.getElementById('card-hashtags').textContent = '';
    document.getElementById('card-hashtags').style.color = '#a855f7';
    
    document.getElementById('card-status').classList.add('hidden');
    
    document.getElementById('watermark').style.display = 'block';
    
    document.getElementById('char-counter').textContent = '0/400';
    document.getElementById('rating-value').textContent = '8.0';
    document.getElementById('title-size-value').textContent = '32px';
    document.getElementById('blur-value').textContent = '30px';
    
    updateGenresOverlay();
    updateCardImage();
}

// Mostrar Notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);