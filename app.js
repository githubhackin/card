const inTitle = document.getElementById('in-title'),
      inGenres = document.getElementById('in-genres'), // Captura géneros
      inSynop = document.getElementById('in-synop'),
      inTags = document.getElementById('in-tags'),
      inStatus = document.getElementById('in-status'),
      inFile = document.getElementById('in-file'),
      colTitle = document.getElementById('col-title'),
      colGenre = document.getElementById('col-genre');

const dTitle = document.getElementById('display-title'),
      dGenres = document.getElementById('genres-row'), // Muestra géneros
      dSynop = document.getElementById('display-synop'),
      dTags = document.getElementById('tags-container'),
      dStatus = document.getElementById('display-status'),
      dBg = document.getElementById('card-bg');

// Lógica de Géneros
inGenres.oninput = () => {
    const list = inGenres.value.split(',');
    dGenres.innerHTML = '';
    list.forEach(g => {
        if(g.trim()) {
            const span = document.createElement('span');
            span.className = 'genre-item';
            span.innerText = g.trim();
            span.style.backgroundColor = colGenre.value; // Color personalizado
            dGenres.appendChild(span);
        }
    });
};

// Actualizar colores de géneros ya existentes cuando cambias el selector
colGenre.oninput = () => {
    document.querySelectorAll('.genre-item').forEach(item => {
        item.style.backgroundColor = colGenre.value;
    });
};

// El resto de la lógica se mantiene igual
inTitle.oninput = () => dTitle.innerText = inTitle.value || "Título del Manhwa";
inSynop.oninput = () => dSynop.innerText = inSynop.value || "Sinopsis...";

const tagColors = ['#ff4757', '#3742fa', '#2ed573', '#ffa502', '#e84393', '#6366f1'];
inTags.oninput = () => {
    const tags = inTags.value.split(' ');
    dTags.innerHTML = '';
    tags.forEach((t, i) => {
        if(t.startsWith('#') && t.length > 1) {
            const span = document.createElement('span');
            span.className = 'tag-pill';
            span.innerText = t;
            span.style.backgroundColor = tagColors[i % tagColors.length];
            dTags.appendChild(span);
        }
    });
};

inStatus.onchange = () => {
    const opt = inStatus.options[inStatus.selectedIndex];
    if(inStatus.value) {
        dStatus.style.display = 'block';
        dStatus.innerText = inStatus.value;
        dStatus.style.backgroundColor = opt.dataset.color;
    } else {
        dStatus.style.display = 'none';
    }
};

colTitle.oninput = () => dTitle.style.color = colTitle.value;

const applyFilters = () => { dBg.style.filter = `brightness(${document.getElementById('range-bright').value}%) contrast(${document.getElementById('range-contrast').value}%)`; };
document.getElementById('range-bright').oninput = applyFilters;
document.getElementById('range-contrast').oninput = applyFilters;

inFile.onchange = function() {
    const r = new FileReader();
    r.onload = e => dBg.style.backgroundImage = `url(${e.target.result})`;
    r.readAsDataURL(this.files[0]);
};

document.getElementById('download-btn').onclick = () => {
    const captureArea = document.getElementById('capture-area');
    const originalTransform = captureArea.style.transform;
    captureArea.style.transform = 'none';

    html2canvas(captureArea, {
        scale: 4, 
        useCORS: true,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `card-${inTitle.value || 'manhwa'}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        captureArea.style.transform = originalTransform;
    });
};