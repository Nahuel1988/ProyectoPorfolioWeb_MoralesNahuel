const tabs = document.getElementById("tabs");
const codeArea = document.getElementById("codeArea");
const lineNumbers = document.getElementById("lineNumbers");
const browserWindow = document.getElementById("browserWindow");
const browserContent = document.getElementById("browserContent");

const files = {
  html: [
    "<!DOCTYPE html>",
    "<html lang='es'>",
    "<head>",
    "  <meta charset='UTF-8'>",
    "  <title>Nahuel - Portfolio</title>",
    "  <link rel='stylesheet' href='style.css'>",
    "</head>",
    "<body>",
    "  <h1>Hola, soy Nahuel</h1>",
    "  <p>Desarrollador backend con foco en eficiencia y automatización.</p>",
    "  <script src='script.js'></script>",
    "</body>",
    "</html>"
  ],
  css: [
    "body {",
    "  font-family: sans-serif;",
    "  background-color: #f4f4f4;",
    "  padding: 2rem;",
    "  color: #333;",
    "}",
    "h1 {",
    "  color: #007acc;",
    "}"
  ],
  js: [
    "console.log('Portfolio cargado correctamente');",
    "document.querySelector('h1').style.fontWeight = 'bold';"
  ]
};

function clearEditor() {
  codeArea.innerText = "";
  lineNumbers.innerText = "";
}

function writeLines(lines, fileName, onComplete) {
  tabs.innerHTML = `<div>${fileName}</div>`;
  clearEditor();

  let i = 0;
  const interval = setInterval(() => {
    const line = lines[i];

    const codeLine = document.createElement("div");
    codeLine.textContent = line;
    codeArea.appendChild(codeLine);

    const lineNumber = document.createElement("div");
    lineNumber.textContent = i + 1;
    lineNumbers.appendChild(lineNumber);

    i++;
    if (i === lines.length) {
      clearInterval(interval);
      setTimeout(onComplete, 800);
    }
  }, 100);
}

function startSequence() {
  writeLines(files.html, "index.html", () => {
    writeLines(files.css, "style.css", () => {
      writeLines(files.js, "script.js", () => {
        launchBrowser();
      });
    });
  });
}

function launchBrowser() {
  const html = files.html.join("\n");
  const css = `<style>\n${files.css.join("\n")}\n</style>`;
  const js = `<script>\n${files.js.join("\n")}\n</script>`;

  const finalHTML = html
    .replace("</head>", `${css}</head>`)
    .replace("</body>", `${js}</body>`);

  const blob = new Blob([finalHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  browserContent.src = url;
  browserWindow.style.display = "flex";
}

function closeBrowserWindow() {
  browserWindow.style.display = "none";
}