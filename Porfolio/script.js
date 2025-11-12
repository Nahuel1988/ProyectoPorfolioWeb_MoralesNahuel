const files = {
  about: `# Sobre mí\n\nSoy Nahuel, desarrollador backend enfocado en eficiencia, seguridad y organización técnica.`,
  projects: `// Proyectos destacados\n\nconst proyectos = [\n  { nombre: "API REST saludable", stack: "Node.js + Express" },\n  { nombre: "Gestor de menús", stack: "Sheets + Scripts personalizados" }\n];`,
  README: `# Portafolio VSCode\n\nEste portfolio simula el editor web de GitHub con estilo técnico y modular.`
};

function openFile(name) {
  const tabs = document.getElementById("tabs");
  const content = document.getElementById("content");

  tabs.innerHTML = `<div>${name}.md</div>`;
  content.textContent = files[name];
}

function toggleFolder(element) {
  element.classList.toggle("open");
  event.stopPropagation();
}

const terminalBody = document.getElementById("terminal-body");
const commands = [
  "> npm start",
  "Iniciando servidor...",
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

async function buildCurriculumFromJSON() {
  const response = await fetch("cv.json");
  const data = await response.json();

  const htmlLines = [
    "<!DOCTYPE html>",
    "<html lang='es'>",
    "<head>",
    "\t<meta charset='UTF-8'>",
    `\t<title>${data.nombre} - Curriculum</title>`,
    "\t<style>",
    "\t\tbody { font-family: sans-serif; padding: 2rem; background: #f4f4f4; }",
    "\t\th1 { color: #007acc; }",
    "\t\t.profile-pic { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #007acc; margin-bottom: 1rem; }",
    "\t\t.tech-icons { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; }",
    "\t\t.tech-icons div { display: flex; align-items: center; background: #2d2d2d; color: white; padding: 6px 12px; border-radius: 4px; font-family: 'Fira Code', monospace; }",
    "\t\t.tech-icons img { width: 20px; height: 20px; margin-right: 8px; }",
    "\t</style>",
    "</head>",
    "<body>",
    `\t<img src="${data.foto}" alt="${data.nombre}" class="profile-pic" />`,
    `\t<h1>${data.nombre}</h1>`,
    `\t<p>${data.descripcion}</p>`,
    "\t<h2>Formación académica</h2>",
    `\t<p><strong>${data.formacion.institucion}</strong></p>`,
    `\t<p>${data.formacion.carrera} (${data.formacion.inicio} - ${data.formacion.estado})</p>`,
    "\t<h2>Habilidades</h2>",
    "\t<ul>",
    ...data.habilidades.map(h => `\t\t<li>${h}</li>`),
    "\t</ul>",
    "\t<h2>Lenguajes y tecnologías</h2>",
    "\t<div class='tech-icons'>",
    ...data.lenguajes.map(l => `\t\t<div><img src="assets/icons/${l.icono}" alt="${l.nombre}" /> ${l.nombre}</div>`),
    "\t</div>",
    "\t<h2>Proyectos destacados</h2>",
    ...data.proyectos.map(p => `\t<h3>${p.nombre}</h3>\n\t<p>${p.descripcion}</p>`),
    "\t<h2>Contacto</h2>",
    `\t<p>Email: ${data.contacto.email}</p>`,
    `\t<p>GitHub: ${data.contacto.github}</p>`,
    `\t<p>LinkedIn: ${data.contacto.linkedin}</p>`,
    "</body>",
    "</html>"
  ];

  const codeArea = document.getElementById("codeArea");
  const lineNumbers = document.getElementById("lineNumbers");
  codeArea.innerHTML = "";
  lineNumbers.innerHTML = "";

  let i = 0;
  const interval = setInterval(() => {
    const raw = htmlLines[i];
    const line = document.createElement("div");
    line.innerHTML = highlightHTML(raw);
    codeArea.appendChild(line);

    const lineNumber = document.createElement("div");
    lineNumber.textContent = i + 1;
    lineNumbers.appendChild(lineNumber);

    i++;
    if (i === htmlLines.length) {
      clearInterval(interval);
      setTimeout(() => {
        const html = htmlLines.join("\n");
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const iframe = document.getElementById("browserContent");
        iframe.src = url;
        document.getElementById("browserWindow").style.display = "flex";
      }, 1000);
    }
  }, 100);
}
function closeBrowserWindow() {
  document.getElementById("browserWindow").style.display = "none";
}
function highlightHTML(line) {
  return line
    .replace(/(&lt;|<)(\/?)(\w+)/g, (_, lt, slash, tag) => `${lt}<span class="token-tag">${slash}${tag}</span>`)
    .replace(/(\w+)=(".*?")/g, (_, attr, val) => `<span class="token-attr">${attr}</span>=<span class="token-string">${val}</span>`)
    .replace(/"(.*?)"/g, str => `<span class="token-string">${str}</span>`);
}