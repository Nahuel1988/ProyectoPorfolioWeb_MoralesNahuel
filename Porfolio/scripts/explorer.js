export function initExplorer(onFileSelect) {
  const iconPath = "assets/icons/";

  fetch("arbol_carpetas.json")
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar arbol_carpetas.json");
      return res.json();
    })
    .then(data => {
      const tree = document.querySelector(".file-tree");
      if (tree) renderTree(data, tree, iconPath, onFileSelect);
    })
    .catch(err => console.error("Error al cargar árbol de carpetas:", err));
}

function renderTree(data, container, iconPath, onFileSelect) {
  data.forEach(item => {
    const li = document.createElement("li");

    if (item.type === "folder") {
      renderFolder(item, li, iconPath, onFileSelect);
    } else {
      renderFile(item, li, iconPath, onFileSelect);
    }

    container.appendChild(li);
  });
}

function renderFolder(item, li, iconPath, onFileSelect) {
  li.className = "folder";
  li.innerHTML = `
    <div class="folder-header" title="Carpeta: ${item.name}">
      <img src="${iconPath}chevron-right.svg" class="arrow" />
      <img src="${iconPath}default_folder.svg" class="folder-icon" />
      <span>${item.name}</span>
    </div>
    <ul class="file-list"></ul>
  `;

  const fileList = li.querySelector(".file-list");
  renderTree(item.children, fileList, iconPath, onFileSelect);

  const header = li.querySelector(".folder-header");
  const arrow = li.querySelector(".arrow");
  const folderIcon = li.querySelector(".folder-icon");

  header.addEventListener("click", () => {
    li.classList.toggle("open");
    const isOpen = li.classList.contains("open");
    arrow.src = `${iconPath}${isOpen ? "chevron-down" : "chevron-right"}.svg`;
    folderIcon.src = `${iconPath}${isOpen ? "default_folder_opened" : "default_folder"}.svg`;
  });
}

function renderFile(item, li, iconPath, onFileSelect) {
  const fileIcon = getIconForExtension(item.name, iconPath);
  li.className = "file";
  li.innerHTML = `
    <img src="${fileIcon}" class="icon" />
    <span>${item.name}</span>
  `;

  li.addEventListener("click", () => {
    document.querySelectorAll(".file").forEach(f => f.classList.remove("active"));
    li.classList.add("active");
    onFileSelect(item); // delega la lógica
  });
}

function getIconForExtension(filename, iconPath) {
  const ext = filename.split(".").pop().toLowerCase();
  const knownIcons = ["html", "js", "css", "json", "md", "txt", "sh"];
  return `${iconPath}file_type_${knownIcons.includes(ext) ? ext : "default"}.svg`;
}