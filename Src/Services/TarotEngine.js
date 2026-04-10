// TarotEngine.js
// Módulo ES: usa fetch para obtener Cards.json y cachea el resultado.

let _cardsCache = null;
const CARDS_URL = "https://aiquimista-agil.github.io/Thoth-Temple-Tarot/Src/Data/Cards.json";

async function loadCards() {
  if (_cardsCache) return _cardsCache;

  const res = await fetch(CARDS_URL, { cache: "no-cache" });
  if (!res.ok) {
    throw new Error(`Error cargando Cards.json: ${res.status} ${res.statusText}`);
  }
  _cardsCache = await res.json();
  return _cardsCache;
}

function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getOrientation() {
  return Math.random() < 0.5 ? "upright" : "reversed";
}

async function drawCards(count = 1) {
  const cards = await loadCards();
  const deck = shuffleDeck(cards);
  const selected = deck.slice(0, count);
  return selected.map((card) => ({
    ...card,
    orientation: getOrientation(),
  }));
}

async function drawSpread(spread) {
  const cards = await loadCards();
  const deck = shuffleDeck(cards);

  return spread.positions.map((position, index) => {
    const card = deck[index];
    return {
      position,
      ...card,
      orientation: getOrientation(),
    };
  });
}

function analyzeElements(cardsDrawn) {
  const elements = {
    fire: 0,
    water: 0,
    air: 0,
    earth: 0,
  };

  // Mapa para cubrir variantes de nombres de palo
  const suitToElement = {
    wands: "fire",
    rods: "fire",
    staves: "fire",
    cups: "water",
    chalices: "water",
    swords: "air",
    blades: "air",
    disks: "earth",
    pentacles: "earth",
    coins: "earth",
    // añade más si tu JSON usa otros nombres
  };

  cardsDrawn.forEach((card) => {
    const suit = (card.suit || "").toLowerCase();
    const element = suitToElement[suit];
    if (element) elements[element]++;
  });

  return elements;
}

function getDominantElement(elements) {
  return Object.keys(elements).reduce((a, b) =>
    elements[a] > elements[b] ? a : b
  );
}

const TarotEngine = {
  loadCards,
  shuffleDeck,
  drawCards,
  drawSpread,
  analyzeElements,
  getDominantElement,
};

export default TarotEngine;
