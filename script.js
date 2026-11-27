const libro = document.getElementById('libro');
const hojas = Array.from(document.querySelectorAll('.hoja'));
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnReiniciar = document.getElementById('btn-reiniciar');

// Lista ordenada de todas las caras del libro en lectura lineal para móvil:
// [Portada, Pág 1, Pág 2, Pág 3, Pág 4, Contraportada]
const carasMovil = [];
hojas.forEach((hoja) => {
  const frente = hoja.querySelector('.cara.frente');
  const atras = hoja.querySelector('.cara.atras');
  if (frente) carasMovil.push(frente);
  if (atras) carasMovil.push(atras);
});

let hojaActual = 0;       // Para escritorio (0 a hojas.length)
let pasoMovil = 0;        // Para móvil (0 a carasMovil.length - 1)
const totalHojas = hojas.length;

function esMovil() {
  return window.innerWidth <= 800;
}

function actualizarLibro() {
  if (esMovil()) {
    libro.classList.remove('abierto');

    // Limpia estilos 3D de escritorio
    hojas.forEach((hoja) => {
      hoja.style.display = 'block';
      hoja.style.transform = 'none';
      hoja.classList.remove('volteada');
    });

    // Muestra solo la cara activa en móvil para evitar encimamientos
    carasMovil.forEach((cara, idx) => {
      cara.style.transform = 'none';
      cara.style.backfaceVisibility = 'visible';
      cara.style.webkitBackfaceVisibility = 'visible';
      cara.style.display = idx === pasoMovil ? 'flex' : 'none';
    });
    return;
  }

  // Modo escritorio (libro abierto en 3D)
  carasMovil.forEach((cara) => {
    cara.style.display = 'flex';
    cara.style.backfaceVisibility = '';
    cara.style.webkitBackfaceVisibility = '';
    if (cara.classList.contains('atras')) {
      cara.style.transform = 'rotateY(180deg)';
    } else {
      cara.style.transform = '';
    }
  });

  if (hojaActual > 0 && hojaActual < totalHojas) {
    libro.classList.add('abierto');
  } else {
    libro.classList.remove('abierto');
  }

  hojas.forEach((hoja, index) => {
    hoja.style.display = 'block';
    hoja.style.transform = '';
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
  if (esMovil()) {
    if (pasoMovil < carasMovil.length - 1) {
      pasoMovil++;
      actualizarLibro();
    }
    return;
  }

  if (hojaActual < totalHojas) {
    hojaActual++;
    actualizarLibro();
  }
}

function anteriorHoja() {
  if (esMovil()) {
    if (pasoMovil > 0) {
      pasoMovil--;
      actualizarLibro();
    }
    return;
  }

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
    pasoMovil = 0;
    actualizarLibro();
  });
}

// Clic en las caras en móvil
carasMovil.forEach((cara) => {
  cara.addEventListener('click', () => {
    if (esMovil()) {
      siguienteHoja();
    }
  });
});

// Clic en las hojas en escritorio
hojas.forEach((hoja, index) => {
  hoja.addEventListener('click', () => {
    if (!esMovil()) {
      if (index === hojaActual) {
        siguienteHoja();
      } else if (index === hojaActual - 1) {
        anteriorHoja();
      }
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