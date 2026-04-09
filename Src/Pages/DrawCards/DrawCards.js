
import TarotEngine from "../../Services/TarotEngine.js";

const drawButton = document.getElementById("draw-btn");
const resultContainer = document.getElementById("cards-container");
const selectCount = document.getElementById("card-count");
const questionInput = document.getElementById("question");

drawButton.addEventListener("click", () => {
  const count = parseInt(selectCount.value);
  const question = questionInput.value;

  if (!question) {
    alert("Please write your question");
    return;
  }

  const result = TarotEngine.drawCards(count);

  renderCards(result);
});

/* ===================== */
/*     RENDER CARDS      */
/* ===================== */

function renderCards(cards) {
  resultContainer.innerHTML = "";

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const img = document.createElement("img");
    img.src = card.image;

    if (card.orientation === "reversed") {
      img.classList.add("reversed");
    }

    const title = document.createElement("p");
    title.textContent = `${card.name} (${card.orientation})`;

    cardElement.appendChild(img);
    cardElement.appendChild(title);

    resultContainer.appendChild(cardElement);
  });
}
