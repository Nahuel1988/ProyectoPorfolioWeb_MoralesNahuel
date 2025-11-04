const files = {
  about: `# Sobre mí\n\nSoy Nahuel, desarrollador backend enfocado en eficiencia, seguridad y organización técnica. Me especializo en depuración de entornos y gestión de dependencias.`,
  projects: `// Proyectos destacados\n\nconst proyectos = [\n  { nombre: "API REST saludable", stack: "Node.js + Express" },\n  { nombre: "Gestor de menús", stack: "Sheets + Scripts personalizados" }\n];`,
  contact: `{\n  "email": "nahuel.dev@ejemplo.com",\n  "ubicación": "Mendoza, Argentina",\n  "github": "github.com/nahueldev"\n}`
};

function openFile(name) {
  const tabs = document.getElementById("tabs");
  const content = document.getElementById("content");

  tabs.innerHTML = `<div>${name}.md</div>`;
  content.textContent = files[name];
};

const terminalBody = document.getElementById("terminal-body");
const commands = [
  "> npm start",
  "Starting backend server...",
  "API REST disponible en http://localhost:3000",
  "> curl contacto",
  "{ email: 'nahuel.dev@ejemplo.com', github: 'nahueldev' }"
];

let index = 1;

function showNextCommand() {
  if (index < commands.length) {
    const line = document.createElement("div");
    line.className = "line";
    line.textContent = commands[index];
    terminalBody.appendChild(line);
    index++;
    setTimeout(showNextCommand, 2000);
  }
}

setTimeout(showNextCommand, 1500);

function toggleFolder(element) {
  element.classList.toggle("open");
  event.stopPropagation();
}