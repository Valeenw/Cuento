const libroVista = document.getElementById('libro-vista');
const vistas = Array.from(document.querySelectorAll('.vista'));
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnReiniciar = document.getElementById('btn-reiniciar');

// Pasos para computadora:
// [0] = Portada sola
// [1, 2] = Escena 1 (izq) + Escena 2 (der)
// [3, 4] = Escena 3 (izq) + Escena 4 (der)
// [5] = Contraportada sola
const spreadsEscritorio = [[0], [1, 2], [3, 4], [5]];

let pasoMovil = 0;
let pasoEscritorio = 0;

function esEscritorio() {
  return window.innerWidth >= 769;
}

function renderizar() {
  vistas.forEach((v) => v.classList.remove('activa'));

  if (esEscritorio()) {
    const grupo = spreadsEscritorio[pasoEscritorio] || [0];
    const esDoble = grupo.length === 2;
    libroVista.classList.toggle('modo-libro', esDoble);

    grupo.forEach((idx) => {
      if (vistas[idx]) vistas[idx].classList.add('activa');
    });

    btnAnterior.disabled = pasoEscritorio === 0;
    btnSiguiente.disabled = pasoEscritorio === spreadsEscritorio.length - 1;
  } else {
    libroVista.classList.remove('modo-libro');
    if (vistas[pasoMovil]) vistas[pasoMovil].classList.add('activa');

    btnAnterior.disabled = pasoMovil === 0;
    btnSiguiente.disabled = pasoMovil === vistas.length - 1;
  }
}

function siguiente() {
  if (esEscritorio()) {
    if (pasoEscritorio < spreadsEscritorio.length - 1) {
      pasoEscritorio++;
      renderizar();
    }
  } else if (pasoMovil < vistas.length - 1) {
    pasoMovil++;
    renderizar();
  }
}

function anterior() {
  if (esEscritorio()) {
    if (pasoEscritorio > 0) {
      pasoEscritorio--;
      renderizar();
    }
  } else if (pasoMovil > 0) {
    pasoMovil--;
    renderizar();
  }
}

btnSiguiente.addEventListener('click', siguiente);
btnAnterior.addEventListener('click', anterior);

if (btnReiniciar) {
  btnReiniciar.addEventListener('click', (e) => {
    e.stopPropagation();
    pasoMovil = 0;
    pasoEscritorio = 0;
    renderizar();
  });
}

vistas.forEach((vista) => {
  vista.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    siguiente();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') siguiente();
  if (e.key === 'ArrowLeft') anterior();
});

let inicioX = 0;
libroVista.addEventListener('touchstart', (e) => {
  inicioX = e.changedTouches[0].screenX;
}, { passive: true });

libroVista.addEventListener('touchend', (e) => {
  const finX = e.changedTouches[0].screenX;
  const diff = inicioX - finX;
  if (diff > 45) siguiente();
  if (diff < -45) anterior();
}, { passive: true });

window.addEventListener('resize', renderizar);

renderizar();