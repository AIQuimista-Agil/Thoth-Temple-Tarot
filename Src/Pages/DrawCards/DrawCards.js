// DrawCards.js (módulo)
// Versión adaptada para usar TarotEngine.js (carga remota) y renderizar cartas correctamente.

import TarotEngine from "https://aiquimista-agil.github.io/Thoth-Temple-Tarot/Src/Services/TarotEngine.js";

const repoName = "Thoth-Temple-Tarot";
const repoBase = `${location.origin}/${repoName}`;

// URL al JSON (se usa para resolver rutas relativas si las imágenes no son absolutas)
const CARDS_JSON_PATH = "https://aiquimista-agil.github.io/Thoth-Temple-Tarot/Src/Data/Cards.json";
const CARDS_JSON_BASE = new URL(".", CARDS_JSON_PATH).href;

/**
 * Resuelve la URL de la imagen de la carta.
 * - Si es absoluta (http/https) la devuelve tal cual.
 * - Si empieza con / la considera raíz del repo en GitHub Pages.
 * - Si es relativa, la resuelve respecto a la ubicación del Cards.json.
 */
function resolveImageUrl(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (imagePath.startsWith("/")) {
    // ruta absoluta en el servidor -> prefijar con repoBase
    return `${repoBase}${imagePath}`;
  }
  // ruta relativa al JSON (p. ej. "Images/card.png")
  try {
    return new URL(imagePath, CARDS_JSON_BASE).href;
  } catch {
    return imagePath;
  }
}

/**
 * Crea y devuelve un elemento DOM .card para la carta dada.
 * Usa createElement en lugar de innerHTML para evitar sobrescrituras y facilitar manipulación.
 *
 * index: número opcional para escalonar la animación (stagger)
 */
function createCardElement(card, index = 0) {
  const wrapper = document.createElement("div");
  wrapper.className = "card";
  // variable CSS para delay en la animación (usada por el CSS)
  wrapper.style.setProperty("--reveal-delay", `${index * 0.18}s`);

  // Label (posición en el spread, si aplica)
  const label = document.createElement("p");
  label.className = "label";
  label.textContent = card.position || "";

  // Title: añade "(Inverted)" si la carta viene invertida
  const title = document.createElement("p");
  title.className = "title";
  const invertedSuffix = card.orientation === "reversed" ? " (Inverted)" : "";
  title.textContent = `${card.name || "Unknown"}${invertedSuffix}`;

  // Contenedor que animará el "reveal"
  const revealSurface = document.createElement("div");
  revealSurface.className = "reveal-surface";

  // Back (mostramos el reverso inicialmente; se reemplaza por la cara frontal al terminar la animación)
  const backDiv = document.createElement("div");
  backDiv.className = "back";
  // Si quieres personalizar el reverso por carta, podrías usar card.backImage aquí.

  // Preparamos la imagen frontal (pero no la añadimos todavía)
  const img = document.createElement("img");
  img.alt = card.name || "Card";
  img.loading = "lazy";
  img.src = resolveImageUrl(card.image || "");
  // Si la carta está invertida, rotamos la imagen 180deg (CSS .reversed)
  if (card.orientation === "reversed") {
    img.classList.add("reversed");
  }

  // Metadatos opcionales (ocultos hasta reveal)
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.setAttribute("aria-hidden", "true"); // accesibilidad: oculto hasta revelado
  if (card.keywords) {
    const kw = Array.isArray(card.keywords) ? card.keywords.join(", ") : card.keywords;
    const p = document.createElement("p");
    p.innerHTML = `<strong>Keywords</strong>: ${kw}`;
    meta.appendChild(p);
  }
  if (card.astrology) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>Astrology</strong>: ${card.astrology}`;
    meta.appendChild(p);
  }
  if (card.planet) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>Planet</strong>: ${card.planet}`;
    meta.appendChild(p);
  }

  // Construcción: añadimos el reverso dentro del revealSurface para que se vea primero
  revealSurface.appendChild(backDiv);

  // Append a wrapper (orden visual: label, revealSurface, title, meta)
  wrapper.appendChild(label);
  wrapper.appendChild(revealSurface);
  wrapper.appendChild(title);
  if (meta.children.length) wrapper.appendChild(meta);

  /**
   * Cuando termine la animación de revealSurface:
   * - Reemplazamos el reverso por la imagen frontal (si existe)
   * - Añadimos la clase .revealed al wrapper para que la .meta aparezca
   */
  revealSurface.addEventListener("animationend", () => {
    // Reemplazo del reverso por la imagen frontal
    // Si la imagen ya está cargada o la URL está vacía, hacemos el swap de todas formas.
    // Mantenemos la transición visual suave.
    revealSurface.innerHTML = ""; // limpiar el reverso
    revealSurface.appendChild(img);

    // Forzar reflow para asegurar que cualquier transición CSS se aplique correctamente
    // (no siempre necesario, pero ayuda en algunos navegadores)
    // eslint-disable-next-line no-unused-expressions
    img.offsetHeight;

    // Mostrar metadatos
    wrapper.classList.add("revealed");
    meta.removeAttribute("aria-hidden");
  }, { once: true });

  return wrapper;
}

/**
 * Función principal que dibuja cartas sueltas (no spreads).
 * Usa TarotEngine.drawCards(count) para obtener cartas con orientación.
 */
async function drawCards() {
  const count = parseInt(document.getElementById("card-count")?.value, 10) || 1;
  const container = document.getElementById("cards-container");
  const btn = document.getElementById("draw-btn");

  if (!container) {
    console.error("No se encontró el contenedor #cards-container");
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Drawing...";
  }
  container.innerHTML = "<p>Loading...</p>";

  try {
    // TarotEngine.drawCards devuelve cartas con orientation
    const drawn = await TarotEngine.drawCards(count);

    // Asegurar que recibimos un array
    if (!Array.isArray(drawn)) throw new Error("TarotEngine.drawCards no devolvió un array");

    container.innerHTML = "";
    drawn.forEach((card, i) => {
      const el = createCardElement(card, i);
      container.appendChild(el);
    });
  } catch (err) {
    console.error("Error al dibujar cartas:", err);
    container.innerHTML = `<p style="color:red">Error cargando cartas. Revisa la consola para más detalles.</p>`;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Draw";
    }
  }
}

/**
 * Si quieres mostrar todas las cartas (por ejemplo para inspección),
 * puedes usar TarotEngine.loadCards() y renderizarlas.
 */
async function renderAllCards() {
  const container = document.getElementById("cards-container");
  if (!container) return;
  container.innerHTML = "<p>Loading all cards...</p>";
  try {
    const cards = await TarotEngine.loadCards();
    container.innerHTML = "";
    cards.forEach((card, i) => {
      const el = createCardElement(card, i);
      container.appendChild(el);
    });
  } catch (err) {
    console.error("Error cargando todas las cartas:", err);
    container.innerHTML = `<p style="color:red">Error cargando cartas. Revisa la consola para más detalles.</p>`;
  }
}

/* Inicialización: enlaza el botón cuando el DOM esté listo */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("draw-btn");
  if (!btn) {
    console.error("No se encontró el botón #draw-btn en el DOM");
    return;
  }
  btn.addEventListener("click", drawCards);

  // Opcional: si quieres un botón para renderizar todas las cartas para inspección
  const allBtn = document.getElementById("show-all-btn");
  if (allBtn) allBtn.addEventListener("click", renderAllCards);
});
