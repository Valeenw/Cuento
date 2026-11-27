const libro = document.getElementById('libro');
const hojas = document.querySelectorAll('.hoja');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnReiniciar = document.getElementById('btn-reiniciar');

let hojaActual = 0;
const totalHojas = hojas.length;

function esMovil() {
  return window.innerWidth <= 800;
}

function actualizarLibro() {
  if (esMovil()) {
    // En celular mostramos el libro centrado sin desplazarlo fuera de pantalla
    libro.classList.remove('abierto');

    hojas.forEach((hoja, index) => {
      hoja.classList.remove('volteada');
      const frente = hoja.querySelector('.cara.frente');
      const atras = hoja.querySelector('.cara.atras');

      // En móvil cada clic avanza una cara (frente o atrás)
      if (index < hojaActual) {
        hoja.style.display = 'none';
      } else if (index === hojaActual) {
        hoja.style.display = 'block';
        hoja.style.zIndex = 10;
        hoja.style.transform = 'none';
        if (frente) frente.style.transform = 'none';
        if (atras) atras.style.transform = 'none';
      } else {
        hoja.style.display = 'block';
        hoja.style.zIndex = totalHojas - index;
        hoja.style.transform = 'none';
        if (frente) frente.style.transform = 'none';
        if (atras) atras.style.transform = 'rotateY(180deg)';
      }
    });
    return;
  }

  // Modo escritorio / pantallas amplias (efecto libro doble en 3D)
  hojas.forEach((hoja) => {
    hoja.style.display = 'block';
    hoja.style.transform = '';
    const frente = hoja.querySelector('.cara.frente');
    const atras = hoja.querySelector('.cara.atras');
    if (frente) frente.style.transform = '';
    if (atras) atras.style.transform = 'rotateY(180deg)';
  });

  if (hojaActual > 0 && hojaActual < totalHojas) {
    libro.classList.add('abierto');
  } else {
    libro.classList.remove('abierto');
  }

  hojas.forEach((hoja, index) => {
    if (index < hojaActual) {
      hoja.classList.add('volteada');
      hoja.style.zIndex = index + 1;
    } else {
      hoja.classList.remove('volteada');
      hoja.style.zIndex = totalHojas - index;
    }
  });
}

function siguienteHoja() {
  if (hojaActual < totalHojas) {
    hojaActual++;
    actualizarLibro();
  }
}

function anteriorHoja() {
  if (hojaActual > 0) {
    hojaActual--;
    actualizarLibro();
  }
}

btnSiguiente.addEventListener('click', siguienteHoja);
btnAnterior.addEventListener('click', anteriorHoja);

if (btnReiniciar) {
  btnReiniciar.addEventListener('click', (e) => {
    e.stopPropagation();
    hojaActual = 0;
    actualizarLibro();
  });
}

hojas.forEach((hoja, index) => {
  hoja.addEventListener('click', () => {
    if (index === hojaActual) {
      siguienteHoja();
    } else if (index === hojaActual - 1) {
      anteriorHoja();
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') siguienteHoja();
  if (e.key === 'ArrowLeft') anteriorHoja();
});

window.addEventListener('resize', actualizarLibro);

let toqueInicioX = 0;
let toqueFinX = 0;

libro.addEventListener('touchstart', (e) => {
  toqueInicioX = e.changedTouches[0].screenX;
}, { passive: true });

libro.addEventListener('touchend', (e) => {
  toqueFinX = e.changedTouches[0].screenX;
  const diferencia = toqueInicioX - toqueFinX;

  if (diferencia > 45) {
    siguienteHoja();
  } else if (diferencia < -45) {
    anteriorHoja();
  }
}, { passive: true });

actualizarLibro();