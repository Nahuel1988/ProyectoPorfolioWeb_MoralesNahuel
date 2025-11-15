/**
 * Inicializa el editor con un ejemplo visual (opcional)
 */
export function initEditor() {
  const codeArea = document.querySelector(".code-area");
  if (!codeArea) return;
  codeArea.textContent = "// Seleccioná un archivo para comenzar...";
  codeArea.classList.add("placeholder");
}

/**
 * Escribe texto con animación tipo máquina de escribir
 */
export function typeInEditor(text, targetElement, speed = 30) {
  return new Promise(resolve => {
    if (!targetElement || !text) return resolve();

    targetElement.textContent = "";
    let index = 0;

    const interval = setInterval(() => {
      targetElement.textContent += text[index];
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

/**
 * Renderiza contenido plano en el editor (sin animación)
 */
let escrituraActiva = null;

export function renderEditorContent(content, onFinish) {
  const codeArea = document.querySelector(".code-area");
  if (!codeArea || typeof content !== "string") return;

  // Cancelar animación anterior si existe
  if (escrituraActiva) clearTimeout(escrituraActiva);

  codeArea.textContent = "";
  let index = 0;
  const velocidad = 5;

  function escribir() {
    if (index < content.length) {
      codeArea.textContent += content.charAt(index);
      index++;
      escrituraActiva = setTimeout(escribir, velocidad);
    } else {
      escrituraActiva = null;
      if (typeof onFinish === "function") onFinish();
    }
  }

  escribir();
}
