export function initSidebar() {
  document.addEventListener("click", e => {
    if (e.target.closest(".sidebar-icon")) {
      document.querySelectorAll(".sidebar-icon").forEach(btn => btn.classList.remove("active"));
      e.target.closest(".sidebar-icon").classList.add("active");
    }
  });
}