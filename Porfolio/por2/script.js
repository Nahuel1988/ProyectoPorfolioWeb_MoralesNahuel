// Podés agregar animaciones, navegación entre archivos o carga dinámica de contenido
document.querySelectorAll('.file-tree li').forEach(item => {
  item.addEventListener('click', () => {
    document.getElementById('code-block').textContent = `// Código de ${item.textContent.trim()}`;
  });
});
