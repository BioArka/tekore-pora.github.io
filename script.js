document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor");

  // ------------------ TU CÓDIGO ------------------
  // Variables
  let escalaZoom = 1;
  let posicionX = 0;
  let posicionY = 0;
  let estaArrastrando = false;
  let inicioX, inicioY;
  let distanciaInicial = 0;

  // Función para aplicar transform
  function actualizarTransformacion() {
    const anchoContenedor = contenedor.offsetWidth;
    const altoContenedor = contenedor.offsetHeight;

    const anchoImagen = anchoContenedor * escalaZoom;
    const altoImagen = altoContenedor * escalaZoom;

    const limiteX = (anchoImagen - anchoContenedor) / 2;
    const limiteY = (altoImagen - altoContenedor) / 2;

    posicionX = Math.min(limiteX, Math.max(-limiteX, posicionX));
    posicionY = Math.min(limiteY, Math.max(-limiteY, posicionY));

    contenedor.style.transform = `translate(${posicionX}px, ${posicionY}px) scale(${escalaZoom})`;
  }

  // ------------------ EVENTOS ------------------

  // Zoom con rueda del mouse
  contenedor.addEventListener("wheel", (evento) => {
    evento.preventDefault();
    const factorZoom = 0.1;
    if (evento.deltaY < 0) escalaZoom = Math.min(3, escalaZoom + factorZoom);
    else escalaZoom = Math.max(1, escalaZoom - factorZoom);
    actualizarTransformacion();
  });

  // Arrastrar con mouse
  contenedor.addEventListener("mousedown", (evento) => {
    estaArrastrando = true;
    inicioX = evento.clientX - posicionX;
    inicioY = evento.clientY - posicionY;
    contenedor.style.cursor = "grabbing";
  });

  document.addEventListener("mouseup", () => {
    estaArrastrando = false;
    contenedor.style.cursor = "default";
  });

  document.addEventListener("mousemove", (evento) => {
    if (!estaArrastrando) return;
    posicionX = evento.clientX - inicioX;
    posicionY = evento.clientY - inicioY;
    actualizarTransformacion();
  });

  // Zoom y arrastre táctil
  contenedor.addEventListener("touchstart", (evento) => {
    if (evento.touches.length === 2) {
      const [t1, t2] = evento.touches;
      distanciaInicial = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    } else if (evento.touches.length === 1) {
      estaArrastrando = true;
      inicioX = evento.touches[0].clientX - posicionX;
      inicioY = evento.touches[0].clientY - posicionY;
    }
  });

  contenedor.addEventListener("touchmove", (evento) => {
    evento.preventDefault();
    if (evento.touches.length === 2) {
      const [t1, t2] = evento.touches;
      const distanciaActual = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const factor = 0.01;
      escalaZoom += (distanciaActual - distanciaInicial) * factor;
      escalaZoom = Math.min(3, Math.max(1, escalaZoom));
      distanciaInicial = distanciaActual;
      actualizarTransformacion();
    } else if (evento.touches.length === 1 && estaArrastrando) {
      posicionX = evento.touches[0].clientX - inicioX;
      posicionY = evento.touches[0].clientY - inicioY;
      actualizarTransformacion();
    }
  });

  contenedor.addEventListener("touchend", (evento) => {
    if (evento.touches.length === 0) estaArrastrando = false;
  });
});
