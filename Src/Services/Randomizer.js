// Mezcla el array (Fisher-Yates)
export function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

// Número aleatorio
export function randomIndex(max) {
  return Math.floor(Math.random() * max);
}

// Devuelve true/false
export function randomBoolean() {
  return Math.random() < 0.5;
}

// Selecciona N elementos sin repetir
export function pickRandom(array, count) {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}
