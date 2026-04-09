// tarotEngine.js

import cards from "https://aiquimista-agil.github.io/Thoth-Temple-Tarot/Src/Data/Cards.json";

/* ===================== */
/*      UTILITIES        */
/* ===================== */

// Fisher-Yates shuffle (el bueno 🔥)
function shuffleDeck(deck) {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// Define si la carta sale invertida
function getOrientation() {
  return Math.random() < 0.5 ? "upright" : "reversed";
}

/* ===================== */
/*      CORE LOGIC       */
/* ===================== */

// Tirada simple (Draw Cards)
function drawCards(count = 1) {
  const deck = shuffleDeck(cards);

  const selected = deck.slice(0, count);

  return selected.map((card) => ({
    ...card,
    orientation: getOrientation(),
  }));
}

// Tirada con spread (Use Tarot Spread)
function drawSpread(spread) {
  /**
   spread = {
   *   name: "Celtic Cross",
   *   positions: [
   *     "Present",
   *     "Challenge",
   *     ...
   *   ]
   * }
   */

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

/* ===================== */
/*      EXTRA (PRO)      */
/* ===================== */

// Conteo de energías (útil para interpretación futura)
function analyzeElements(cardsDrawn) {
  const elements = {
    fire: 0,
    water: 0,
    air: 0,
    earth: 0,
  };

  cardsDrawn.forEach((card) => {
    switch (card.suit) {
      case "wands":
        elements.fire++;
        break;
      case "cups":
        elements.water++;
        break;
      case "swords":
        elements.air++;
        break;
      case "disks":
        elements.earth++;
        break;
    }
  });

  return elements;
}

// Detecta mayoría (ej: lectura muy emocional, muy mental, etc.)
function getDominantElement(elements) {
  return Object.keys(elements).reduce((a, b) =>
    elements[a] > elements[b] ? a : b
  );
}

/* ===================== */
/*      EXPORT           */
/* ===================== */

const TarotEngine = {
  shuffleDeck,
  drawCards,
  drawSpread,
  analyzeElements,
  getDominantElement,
};

export default TarotEngine;
