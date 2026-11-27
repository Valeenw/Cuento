const vistas = Array.from(document.querySelectorAll('.vista'));
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnReiniciar = document.getElementById('btn-reiniciar');

let indiceActual = 0;

function mostrarVista(nuevoIndice) {
  if (nuevoIndice < 0 || nuevoIndice >= vistas.length) return;
  indiceActual = nuevoIndice;

  vistas.forEach((vista, i) => {
    vista.classList.toggle('activa', i === indiceActual);
  });

  btnAnterior.disabled = indiceActual === 0;
  btnSiguiente.disabled = indiceActual === vistas.length - 1;
}

function siguiente() {
  if (indiceActual < vistas.length - 1) {
    mostrarVista(indiceActual + 1);
  }
}

function anterior() {
  if (indiceActual > 0) {
    mostrarVista(indiceActual - 1);
  }
}

btnSiguiente.addEventListener('click', siguiente);
btnAnterior.addEventListener('click', anterior);

if (btnReiniciar) {
  btnReiniciar.addEventListener('click', (e) => {
    e.stopPropagation();
    mostrarVista(0);
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
const marco = document.querySelector('.libro-marco');

marco.addEventListener('touchstart', (e) => {
  inicioX = e.changedTouches[0].screenX;
}, { passive: true });

marco.addEventListener('touchend', (e) => {
  const finX = e.changedTouches[0].screenX;
  const diff = inicioX - finX;
  if (diff > 45) siguiente();
  if (diff < -45) anterior();
}, { passive: true });

mostrarVista(0);