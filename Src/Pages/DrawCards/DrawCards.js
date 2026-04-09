// DrawCards.js (module)
const repoName = 'Thoth-Temple-Tarot'; // nombre de tu repo en GitHub Pages
const repoBase = `${location.origin}/${repoName}`;

// Ruta al JSON desde /Src/Pages/DrawCards/ subiendo hasta la raíz del repo
// Ajusta si tu cards.json está en otra carpeta
const CARDS_JSON_PATH = 'https://aiquimista-agil.github.io/Thoth-Temple-Tarot/Src/Data/Cards.json';

async function loadCards() {
  try {
    const res = await fetch(CARDS_JSON_PATH);
    if (!res.ok) throw new Error(`Failed to fetch cards.json: ${res.status} ${res.statusText}`);
    const cards = await res.json();
    if (!Array.isArray(cards)) throw new Error('cards.json no contiene un array de cartas');
    return cards;
  } catch (err) {
    console.error('Error cargando cards.json:', err);
    throw err;
  }
}

function resolveImageUrl(imagePath) {
  if (!imagePath) return '';
  // Si la ruta ya es absoluta (http/https) la devolvemos tal cual
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  // Si la ruta empieza con / (ruta absoluta en servidor), en GitHub Pages hay que prefijar el repo
  if (imagePath.startsWith('/')) return `${repoBase}${imagePath}`;
  // Ruta relativa al HTML
  return imagePath;
}

function renderCard(card) {
  const imgUrl = resolveImageUrl(card.image);
  const keywords = Array.isArray(card.keywords) ? card.keywords.join(', ') : (card.keywords || '');
  return `
    <div class="card">
      <h3>${card.name || 'Unknown'}</h3>
      ${imgUrl ? `<img src="${imgUrl}" alt="${card.name}" loading="lazy">` : ''}
      <p><strong>Keywords</strong>: ${keywords}</p>
      ${card.astrology ? `<p><strong>Astrology</strong>: ${card.astrology}</p>` : ''}
      ${card.planet ? `<p><strong>Planet</strong>: ${card.planet}</p>` : ''}
    </div>
  `;
}

async function drawCards() {
  const count = parseInt(document.getElementById('card-count').value, 10) || 1;
  const container = document.getElementById('cards-container');
  container.innerHTML = '<p>Loading...</p>';

  try {
    const cards = await loadCards();
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * cards.length);
      const card = cards[idx];
      container.innerHTML += renderCard(card);
    }
  } catch (err) {
    container.innerHTML = `<p style="color:red">Error cargando cartas. Revisa la consola para más detalles.</p>`;
  }
}

// Enlaza el botón cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('draw-btn');
  if (!btn) {
    console.error('No se encontró el botón #draw-btn en el DOM');
    return;
  }
  btn.addEventListener('click', drawCards);
});
