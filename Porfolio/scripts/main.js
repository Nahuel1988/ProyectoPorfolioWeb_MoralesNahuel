function loadComponent(id, file, callback) {
  fetch(`components/${file}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
      if (callback) callback(); // Ejecuta lógica después de insertar el HTML
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("sidebar", "sidebar.html");
  loadComponent("explorer", "explorer.html");
  loadComponent("editor", "editor.html");
  loadComponent("terminal", "terminal.html");
  loadComponent("statusbar", "statusbar.html");

  // Inicializar lógica por módulo
  import("./sidebar.js").then(m => m.initSidebar());
  import("./explorer.js").then(m => m.initExplorer());
  import("./editor.js").then(m => m.initEditor());
  import("./terminal.js").then(m => m.initTerminal());
  import("./statusbar.js").then(m => m.initStatusbar());
});