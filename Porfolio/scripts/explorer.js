export function initExplorer() {
  fetch("arbol_carpetas.json")
    .then(res => res.json())
    .then(data => {
      const tree = document.querySelector(".file-tree");
      renderTree(data, tree);
    });

  function renderTree(data, container) {
    data.forEach(item => {
      const li = document.createElement("li");
      if (item.type === "folder") {
        li.className = "folder";
        li.innerHTML = `
          <div class="folder-header">
            <img src="assets/icons/arrow.svg" class="arrow" />
            <img src="assets/icons/folder.svg" class="icon" />
            <span>${item.name}</span>
          </div>
          <ul class="file-list"></ul>
        `;
        renderTree(item.children, li.querySelector(".file-list"));
        li.querySelector(".folder-header").addEventListener("click", () => {
          li.classList.toggle("open");
        });
      } else {
        li.innerHTML = `<img src="assets/icons/file.svg" class="icon" /> ${item.name}`;
      }
      container.appendChild(li);
    });
  }
}