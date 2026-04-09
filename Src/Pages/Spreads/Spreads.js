
import TarotEngine from "https://aiquimista-agil.github.io/Thoth-Temple-Tarot/Src/Services/TarotEngine.js";

const spreadButton = document.getElementById("spread-btn");
const resultContainer = document.getElementById("spread-container");
const questionInput = document.getElementById("question");
const spreadSelect = document.getElementById("spread-type");

const spreads = {
  three_card: {
    name: "Past Present Future",
    positions: ["Past", "Present", "Future"],
  },
  celtic_cross: {
    name: "Celtic Cross",
    positions: [
      "Present",
      "Challenge",
      "Past",
      "Future",
      "Above",
      "Below",
      "Advice",
      "External",
      "Hopes",
      "Outcome",
    ],
  },
};

spreadButton.addEventListener("click", () => {
  const question = questionInput.value;
  const selectedSpread = spreads[spreadSelect.value];

  if (!question) {
    alert("Please write your question");
    return;
  }

  const result = TarotEngine.drawSpread(selectedSpread);

  renderSpread(result);
});

function renderSpread(cards) {
  resultContainer.innerHTML = "";

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const label = document.createElement("p");
    label.textContent = card.position;

    const img = document.createElement("img");
    img.src = card.image;

    if (card.orientation === "reversed") {
      img.classList.add("reversed");
    }

    const title = document.createElement("p");
    title.textContent = card.name;

    cardElement.appendChild(label);
    cardElement.appendChild(img);
    cardElement.appendChild(title);

    resultContainer.appendChild(cardElement);
  });
}
