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
function renderFileTree(data, container) {
  data.forEach(item => {
    if (item.type === "folder") {
      const folder = document.createElement("li");
      folder.classList.add("folder");

      const header = document.createElement("div");
      header.classList.add("folder-header");
      header.innerHTML = `
        <img src="assets/icons/folder-closed.svg" class="icon" />
        <span>${item.name}</span>
      `;
      folder.appendChild(header);

      const childrenList = document.createElement("ul");
      childrenList.classList.add("file-list");

      renderFileTree(item.children, childrenList);
      folder.appendChild(childrenList);

      header.addEventListener("click", () => {
        folder.classList.toggle("open");
        const icon = header.querySelector("img");
        icon.src = folder.classList.contains("open")
          ? "assets/icons/folder-open.svg"
          : "assets/icons/folder-closed.svg";
      });

      container.appendChild(folder);
    } else {
      const file = document.createElement("li");
      const ext = item.name.split(".").pop();
      file.innerHTML = `
        <img src="assets/icons/file-${ext}.svg" class="icon" />
        ${item.name}
      `;
      container.appendChild(file);
    }
  });
}

// 📦 Carga JSON externo y genera árbol
document.addEventListener("DOMContentLoaded", () => {
  const treeContainer = document.querySelector(".file-tree");

  fetch("arbol_carpetas.json")
    .then(res => res.json())
    .then(data => {
      renderFileTree(data, treeContainer);
    })
    .catch(err => {
      console.error("Error al cargar arbol_carpetas.json:", err);
    });
});