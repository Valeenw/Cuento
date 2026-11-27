const libro = document.getElementById('libro');
const hojas = Array.from(document.querySelectorAll('.hoja'));
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnReiniciar = document.getElementById('btn-reiniciar');

// Orden lineal de caras para móvil:
// 0: Portada | 1: Pág 1 | 2: Pág 2 | 3: Pág 3 | 4: Pág 4 | 5: Contraportada
const carasMovil = [];
hojas.forEach((hoja) => {
  const frente = hoja.querySelector('.cara.frente');
  const atras = hoja.querySelector('.cara.atras');
  if (frente) carasMovil.push(frente);
  if (atras) carasMovil.push(atras);
});

let hojaActual = 0; // Escritorio: 0 = cerrada, 1..hojas.length = hojas volteadas
let pasoMovil = 0;  // Móvil: 0..carasMovil.length - 1
const totalHojas = hojas.length;

function esMovil() {
  return window.innerWidth <= 800;
}

function actualizarLibro() {
  if (esMovil()) {
    libro.classList.remove('abierto');

    hojas.forEach((hoja) => {
      hoja.classList.remove('volteada');
      hoja.style.display = 'none';
      hoja.style.zIndex = '';
    });

    carasMovil.forEach((cara, idx) => {
      cara.style.display = idx === pasoMovil ? 'flex' : 'none';
      cara.style.visibility = idx === pasoMovil ? 'visible' : 'hidden';
    });

    const hojaActiva = carasMovil[pasoMovil]?.closest('.hoja');
    if (hojaActiva) {
      hojaActiva.style.display = 'block';
    }
    return;
  }

  // Modo escritorio: libro abierto en 3D sin empalme de caras
  if (hojaActual > 0 && hojaActual < totalHojas) {
    libro.classList.add('abierto');
  } else {
    libro.classList.remove('abierto');
  }

  hojas.forEach((hoja, index) => {
    hoja.style.display = 'block';
    const frente = hoja.querySelector('.cara.frente');
    const atras = hoja.querySelector('.cara.atras');
    const estaVolteada = index < hojaActual;

    if (estaVolteada) {
      hoja.classList.add('volteada');
      hoja.style.zIndex = index + 1;
    } else {
      hoja.classList.remove('volteada');
      hoja.style.zIndex = totalHojas - index + 10;
    }

    // Evita que la cara oculta se empalme o se filtre a través de otras hojas
    if (frente) {
      frente.style.display = 'flex';
      frente.style.visibility = estaVolteada ? 'hidden' : 'visible';
    }
    if (atras) {
      atras.style.display = 'flex';
      atras.style.visibility = estaVolteada ? 'visible' : 'hidden';
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

carasMovil.forEach((cara) => {
  cara.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;

    if (esMovil()) {
      siguienteHoja();
      return;
    }

    const hoja = cara.closest('.hoja');
    const indiceHoja = hojas.indexOf(hoja);
    if (indiceHoja === hojaActual) {
      siguienteHoja();
    } else if (indiceHoja === hojaActual - 1) {
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