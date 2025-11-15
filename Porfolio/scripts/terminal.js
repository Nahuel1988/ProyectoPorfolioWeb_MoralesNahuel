/**
 * Renderiza una simulación de terminal en el contenedor dado
 */
export function renderTerminal(filename, content, container) {
  if (!container) return;

  // Validación de contenido
  if (typeof content !== "string" || !content.trim()) {
    container.innerHTML = `<div class="terminal-sim">⚠️ Error: contenido no válido para ${filename}</div>`;
    return;
  }

  // Crear contenedor de terminal
  const session = document.createElement("div");
  session.className = "terminal-sim";

  const output = document.createElement("pre");
  output.className = "terminal-output";

  session.appendChild(output);
  container.appendChild(session);

  simulateTerminalOutput(filename, content, output);
}

/**
 * Simula la escritura línea por línea en estilo terminal
 */
function simulateTerminalOutput(filename, content, output, speed = 40) {
  const lines = content.split("\n");
  let index = 0;

  function writeNextLine() {
    if (index >= lines.length) return;

    const line = `$ ${filename} > ${lines[index]}\n`;
    let charIndex = 0;

    const lineInterval = setInterval(() => {
      output.textContent += line[charIndex];
      charIndex++;

      output.scrollTop = output.scrollHeight;

      if (charIndex >= line.length) {
        clearInterval(lineInterval);
        index++;
        setTimeout(writeNextLine, 300);
      }
    }, speed);
  }

  writeNextLine();
}