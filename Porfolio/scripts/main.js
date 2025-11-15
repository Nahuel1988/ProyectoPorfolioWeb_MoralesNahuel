// 🔧 Cargar componentes visuales
function loadComponent(id, file) {
  return fetch(`components/${file}`)
    .then(res => {
      if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
      return res.text();
    })
    .then(html => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = html;
    })
    .catch(err => console.error(`Error al cargar ${file}:`, err));
}

// 🧠 Estado global
let archivos = {};
let archivoActivo = null;

// Caché de módulos
const moduleCache = {};

function getModule(name, path) {
  if (!moduleCache[name]) moduleCache[name] = import(path);
  return moduleCache[name];
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await Promise.all([
      loadComponent("sidebar", "sidebar.html"),
      loadComponent("explorer", "explorer.html"),
      loadComponent("editor", "editor.html"),
      loadComponent("terminal", "terminal.html"),
      loadComponent("statusbar", "statusbar.html")
    ]);

    const [sidebar, explorer, editor, terminal, browser] = await Promise.all([
      getModule("sidebar", "./sidebar.js"),
      getModule("explorer", "./explorer.js"),
      getModule("editor", "./editor.js"),
      getModule("terminal", "./terminal.js"),
      getModule("browser", "./browser.js")
    ]);

    sidebar.initSidebar?.();
    editor.initEditor?.();
    terminal.initTerminal?.();
    browser.initBrowser?.();
    window.closeBrowser = browser.closeBrowser;

    const res = await fetch("archivos.json");
    if (!res.ok) throw new Error("No se pudo cargar archivos.json");
    archivos = await res.json();

    explorer.initExplorer?.(handleFileClick);
    attachTabListeners();
  } catch (err) {
    console.error("Error al inicializar la aplicación:", err);
  }
});

// 🧩 Helpers de pestañas y DOM

function createTab(item) {
  const tab = document.createElement("div");
  tab.className = "tab";
  tab.dataset.path = item.path;
  tab.dataset.execution = item.execution || detectExecutionType(item.path);
  tab.innerHTML = `<span>${item.name}</span><button class="close-tab">×</button>`;
  document.querySelector(".tabs")?.appendChild(tab);
  return tab;
}

function createTabContent(path) {
  const previewArea = document.querySelector(".preview");
  if (!previewArea) return null;
  const content = document.createElement("div");
  content.className = "tab-content";
  content.dataset.path = path;
  previewArea.appendChild(content);
  return content;
}

function getTab(path) {
  return document.querySelector(`.tab[data-path="${path}"]`);
}

function getTabContent(path) {
  return document.querySelector(`.tab-content[data-path="${path}"]`);
}

function removeTab(path) {
  getTab(path)?.remove();
  getTabContent(path)?.remove();
}

function activateTab(path) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => (c.style.display = "none"));

  getTab(path)?.classList.add("active");
  const content = getTabContent(path);
  if (content) content.style.display = "block";
}

function attachTabListeners() {
  document.addEventListener("click", async e => {
    const closeBtn = e.target.closest(".close-tab");
    if (closeBtn) {
      const tab = closeBtn.closest(".tab");
      if (!tab) return;
      const path = tab.dataset.path;
      removeTab(path);

      const lastTab = document.querySelector(".tab:last-child");
      if (lastTab) {
        activateTab(lastTab.dataset.path);
        const execution = lastTab.dataset.execution;
        const content = archivos[lastTab.dataset.path];
        const tabContent = getTabContent(lastTab.dataset.path);
        renderContent(execution, lastTab.dataset.path, content, tabContent);
      } else {
        // 🧹 No hay más pestañas abiertas → limpiar editor
        const editorMod = await getModule("editor", "./editor.js");
        editorMod.renderEditorContent?.("");
      }

      return;
    }


    const tab = e.target.closest(".tab");
    if (tab) {
      const path = tab.dataset.path;
      archivoActivo = path;
      activateTab(path);
      const execution = tab.dataset.execution;
      const content = archivos[path];
      const tabContent = getTabContent(path);
      renderContent(execution, path, content, tabContent);
    }
  });
}

// 🧩 Manejo centralizado de archivos

async function handleFileClick(item) {
  if (!item?.path) return;
  archivoActivo = item.path;
  const content = archivos[archivoActivo];
  if (typeof content === "undefined") {
    console.warn(`Contenido no encontrado para ${archivoActivo}`);
  }

  let tab = getTab(archivoActivo);
  let tabContent = getTabContent(archivoActivo);

  if (!tab) {
    tab = createTab(item);
    tabContent = createTabContent(archivoActivo);
  }

  tab.dataset.execution ||= item.execution || detectExecutionType(item.path);
  await renderContent(tab.dataset.execution, item.path, content, tabContent);
  activateTab(archivoActivo);
}

// 🧩 Render según tipo

async function renderContent(tipo, path, contenido, contenedor) {
  try {
    if (tipo === "editor") {
      const mod = await getModule("editor", "./editor.js");
      mod.renderEditorContent?.(contenido || "");
    } else if (tipo === "terminal") {
      const mod = await getModule("terminal", "./terminal.js");
      contenedor ||= createTabContent(path) || document.querySelector(".preview");
      mod.renderTerminal?.(path, contenido || "", contenedor);
    } else if (tipo === "browser") {
      const editorMod = await getModule("editor", "./editor.js");
      const browserMod = await getModule("browser", "./browser.js");

      editorMod.renderEditorContent?.(contenido || "", () => {
        browserMod.openBrowser?.(contenido || "", path, archivos);
      });

    } else {
      const mod = await getModule("editor", "./editor.js");
      mod.renderEditorContent?.(contenido || "");
    }
  } catch (err) {
    console.error("Error al renderizar contenido:", err);
  }
}

// 🧩 Utilidades

function detectExecutionType(path) {
  if (!path) return "editor";
  const p = path.toLowerCase();
  if (p.endsWith(".html") || p.endsWith(".htm")) return "browser";
  if (p.endsWith(".sh") || p.endsWith(".md") || p.endsWith(".txt")) return "terminal";
  return "editor";
}


