// Variables globales del estado de la aplicación
let datosBiblia = [];

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
  // Limpiamos e insertamos una opción por defecto
  selectLibro.innerHTML = '<option value="">-- Elige un Libro --</option>';
  selectCapitulo.innerHTML = '<option value="">-- Cap --</option>';

  datosBiblia.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = index; // Guardamos el índice del array para buscar rápido después
    option.textContent = item.libro;
    selectLibro.appendChild(option);
  });
}
// 5. Escuchadores de eventos (Event Listeners) para detectar cambios del usuario
selectLibro.addEventListener('change', (e) => {
  const libroIndex = e.target.value;
  if (libroIndex !== "") {
    poblarCapitulos(libroIndex);
  } else {
    resetearInterfaz();
  }
});

selectCapitulo.addEventListener('change', (e) => {
  const libroIndex = selectLibro.value;
  const capituloIndex = e.target.value;
  if (libroIndex !== "" && capituloIndex !== "") {
    mostrarVersiculos(libroIndex, capituloIndex);
  }
});

// 6. Poblar el selector de Capítulos según el libro elegido
function poblarCapitulos(libroIndex) {
  selectCapitulo.innerHTML = '<option value="">-- Cap --</option>';
  
  // Debug para consola: Verificamos qué datos llegan de ese libro
  console.log("Datos del libro seleccionado:", datosBiblia[libroIndex]);

  const libroSeleccionado = datosBiblia[libroIndex];
  
  // Validamos si la propiedad existe tal cual está escrita en el JSON
  if (!libroSeleccionado || !libroSeleccionado.capitulos) {
    console.error("Error: No se encontró la propiedad 'capitulos' en el JSON. Revisa mayúsculas/minúsculas o tildes.");
    return;
  }

  const capitulos = libroSeleccionado.capitulos;

  capitulos.forEach((cap, index) => {
    const option = document.createElement('option');
    option.value = index; // Guardamos el índice del capítulo
    option.textContent = cap.capitulo; // Asegúrate que en el JSON diga "capitulo"
    selectCapitulo.appendChild(option);
  });
  
  visorVersiculos.innerHTML = `<p class="mensaje-bienvenida">Ahora selecciona el capítulo.</p>`;
}

// 7. Renderizar los versículos en la interfaz
function mostrarVersiculos(libroIndex, capituloIndex) {
  // Limpiamos el visor
  visorVersiculos.innerHTML = '';
  
  const versiculos = datosBiblia[libroIndex].capitulos[capituloIndex].versiculos;

  // Recorremos los versículos y los inyectamos con su formato accesible
  versiculos.forEach((v) => {
    const parrafo = document.createElement('p');
    parrafo.innerHTML = `<span class="num-versiculo">${v.numero}</span>${v.texto}`;
    visorVersiculos.appendChild(parrafo);
  });

  // Scroll automático hacia arriba para que empiece a leer cómodamente
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 8. Resetear la interfaz si no hay selección válida
function resetearInterfaz() {
  selectCapitulo.innerHTML = '<option value="">-- Cap --</option>';
  visorVersiculos.innerHTML = '<p class="mensaje-bienvenida">Selecciona un libro para comenzar a leer.</p>';
}
// 9. Lógica de Accesibilidad: Control del Tamaño de Letra
let tamañoFuenteActual = 1.3; // Valor inicial en rem (coincide con el CSS)
const btnAumentar = document.getElementById('btn-aumentar');
const btnDisminuir = document.getElementById('btn-disminuir');

btnAumentar.addEventListener('click', () => {
  if (tamañoFuenteActual < 2.2) { // Límite máximo para que no se deforme
    tamañoFuenteActual += 0.1;
    aplicarTamañoFuente();
  }
});

btnDisminuir.addEventListener('click', () => {
  if (tamañoFuenteActual > 1.0) { // Límite mínimo legible
    tamañoFuenteActual -= 0.1;
    aplicarTamañoFuente();
  }
});

function aplicarTamañoFuente() {
  // Aplicamos el tamaño directamente a los párrafos del visor
  const parrafos = visorVersiculos.querySelectorAll('p');
  parrafos.forEach(p => {
    p.style.fontSize = `${tamañoFuenteActual}rem`;
  });
}