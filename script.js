// Espera a que todo el HTML se cargue
document.addEventListener("DOMContentLoaded", () => {

  // Selecciona todas las zonas del mapa
  const zonas = document.querySelectorAll(".zona");
  // Selecciona todas las ventanas de información
  const infos = document.querySelectorAll(".cont.info");

  // Variable para habilitar/deshabilitar zoom y arrastre
  let zoomHabilitado = true;

  // VARIABLES PARA EL ZOOM Y EL PAN
  const contenedor = document.getElementById("contenedor");
  let escalaZoom = 2;            // nivel inicial de zoom
  const zoomMinimo = escalaZoom; // límite mínimo de zoom
  let posicionX = -100;          // posición inicial X
  let posicionY = -300;          // posición inicial Y
  let estaArrastrando = false;   // indica si se está arrastrando
  let inicioX, inicioY;          // coordenadas iniciales para arrastrar
  let distanciaInicial = 0;      // distancia inicial para el pinch zoom

  // Función para actualizar la transformación del mapa
  function actualizarTransformacion() {
    // calcula límites para no salir del área
    const anchoContenedor = contenedor.offsetWidth;
    const altoContenedor = contenedor.offsetHeight;
    const anchoImagen = anchoContenedor * escalaZoom;
    const altoImagen = altoContenedor * escalaZoom;
    const limiteX = (anchoImagen - anchoContenedor) / 2;
    const limiteY = (altoImagen - altoContenedor) / 2;
    posicionX = Math.min(limiteX, Math.max(-limiteX, posicionX));
    posicionY = Math.min(limiteY, Math.max(-limiteY, posicionY));

    // aplica transformaciones de posición y escala
    contenedor.style.transform = `translate(${posicionX}px, ${posicionY}px) scale(${escalaZoom})`;
  }

  // EVENTOS DE ZOOM Y PAN (sólo si zoomHabilitado es true)
  contenedor.addEventListener("wheel", (evento) => {
    if (!zoomHabilitado) return; // bloquea si hay ventana abierta
    evento.preventDefault();
    const factorZoom = 0.1;
    if (evento.deltaY < 0) {
      escalaZoom = Math.min(3, escalaZoom + factorZoom);
    } else {
      escalaZoom = Math.max(zoomMinimo, escalaZoom - factorZoom);
    }
    actualizarTransformacion();
  });

  // MOUSE DOWN para arrastrar
  contenedor.addEventListener("mousedown", (evento) => {
    if (!zoomHabilitado) return;
    estaArrastrando = true;
    inicioX = evento.clientX - posicionX;
    inicioY = evento.clientY - posicionY;
    contenedor.style.cursor = "grabbing";
  });

  // MOUSE UP para soltar
  document.addEventListener("mouseup", () => {
    estaArrastrando = false;
    contenedor.style.cursor = "default";
  });

  // MOUSE MOVE para mover
  document.addEventListener("mousemove", (evento) => {
    if (!estaArrastrando || !zoomHabilitado) return;
    posicionX = evento.clientX - inicioX;
    posicionY = evento.clientY - inicioY;
    actualizarTransformacion();
  });

  // TOUCH START para móviles
  contenedor.addEventListener("touchstart", (evento) => {
    if (!zoomHabilitado) return;
    if (evento.touches.length === 2) {
      const [t1, t2] = evento.touches;
      distanciaInicial = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    } else if (evento.touches.length === 1) {
      estaArrastrando = true;
      inicioX = evento.touches[0].clientX - posicionX;
      inicioY = evento.touches[0].clientY - posicionY;
    }
  });

  // TOUCH MOVE para móviles
  contenedor.addEventListener("touchmove", (evento) => {
    if (!zoomHabilitado) return;
    evento.preventDefault();
    if (evento.touches.length === 2) {
      const [t1, t2] = evento.touches;
      const distanciaActual = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const factor = 0.01;
      escalaZoom += (distanciaActual - distanciaInicial) * factor;
      escalaZoom = Math.min(3, Math.max(zoomMinimo, escalaZoom));
      distanciaInicial = distanciaActual;
      actualizarTransformacion();
    } else if (evento.touches.length === 1 && estaArrastrando) {
      posicionX = evento.touches[0].clientX - inicioX;
      posicionY = evento.touches[0].clientY - inicioY;
      actualizarTransformacion();
    }
  });

  // TOUCH END para móviles
  contenedor.addEventListener("touchend", (evento) => {
    if (evento.touches.length === 0) estaArrastrando = false;
  });

  // Inicializa la posición y zoom del mapa
  actualizarTransformacion();

  // EVENTOS PARA MOSTRAR Y CERRAR LAS VENTANAS DE INFORMACIÓN
  zonas.forEach((zona, i) => {
    zona.addEventListener("click", () => {
      infos[i].style.display = "flex"; // muestra la ventana
      zoomHabilitado = false; // desactiva zoom y pan mientras está abierta
    });
  });

  infos.forEach((info) => {
    const cerrar = info.querySelector(".cerrar");
    cerrar.addEventListener("click", () => {
      info.style.display = "none"; // oculta la ventana
      zoomHabilitado = true; // reactiva zoom y pan
    });
  });

});
