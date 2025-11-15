export function initSidebar() {
  const buttons = document.querySelectorAll(".sidebar-icon");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const panel = btn.dataset.panel;
      console.log(`Panel activo: ${panel}`);
      // Acá podrías mostrar/ocultar paneles si los tenés definidos
    });
  });
}