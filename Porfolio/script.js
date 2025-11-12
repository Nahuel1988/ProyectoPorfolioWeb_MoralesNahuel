// 🌐 Referencias a elementos clave
const tabs = document.getElementById("tabs");
const codeArea = document.getElementById("codeArea");
const lineNumbers = document.getElementById("lineNumbers");
const browserWindow = document.getElementById("browserWindow");
const browserContent = document.getElementById("browserContent");

// 📁 Archivos simulados para el editor
let files = {};

fetch("archivos.json")
  .then(res => res.json())
  .then(data => {
    files = data;
    startSequence(); // inicia la animación una vez cargado
  })
  .catch(err => {
    console.error("Error al cargar archivos.json:", err);
  });

// 🧹 Limpia el editor
function clearEditor() {
  codeArea.innerText = "";
  lineNumbers.innerText = "";
}

// ✍️ Escribe líneas con animación
function writeLines(lines, fileName, onComplete) {
  tabs.innerHTML = `<div>${fileName}</div>`;
  clearEditor();

  let i = 0;
  const interval = setInterval(() => {
    const line = lines[i];

    const codeLine = document.createElement("div");
    codeLine.textContent = line;
    codeArea.appendChild(codeLine);

    const lineNumber = document.createElement("div");
    lineNumber.textContent = i + 1;
    lineNumbers.appendChild(lineNumber);

    i++;
    if (i === lines.length) {
      clearInterval(interval);
      setTimeout(onComplete, 800);
    }
  }, 100);
}

// 🚀 Secuencia de carga de archivos
function startSequence() {
  writeLines(files.html, "index.html", () => {
    writeLines(files.css, "style.css", () => {
      writeLines(files.js, "script.js", () => {
        launchBrowser();
      });
    });
  });
}

// 🌐 Simula navegador con HTML generado
function launchBrowser() {
  const html = files.html.join("\n");
  const css = `<style>\n${files.css.join("\n")}\n</style>`;
  const js = `<script>\n${files.js.join("\n")}\n</script>`;

  const finalHTML = html
    .replace("</head>", `${css}</head>`)
    .replace("</body>", `${js}</body>`);

  const blob = new Blob([finalHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  browserContent.src = url;
  browserWindow.style.display = "flex";
}

function closeBrowserWindow() {
  browserWindow.style.display = "none";
}

// 🌳 Renderiza árbol de archivos desde JSON
function renderTree(data, container) {
  data.forEach(item => {
    const li = document.createElement("li");

    if (item.type === "folder") {
      li.className = "folder";
      li.innerHTML = `
        <div class="folder-header">
          <img src="assets/icons/chevron-right.svg" class="arrow" />
          <img src="assets/icons/folder-closed.svg" class="folder-icon" />
          <span>${item.name}</span>
        </div>
        <ul class="file-list"></ul>
      `;

      renderTree(item.children, li.querySelector(".file-list"));

      const header = li.querySelector(".folder-header");
      const arrow = li.querySelector(".arrow");
      const folderIcon = li.querySelector(".folder-icon");

      header.addEventListener("click", () => {
        li.classList.toggle("open");

        const isOpen = li.classList.contains("open");
        arrow.src = isOpen
          ? "assets/icons/chevron-down.svg"
          : "assets/icons/chevron-right.svg";

        folderIcon.src = isOpen
          ? "assets/icons/folder-open.svg"
          : "assets/icons/folder-closed.svg";
      });
    } else {
      li.className = "file";
      li.innerHTML = `
        <img src="assets/icons/file.svg" class="icon" />
        <span>${item.name}</span>
      `;
      li.addEventListener("click", () => {
        const codeArea = document.querySelector(".code-area");
        const tabs = document.querySelector(".tabs");
        tabs.textContent = item.name;
        codeArea.textContent = `// Contenido simulado de ${item.name}`;
      });
    }

    container.appendChild(li);
  });
}

// 📦 Carga JSON externo y genera árbol
document.addEventListener("DOMContentLoaded", () => {
  console.log("Iniciando carga del árbol…"); // ✅ debería aparecer

  const treeContainer = document.querySelector(".file-tree");

  fetch("arbol_carpetas.json")
    .then(res => res.json())
    .then(data => {
      console.log("Árbol cargado:", data); // ✅ debería mostrar el JSON
      renderFileTree(data, treeContainer);
    })
    .catch(err => {
      console.error("Error al cargar arbol_carpetas.json:", err);
    });
});
