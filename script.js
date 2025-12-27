const $ = id => document.getElementById(id);
const genres = new Set();

$('in-title').oninput = e =>
    $('card-title').textContent = e.target.value || 'Título del Manhwa';

$('in-desc').oninput = e =>
    $('card-desc').textContent = e.target.value || 'Descripción del manhwa...';

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