export function initExplorer() {
  const iconPath = "assets/icons/";

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
            <img src="${iconPath}chevron-right.svg" class="arrow" />
            <img src="${iconPath}default_folder.svg" class="folder-icon" />
            <span>${item.name}</span>
          </div>
          <ul class="file-list"></ul>
        `;

        renderTree(item.children, li.querySelector(".file-list"));

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
      } else {
        const fileIcon = getIconForExtension(item.name);
        li.className = "file";
        li.innerHTML = `
          <img src="${fileIcon}" class="icon" />
          <span>${item.name}</span>
        `;

        li.addEventListener("click", () => {
          const filename = item.name;

          document.querySelectorAll(".file").forEach(f => f.classList.remove("active"));
          li.classList.add("active");

          const tabs = document.querySelector(".tabs");
          const codeArea = document.querySelector(".code-area");
          const preview = document.querySelector(".preview");

          fetch("archivos.json")
            .then(res => res.json())
            .then(data => {
              if (data[filename]) {
                tabs.innerHTML = `<div class="tab active">${filename}</div>`;
                codeArea.textContent = data[filename];

                // Si es index.html, simulamos el flujo completo
                if (filename === "index.html") {
                  setTimeout(() => {
                    tabs.innerHTML += `<div class="tab active">style.css</div>`;
                    codeArea.textContent = data["style.css"];
                  }, 1500);

                  setTimeout(() => {
                    tabs.innerHTML += `<div class="tab active">script.js</div>`;
                    codeArea.textContent = data["script.js"];
                  }, 3000);

                  setTimeout(() => {
                    preview.innerHTML = `
                      <iframe class="browser-preview" srcdoc="
                        <html>
                          <head>
                            <style>${data["style.css"]}</style>
                          </head>
                          <body>
                            <h1>Hola Nahuel</h1>
                            <p>¡JS cargado!</p>
                            <script>${data["script.js"]}</script>
                          </body>
                        </html>
                      "></iframe>
                    `;
                  }, 4500);
                }
              }
            });
        });
      }

      container.appendChild(li);
    });
  }

  function getIconForExtension(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const knownIcons = ["html", "js", "css", "json", "md", "txt"];
    return `${iconPath}file_type_${knownIcons.includes(ext) ? ext : "default"}.svg`;
  }
}