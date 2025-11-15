// browser.js
export function initBrowser() {
  // opcional: crear contenedor si no existe
  if (!document.querySelector(".browser-window")) {
    const wrapper = document.createElement("div");
    wrapper.className = "browser-window hidden";
    wrapper.innerHTML = `
      <div class="browser-header">
        <span>Preview</span>
        <button id="close-browser">✕</button>
      </div>
      <iframe id="browser-frame" sandbox="allow-scripts" title="Browser Preview"></iframe>
    `;
    document.body.appendChild(wrapper);
    document.getElementById("close-browser")?.addEventListener("click", closeBrowser);
  }
}

export function closeBrowser() {
  document.querySelector(".browser-window")?.classList.add("hidden");
  const iframe = document.getElementById("browser-frame");
  if (iframe) iframe.srcdoc = "";
}

/**
 * Abre una vista previa del HTML.
 * @param {string} htmlContent - HTML desde archivos.json
 * @param {string} path - path del archivo (ej: "CV/cv.html")
 * @param {Object} files - mapa path -> contenido (tu archivos)
 */
export async function openBrowser(htmlContent = "", path = "", files = {}) {
  const iframe = document.getElementById("browser-frame") || createFrame();
  const inlined = await inlineResources(htmlContent, path, files);
  iframe.srcdoc = inlined;
  document.querySelector(".browser-window")?.classList.remove("hidden");
}

function createFrame() {
  const iframe = document.createElement("iframe");
  iframe.id = "browser-frame";
  iframe.sandbox = "allow-scripts";
  document.querySelector(".browser-window")?.appendChild(iframe);
  return iframe;
}

async function inlineResources(html, path, files) {
  if (!html) return "<!doctype html><html><body></body></html>";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const basePath = getBasePath(path);

  // Inyectar CSS referenciado por <link rel="stylesheet" href="...">
  const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
  for (const link of links) {
    const href = link.getAttribute("href");
    const resolved = resolvePath(basePath, href);
    const css = files[resolved];
    if (typeof css === "string") {
      const style = doc.createElement("style");
      style.textContent = css;
      link.replaceWith(style);
    } else {
      // si no está en archivos.json, dejamos el link tal cual (se intentará cargar desde servidor)
    }
  }

  // Inyectar scripts con src
  const scripts = Array.from(doc.querySelectorAll('script[src]'));
  for (const s of scripts) {
    const src = s.getAttribute("src");
    const resolved = resolvePath(basePath, src);
    const js = files[resolved];
    if (typeof js === "string") {
      const inline = doc.createElement("script");
      inline.textContent = js;
      s.replaceWith(inline);
    } else {
      // si no está en archivos.json, dejamos el script con src (se cargará desde servidor)
    }
  }

  // Añadir <base> para que recursos relativos (img, a, etc.) resuelvan al directorio del archivo
  const baseEl = doc.createElement("base");
  baseEl.setAttribute("href", window.location.origin + "/" + basePath);
  if (doc.head) doc.head.prepend(baseEl);

  return "<!doctype html>\n" + doc.documentElement.outerHTML;
}

function getBasePath(path) {
  if (!path) return "";
  const idx = path.lastIndexOf("/");
  return idx === -1 ? "" : path.slice(0, idx + 1); // "CV/" por ejemplo
}

function resolvePath(base, href) {
  if (!href) return href;

  // Si es URL absoluta externa, no tocar
  if (href.startsWith("http://") || href.startsWith("https://")) return href;

  // Si ya incluye la carpeta raíz (ej: "Porfolio/assets/icons/miFoto.jpeg"), no modificar
  if (href.startsWith("Porfolio/") || href.startsWith("assets/")) return href;

  // Si empieza con "/", quitarlo
  if (href.startsWith("/")) href = href.slice(1);

  // Combinar con basePath
  let result = base + href;

  // Simplificar ../ y ./
  const parts = result.split("/").filter(Boolean);
  const stack = [];
  for (const p of parts) {
    if (p === "..") stack.pop();
    else if (p !== ".") stack.push(p);
  }

  return stack.join("/");
}