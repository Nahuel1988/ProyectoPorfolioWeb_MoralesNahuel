export function initEditor() {
  const codeArea = document.querySelector(".code-area");
  if (!codeArea) return;

  const ejemplo = `<html>\n  <head>\n    <title>Portfolio</title>\n  </head>\n  <body>\n    <h1>Hola Nahuel</h1>\n  </body>\n</html>`;
  typeInEditor(ejemplo, codeArea);
}

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

export function cargarArchivo(filename) {
  const codeArea = document.querySelector(".code-area");
  if (!codeArea || !filename) return;

  fetch("style/archivos.json")
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar archivos.json");
      return res.json();
    })
    .then(data => {
      const contenido = data[filename];
      if (contenido) {
        typeInEditor(contenido, codeArea);
      }
    })
    .catch(err => console.error("Error al cargar archivo:", err));
}