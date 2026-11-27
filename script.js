const libro = document.getElementById('libro');
const hojas = document.querySelectorAll('.hoja');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnReiniciar = document.getElementById('btn-reiniciar');

let hojaActual = 0;
const totalHojas = hojas.length;

function actualizarLibro() {
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

btnReiniciar.addEventListener('click', (e) => {
  e.stopPropagation();
  hojaActual = 0;
  actualizarLibro();
});

hojas.forEach((hoja, index) => {
  hoja.addEventListener('click', () => {
    if (index === hojaActual) {
      siguienteHoja();
    } else if (index === hojaActual - 1) {
      anteriorHoja();
    }
  });
});