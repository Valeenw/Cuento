const libro = document.getElementById('libro');
const hojas = Array.from(document.querySelectorAll('.hoja'));
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnReiniciar = document.getElementById('btn-reiniciar');

// Todas las caras en orden de lectura:
// 0: Portada | 1: Pág 1 | 2: Pág 2 | 3: Pág 3 | 4: Pág 4 | 5: Contraportada
const todasLasCaras = [];
hojas.forEach((hoja) => {
  const frente = hoja.querySelector('.cara.frente');
  const atras = hoja.querySelector('.cara.atras');
  if (frente) todasLasCaras.push(frente);
  if (atras) todasLasCaras.push(atras);
});

let hojaActual = 0; // Escritorio: 0 = cerrada, 1..totalHojas = hojas volteadas
let pasoMovil = 0;  // Móvil: 0..todasLasCaras.length - 1
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
    });

    todasLasCaras.forEach((cara, idx) => {
      cara.style.display = idx === pasoMovil ? 'flex' : 'none';
    });

    const hojaActiva = todasLasCaras[pasoMovil]?.closest('.hoja');
    if (hojaActiva) {
      hojaActiva.style.display = 'block';
    }
    return;
  }

  // Modo escritorio: muestra todas las caras y controla el giro 3D por hoja
  todasLasCaras.forEach((cara) => {
    cara.style.display = 'flex';
  });

  if (hojaActual > 0 && hojaActual < totalHojas) {
    libro.classList.add('abierto');
  } else {
    libro.classList.remove('abierto');
  }

  hojas.forEach((hoja, index) => {
    hoja.style.display = 'block';
    if (index < hojaActual) {
      hoja.classList.add('volteada');
      // Las hojas ya volteadas a la izquierda se ordenan de abajo hacia arriba
      hoja.style.zIndex = index + 1;
    } else {
      hoja.classList.remove('volteada');
      // Las hojas sin voltear a la derecha van de arriba hacia abajo
      hoja.style.zIndex = totalHojas - index + 10;
    }
  });
}

function siguienteHoja() {
  if (esMovil()) {
    if (pasoMovil < todasLasCaras.length - 1) {
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

// Clic en las hojas (escritorio) o caras (móvil)
todasLasCaras.forEach((cara, idx) => {
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