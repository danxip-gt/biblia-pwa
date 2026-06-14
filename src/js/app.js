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
  const capitulos = datosBiblia[libroIndex].capitulos;

  capitulos.forEach((cap, index) => {
    const option = document.createElement('option');
    option.value = index; // Guardamos el índice del capítulo
    option.textContent = cap.capitulo;
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