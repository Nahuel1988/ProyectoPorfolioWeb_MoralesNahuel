function loadComponent(id, file) {
  fetch(`components/${file}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("sidebar", "sidebar.html");
  loadComponent("explorer", "explorer.html");
  loadComponent("editor", "editor.html");
  loadComponent("terminal", "terminal.html");

  // Inicializar lógica por módulo
  import("./sidebar.js").then(m => m.initSidebar());
  import("./explorer.js").then(m => m.initExplorer());
  import("./editor.js").then(m => m.initEditor());
  import("./terminal.js").then(m => m.initTerminal());
});