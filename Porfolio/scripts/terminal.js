export function initTerminal() {
  const input = document.querySelector(".terminal-input");
  const output = document.querySelector(".terminal-output");

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const command = input.value.trim();
      output.innerHTML += `\n> ${command}`;
      input.value = "";

      if (command === "clear") {
        output.innerHTML = "";
      } else if (command === "help") {
        output.innerHTML += `\nComandos disponibles: clear, help, echo [texto]`;
      } else if (command.startsWith("echo ")) {
        output.innerHTML += `\n${command.slice(5)}`;
      } else {
        output.innerHTML += `\nComando no reconocido`;
      }

      output.scrollTop = output.scrollHeight;
    }
  });
}