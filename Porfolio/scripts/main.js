function loadComponent(id, file, callback) {
  fetch(`components/${file}`)
    .then(res => {
      if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
      return res.text();
    })
    .then(html => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = html;
      if (callback) callback();
    })
    .catch(err => console.error(`Error al cargar ${file}:`, err));
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("sidebar", "sidebar.html");
  loadComponent("explorer", "explorer.html");
  loadComponent("editor", "editor.html");
  loadComponent("terminal", "terminal.html");
  loadComponent("statusbar", "statusbar.html");

  // Inicializar lógica por módulo
  import("./sidebar.js").then(m => m.initSidebar?.());
  import("./explorer.js").then(m => m.initExplorer?.());
  import("./editor.js").then(m => m.initEditor?.());
  import("./terminal.js").then(m => m.renderTerminal?.()); // si no tenés initTerminal
  //import("./statusbar.js").then(m => m.initStatusbar?.());
});