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

spreadButton.addEventListener("click", async () => {
  const question = (questionInput.value || "").trim();
  const selectedSpread = spreads[spreadSelect.value];

  if (!question) {
    alert("Please write your question");
    return;
  }

  if (!selectedSpread) {
    alert("Selecciona un tipo de tirada válido.");
    return;
  }

  // UX: deshabilitar botón mientras se procesa
  spreadButton.disabled = true;
  spreadButton.textContent = "Drawing...";

  try {
    // drawSpread es async en la versión corregida de TarotEngine
    const result = await TarotEngine.drawSpread(selectedSpread);

    // Validación: asegurar que recibimos un array
    if (!Array.isArray(result)) {
      throw new Error("Unexpected result from TarotEngine.drawSpread");
    }

    renderSpread(result);
  } catch (err) {
    console.error("Error drawing spread:", err);
    alert("Ocurrió un error al cargar las cartas. Revisa la consola para más detalles.");
  } finally {
    spreadButton.disabled = false;
    spreadButton.textContent = "Draw Spread";
  }
});

function renderSpread(cards) {
  resultContainer.innerHTML = "";

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const label = document.createElement("p");
    label.textContent = card.position || "";

    const img = document.createElement("img");
    // fallback si no hay imagen
    img.src = card.image || "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='14'>No image</text></svg>";
    img.alt = card.name || "Card";

    // Asegurar que la clase reversed se aplica/quita correctamente
    if (card.orientation === "reversed") {
      img.classList.add("reversed");
    } else {
      img.classList.remove("reversed");
    }

    const title = document.createElement("p");
    title.textContent = card.name || "";

    cardElement.appendChild(label);
    cardElement.appendChild(img);
    cardElement.appendChild(title);

    resultContainer.appendChild(cardElement);
  });
}
