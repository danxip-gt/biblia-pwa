// Variables globales del estado de la aplicación
let datosBiblia = {}; // AHORA ES UN OBJETO {}

// Elementos del DOM
const selectLibro = document.getElementById('select-libro');
const selectCapitulo = document.getElementById('select-capitulo');
const visorVersiculos = document.getElementById('visor-versiculos');

// 1. Inicialización de la App al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  registrarServiceWorker();
  cargarDatosBiblia();
});

// 2. Registro del Service Worker para funcionamiento Offline
function registrarServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
      .catch(err => console.error('Error al registrar el Service Worker:', err));
  }
}

// 3. Carga del archivo JSON local de la Biblia
async function cargarDatosBiblia() {
  try {
    const respuesta = await fetch('./assets/data/biblia.json');
    if (!respuesta.ok) throw new Error('No se pudo cargar el archivo de datos.');
    
    datosBiblia = await respuesta.json();
    
    // Una vez cargados los datos, poblamos el selector de libros
    poblarLibros();
  } catch (error) {
    console.error('Error en la carga de datos:', error);
    visorVersiculos.innerHTML = `<p class="mensaje-bienvenida" style="color: red;">Error al cargar la Biblia. Por favor, reinicia la app.</p>`;
  }
}

// 4. Poblar el selector de Libros dinámicamente
function poblarLibros() {
  selectLibro.innerHTML = '<option value="">-- Elige un Libro --</option>';
  selectCapitulo.innerHTML = '<option value="">-- Cap --</option>';

  // Extraemos las llaves del objeto (los nombres de los libros)
  const libros = Object.keys(datosBiblia);

  libros.forEach((nombreLibro) => {
    const option = document.createElement('option');
    option.value = nombreLibro; // Guardamos directamente el nombre del libro como valor
    option.textContent = nombreLibro;
    selectLibro.appendChild(option);
  });
}

// 5. Escuchadores de eventos (Event Listeners) para detectar cambios del usuario
selectLibro.addEventListener('change', (e) => {
  const libroSeleccionado = e.target.value;
  if (libroSeleccionado !== "") {
    poblarCapitulos(libroSeleccionado);
  } else {
    resetearInterfaz();
  }
});

selectCapitulo.addEventListener('change', (e) => {
  const libroSeleccionado = selectLibro.value;
  const capituloSeleccionado = e.target.value;
  if (libroSeleccionado !== "" && capituloSeleccionado !== "") {
    mostrarVersiculos(libroSeleccionado, capituloSeleccionado);
  }
});

// 6. Poblar el selector de Capítulos según el libro elegido
function poblarCapitulos(libroSeleccionado) {
  selectCapitulo.innerHTML = '<option value="">-- Cap --</option>';
  
  // Obtenemos las llaves de los capítulos (ej: "1", "2", "3")
  const capitulos = Object.keys(datosBiblia[libroSeleccionado]);

  capitulos.forEach((numCapitulo) => {
    const option = document.createElement('option');
    option.value = numCapitulo; // Guardamos el número como string
    option.textContent = numCapitulo;
    selectCapitulo.appendChild(option);
  });
  
  visorVersiculos.innerHTML = `<p class="mensaje-bienvenida">Ahora selecciona el capítulo.</p>`;
}

// 7. Renderizar los versículos en la interfaz
function mostrarVersiculos(libroSeleccionado, capituloSeleccionado) {
  visorVersiculos.innerHTML = '';
  
  // Obtenemos el objeto del capítulo seleccionado (ej: {"1": "Texto...", "2": "Texto..."})
  const capituloObjeto = datosBiblia[libroSeleccionado][capituloSeleccionado];
  const numerosVersiculos = Object.keys(capituloObjeto);

  // Recorremos las llaves de los versículos e inyectamos el contenido
  numerosVersiculos.forEach((numVersiculo) => {
    const textoVersiculo = capituloObjeto[numVersiculo];
    
    const parrafo = document.createElement('p');
    parrafo.innerHTML = `<span class="num-versiculo">${numVersiculo}</span>${textoVersiculo}`;
    visorVersiculos.appendChild(parrafo);
  });

  // Forzar que mantenga el tamaño de fuente elegido por tu abuela al cambiar de capítulo
  aplicarTamañoFuente();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 8. Resetear la interfaz si no hay selección válida
function resetearInterfaz() {
  selectCapitulo.innerHTML = '<option value="">-- Cap --</option>';
  visorVersiculos.innerHTML = '<p class="mensaje-bienvenida">Selecciona un libro para comenzar a leer.</p>';
}

// 9. Lógica de Accesibilidad: Control del Tamaño de Letra
let tamañoFuenteActual = 1.3; 
const btnAumentar = document.getElementById('btn-aumentar');
const btnDisminuir = document.getElementById('btn-disminuir');

btnAumentar.addEventListener('click', () => {
  if (tamañoFuenteActual < 2.2) { 
    tamañoFuenteActual += 0.1;
    aplicarTamañoFuente();
  }
});

btnDisminuir.addEventListener('click', () => {
  if (tamañoFuenteActual > 1.0) { 
    tamañoFuenteActual -= 0.1;
    aplicarTamañoFuente();
  }
});

function aplicarTamañoFuente() {
  const parrafos = visorVersiculos.querySelectorAll('p');
  parrafos.forEach(p => {
    p.style.fontSize = `${tamañoFuenteActual}rem`;
  });
}