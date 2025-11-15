import { renderTerminal } from "./terminal.js";

export function initExplorer() {
  const iconPath = "assets/icons/";

  fetch("arbol_carpetas.json")
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar arbol_carpetas.json");
      return res.json();
    })
    .then(data => {
      const tree = document.querySelector(".file-tree");
      if (tree) renderTree(data, tree, iconPath);
    })
    .catch(err => console.error("Error al cargar árbol de carpetas:", err));

  document.querySelector(".tabs").addEventListener("click", e => {
    if (e.target.classList.contains("close-tab")) {
      const tab = e.target.closest(".tab");
      const path = tab.dataset.path;

      tab.remove();
      document.querySelector(`.tab-content[data-path="${path}"]`)?.remove();

      const lastTab = document.querySelector(".tab:last-child");
      if (lastTab) activateTab(lastTab.dataset.path);
    } else if (e.target.closest(".tab")) {
      const tab = e.target.closest(".tab");
      activateTab(tab.dataset.path);
    }
  });
}

function renderTree(data, container, iconPath) {
  data.forEach(item => {
    const li = document.createElement("li");

    if (item.type === "folder") {
      renderFolder(item, li, iconPath);
    } else {
      renderFile(item, li, iconPath);
    }

    container.appendChild(li);
  });
}

function renderFolder(item, li, iconPath) {
  li.className = "folder";
  li.innerHTML = `
    <div class="folder-header" title="Carpeta: ${item.name}">
      <img src="${iconPath}chevron-right.svg" class="arrow" alt="Expandir carpeta" title="Expandir carpeta" />
      <img src="${iconPath}default_folder.svg" class="folder-icon" alt="Icono de carpeta" title="Icono de carpeta" />
      <span title="${item.name}">${item.name}</span>
    </div>
    <ul class="file-list"></ul>
  `;

  const fileList = li.querySelector(".file-list");
  renderTree(item.children, fileList, iconPath);

  const header = li.querySelector(".folder-header");
  const arrow = li.querySelector(".arrow");
  const folderIcon = li.querySelector(".folder-icon");

  header.addEventListener("click", () => {
    li.classList.toggle("open");

    const isOpen = li.classList.contains("open");
    arrow.src = isOpen
      ? `${iconPath}chevron-down.svg`
      : `${iconPath}chevron-right.svg`;

    folderIcon.src = isOpen
      ? `${iconPath}default_folder_opened.svg`
      : `${iconPath}default_folder.svg`;
  });
}

function renderFile(item, li, iconPath) {
  const fileIcon = getIconForExtension(item.name, iconPath);
  li.className = "file";
  li.innerHTML = `
    <img src="${fileIcon}" class="icon" />
    <span>${item.name}</span>
  `;

  li.__data = item;
  li.addEventListener("click", () => handleFileClick(item, li));
}

function handleFileClick(item, li) {
  const { name, execution, path } = item;

  document.querySelectorAll(".file").forEach(f => f.classList.remove("active"));
  li.classList.add("active");

  const tabs = document.querySelector(".tabs");
  const previewArea = document.querySelector(".preview");
  if (!previewArea) {
  console.error("⚠️ No se encontró el contenedor .preview-area en el DOM");
  return;
  }


  let tab = tabs.querySelector(`.tab[data-path="${path}"]`);
  let content = previewArea.querySelector(`.tab-content[data-path="${path}"]`);

  if (!tab) {
    tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.path = path;
    tab.innerHTML = `<span>${name}</span><button class="close-tab">×</button>`;
    tabs.appendChild(tab);

    content = document.createElement("div");
    content.className = "tab-content";
    content.dataset.path = path;
    previewArea.appendChild(content);

    fetch("archivos.json")
      .then(res => res.json())
      .then(data => {
        const fileContent = data[path];
        if (!fileContent || typeof fileContent !== "string") {
          content.innerHTML = `<div class="terminal-sim">⚠️ Archivo vacío o no encontrado</div>`;
          return;
        }

        if (execution === "terminal") {
          renderTerminal(name, fileContent, content);
        } else if (execution === "browser") {
          content.innerHTML = `<iframe class="browser-preview" srcdoc="${fileContent}"></iframe>`;
        } else {
          content.textContent = fileContent;
        }
      });
  }

  activateTab(path);
}

function activateTab(path) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => (c.style.display = "none"));

  const tab = document.querySelector(`.tab[data-path="${path}"]`);
  const content = document.querySelector(`.tab-content[data-path="${path}"]`);

  if (tab) tab.classList.add("active");
  if (content) content.style.display = "block";
}

function getIconForExtension(filename, iconPath) {
  const ext = filename.split(".").pop().toLowerCase();
  const knownIcons = ["html", "js", "css", "json", "md", "txt", "sh"];
  return `${iconPath}file_type_${knownIcons.includes(ext) ? ext : "default"}.svg`;
}