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
        alert('Espera a que la imagen se cargue completamente.');
        return;
    }
    
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Generando imagen HD...';
    btn.disabled = true;
    
    // Crear un canvas temporal
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Dimensiones finales 4K
    const finalWidth = 2000;
    const finalHeight = 3000;
    canvas.width = finalWidth;
    canvas.height = finalHeight;
    
    // Obtener la imagen
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        // Dibujar fondo
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, finalWidth, finalHeight);
        
        // Dibujar imagen de portada (cover, centrada)
        const imgRatio = img.width / img.height;
        const canvasRatio = finalWidth / finalHeight;
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (imgRatio > canvasRatio) {
            drawHeight = finalHeight;
            drawWidth = img.width * (finalHeight / img.height);
            offsetX = (finalWidth - drawWidth) / 2;
        } else {
            drawWidth = finalWidth;
            drawHeight = img.height * (finalWidth / img.width);
            offsetY = (finalHeight - drawHeight) / 2;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Dibujar overlay según el diseño actual
        const overlayGradients = {
            gradient: ctx.createLinearGradient(0, finalHeight, 0, 0),
            dark: ctx.createLinearGradient(0, finalHeight, 0, 0),
            neon: ctx.createLinearGradient(0, finalHeight, 0, 0),
            purple: ctx.createLinearGradient(0, finalHeight, 0, 0),
            minimal: ctx.createLinearGradient(0, finalHeight, 0, 0),
            fire: ctx.createLinearGradient(0, finalHeight, 0, 0)
        };
        
        // Configurar gradientes
        overlayGradients.gradient.addColorStop(0, 'rgba(0,0,0,1)');
        overlayGradients.gradient.addColorStop(0.35, 'rgba(0,0,0,0.85)');
        overlayGradients.gradient.addColorStop(0.6, 'rgba(0,0,0,0.4)');
        overlayGradients.gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        overlayGradients.dark.addColorStop(0, 'rgba(0,0,0,0.95)');
        overlayGradients.dark.addColorStop(0.5, 'rgba(0,0,0,0.7)');
        overlayGradients.dark.addColorStop(1, 'rgba(0,0,0,0)');
        
        overlayGradients.neon.addColorStop(0, 'rgba(6,182,212,0.3)');
        overlayGradients.neon.addColorStop(0.4, 'rgba(0,0,0,0.85)');
        overlayGradients.neon.addColorStop(1, 'rgba(0,0,0,0)');
        
        overlayGradients.purple.addColorStop(0, 'rgba(139,92,246,0.4)');
        overlayGradients.purple.addColorStop(0.4, 'rgba(0,0,0,0.8)');
        overlayGradients.purple.addColorStop(1, 'rgba(0,0,0,0)');
        
        overlayGradients.minimal.addColorStop(0, 'rgba(0,0,0,0.8)');
        overlayGradients.minimal.addColorStop(0.3, 'rgba(0,0,0,0.3)');
        overlayGradients.minimal.addColorStop(0.6, 'rgba(0,0,0,0)');
        
        overlayGradients.fire.addColorStop(0, 'rgba(220,38,38,0.4)');
        overlayGradients.fire.addColorStop(0.4, 'rgba(0,0,0,0.85)');
        overlayGradients.fire.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = overlayGradients[currentDesign] || overlayGradients.gradient;
        ctx.fillRect(0, 0, finalWidth, finalHeight);
        
        // Configurar texto
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        
        const padding = 130;
        let yPosition = finalHeight - padding;
        
        // Dibujar estado (si existe)
        const statusElement = $('status-badge');
        if (statusElement.style.display !== 'none') {
            const statusText = statusElement.textContent;
            ctx.font = 'bold 60px PoppinsEmbed, sans-serif';
            const statusWidth = ctx.measureText(statusText).width;
            const statusPadding = 40;
            const statusX = finalWidth - statusWidth - statusPadding * 2 - 100;
            const statusY = 100;
            
            // Fondo del badge
            ctx.fillStyle = getStatusColor(statusElement.className);
            ctx.beginPath();
            ctx.roundRect(statusX, statusY, statusWidth + statusPadding * 2, 80, 40);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.fillText(statusText, statusX + statusPadding, statusY + 60);
        }
        
        // Dibujar géneros
        const genreElements = document.querySelectorAll('#card-genres .genre-pill');
        if (genreElements.length > 0) {
            ctx.font = 'bold 55px PoppinsEmbed, sans-serif';
            let xPos = padding;
            
            genreElements.forEach(genre => {
                const text = genre.textContent;
                const textWidth = ctx.measureText(text).width;
                const genrePadding = 30;
                
                // Fondo del género
                ctx.fillStyle = 'rgba(71, 85, 105, 0.8)';
                ctx.beginPath();
                ctx.roundRect(xPos, yPosition - 60, textWidth + genrePadding * 2, 70, 15);
                ctx.fill();
                
                // Texto del género
                ctx.fillStyle = 'white';
                ctx.fillText(text, xPos + genrePadding, yPosition - 15);
                
                xPos += textWidth + genrePadding * 2 + 40;
            });
            
            yPosition += 80;
        }
        
        // Dibujar título
        const title = $('card-title').textContent;
        ctx.font = '900 150px PoppinsEmbed, sans-serif';
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        
        // Dividir título si es muy largo
        const maxWidth = finalWidth - padding * 2;
        const titleLines = wrapText(ctx, title, maxWidth);
        titleLines.forEach(line => {
            ctx.fillText(line, padding, yPosition);
            yPosition += 160;
        });
        
        // Dibujar descripción
        const desc = $('card-desc').textContent;
        if (desc && desc !== 'Descripción del manhwa...') {
            ctx.font = '65px PoppinsEmbed, sans-serif';
            ctx.fillStyle = '#cbd5e1';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            const descLines = wrapText(ctx, desc, maxWidth);
            const maxDescLines = 8;
            descLines.slice(0, maxDescLines).forEach(line => {
                ctx.fillText(line, padding, yPosition);
                yPosition += 85;
            });
            
            yPosition += 30;
        }
        
        // Dibujar hashtags
        const hashtagElements = document.querySelectorAll('#card-hashtags .hashtag');
        if (hashtagElements.length > 0) {
            ctx.font = 'bold 55px PoppinsEmbed, sans-serif';
            ctx.fillStyle = '#06b6d4';
            ctx.shadowBlur = 10;
            
            let hashtagText = '';
            hashtagElements.forEach((tag, index) => {
                hashtagText += tag.textContent + (index < hashtagElements.length - 1 ? ' ' : '');
            });
            
            ctx.fillText(hashtagText, padding, yPosition);
        }
        
        // Dibujar borde si existe
        if (currentBorder !== 'none') {
            drawBorder(ctx, finalWidth, finalHeight);
        }
        
        // Descargar
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const filename = ($('in-title').value || 'manhwa').replace(/\s+/g, '_').toLowerCase();
            a.download = `card-${filename}-4k.png`;
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
            
            btn.innerHTML = 'Descargado';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        }, 'image/png', 1.0);
    };
    
    img.onerror = function() {
        btn.innerHTML = 'Error. Intenta de nuevo';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    };
    
    img.src = $('preview-img').src;
}

// Función auxiliar para dividir texto en líneas
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Función para obtener color del estado
function getStatusColor(className) {
    if (className.includes('ongoing')) return 'rgba(34, 197, 94, 0.9)';
    if (className.includes('completed')) return 'rgba(59, 130, 246, 0.9)';
    if (className.includes('hiatus')) return 'rgba(234, 179, 8, 0.9)';
    if (className.includes('cancelled')) return 'rgba(239, 68, 68, 0.9)';
    return 'rgba(71, 85, 105, 0.8)';
}

// Función para dibujar bordes
function drawBorder(ctx, width, height) {
    const borderWidth = {
        thin: 15,
        thick: 30,
        neon: 20,
        gold: 20,
        purple: 20
    }[currentBorder] || 0;
    
    const borderColor = {
        thin: '#ffffff',
        thick: '#ffffff',
        neon: '#06b6d4',
        gold: '#fbbf24',
        purple: '#a855f7'
    }[currentBorder] || '#ffffff';
    
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
}