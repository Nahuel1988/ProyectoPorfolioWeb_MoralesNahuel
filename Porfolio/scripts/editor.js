export function initEditor() {
  // Simulación de carga de archivo
  const codeArea = document.querySelector(".code-area");
  codeArea.textContent = `<html>\n  <head>\n    <title>Portfolio</title>\n  </head>\n  <body>\n    <h1>Hola Nahuel</h1>\n  </body>\n</html>`;
}
function typeInEditor(text, targetElement, speed = 30) {
  targetElement.textContent = "";
  let index = 0;

  const interval = setInterval(() => {
    targetElement.textContent += text[index];
    index++;
    if (index >= text.length) clearInterval(interval);
  }, speed);
}
typeInEditor(data[filename], codeArea); 

setTimeout(() => {
  tabs.innerHTML += `<div class="tab active">style.css</div>`;
  typeInEditor(data["style.css"], codeArea);
}, 1500);

setTimeout(() => {
  tabs.innerHTML += `<div class="tab active">script.js</div>`;
  typeInEditor(data["script.js"], codeArea);
}, 3000);