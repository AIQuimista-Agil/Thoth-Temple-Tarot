
import cards from "https://aiquimista-agil.github.io/Thoth-Temple-Tarot/Src/Data/Cards.json";

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

function drawCards(count = 1) {
  const deck = shuffleDeck(cards);

  const selected = deck.slice(0, count);

  return selected.map((card) => ({
    ...card,
    orientation: getOrientation(),
  }));
}

function drawSpread(spread) {

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

function getDominantElement(elements) {
  return Object.keys(elements).reduce((a, b) =>
    elements[a] > elements[b] ? a : b
  );
}

const TarotEngine = {
  shuffleDeck,
  drawCards,
  drawSpread,
  analyzeElements,
  getDominantElement,
};

export default TarotEngine;
