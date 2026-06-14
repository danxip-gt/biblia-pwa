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