import { renderTerminal } from "./terminal.js";

export function initExplorer() {
  const iconPath = "assets/icons/";

  fetch("arbol_carpetas.json")
    .then(res => res.json())
    .then(data => {
      const tree = document.querySelector(".file-tree");
      renderTree(data, tree, iconPath);
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
    <div class="folder-header">
      <img src="${iconPath}chevron-right.svg" class="arrow" />
      <img src="${iconPath}default_folder.svg" class="folder-icon" />
      <span>${item.name}</span>
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
  document.querySelectorAll(".file").forEach(f => f.classList.remove("active"));
  li.classList.add("active");

  const { name, execution, path } = item;
  const tabs = document.querySelector(".tabs");
  const codeArea = document.querySelector(".code-area");
  const preview = document.querySelector(".preview");

  tabs.innerHTML = `<div class="tab active">${name}</div>`;
  codeArea.textContent = "";
  preview.innerHTML = "";

  fetch("archivos.json")
    .then(res => res.json())
    .then(data => {
      const content = data[path];
      if (!content) return;

      typeInEditor(content, codeArea);

      if (execution === "terminal") {
        renderTerminal(name, content);
      } else if (execution === "browser") {
        preview.innerHTML = `<iframe class="browser-preview" srcdoc="${content}"></iframe>`;
      }
    });
}

function getIconForExtension(filename, iconPath) {
  const ext = filename.split(".").pop().toLowerCase();
  const knownIcons = ["html", "js", "css", "json", "md", "txt", "sh"];
  return `${iconPath}file_type_${knownIcons.includes(ext) ? ext : "default"}.svg`;
}

function typeInEditor(text, targetElement, speed = 30) {
  return new Promise(resolve => {
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