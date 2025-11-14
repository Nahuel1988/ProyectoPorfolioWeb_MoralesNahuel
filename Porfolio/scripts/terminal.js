export function renderTerminal(filename, content) {
  const preview = document.querySelector(".preview");
  preview.innerHTML = `
    <div class="terminal-sim">
      <pre class="terminal-output"></pre>
    </div>
  `;

  const output = preview.querySelector(".terminal-output");
  simulateTerminalOutput(filename, content, output);
}

function simulateTerminalOutput(filename, content, output, speed = 40) {
  const lines = content.split("\n");
  let index = 0;

  function writeNextLine() {
    if (index >= lines.length) return;

    const line = `$ ${filename}\n${lines[index]}\n`;
    let charIndex = 0;

    const lineInterval = setInterval(() => {
      output.textContent += line[charIndex];
      charIndex++;
      if (charIndex >= line.length) {
        clearInterval(lineInterval);
        index++;
        setTimeout(writeNextLine, 300);
      }
    }, speed);
  }

  writeNextLine();
}