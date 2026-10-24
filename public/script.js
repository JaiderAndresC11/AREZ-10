// ---------- Línea indicadora del menú (se mueve bajo la opción activa / hover) ----------
function configurarIndicadorNav() {
  const lista = document.querySelector('.nav__links');
  const indicador = document.getElementById('navIndicador');
  if (!lista || !indicador) return;

  const enlaces = Array.from(lista.querySelectorAll('a'));

  // Marca como activo el enlace que corresponde a la página actual
  const archivoActual = (location.pathname.split('/').pop() || 'index.html');
  let enlaceActivo = enlaces.find(a => a.getAttribute('href') === archivoActual);
  if (!enlaceActivo && archivoActual === '') {
    enlaceActivo = enlaces.find(a => a.getAttribute('href') === 'index.html');
  }
  if (enlaceActivo) enlaceActivo.classList.add('activo');

  function moverIndicadorA(enlace) {
    if (!enlace) { indicador.classList.remove('visible'); return; }
    indicador.style.left = enlace.offsetLeft + 'px';
    indicador.style.width = enlace.offsetWidth + 'px';
    indicador.classList.add('visible');
  }

  // Posición inicial bajo la opción activa (sin animación de entrada)
  if (enlaceActivo) {
    indicador.style.transition = 'none';
    moverIndicadorA(enlaceActivo);
    requestAnimationFrame(() => { indicador.style.transition = ''; });
  }

  // Al pasar el mouse por cada botón, la línea se desliza hacia él
  enlaces.forEach(enlace => {
    enlace.addEventListener('mouseenter', () => moverIndicadorA(enlace));
  });

  // Al salir del menú, la línea vuelve a la página actual
  lista.addEventListener('mouseleave', () => moverIndicadorA(enlaceActivo));

  // Si cambia el tamaño de la ventana, recalcula la posición
  window.addEventListener('resize', () => moverIndicadorA(enlaceActivo));
}

// ---------- Botón flotante de WhatsApp (todas las páginas) ----------
async function configurarWhatsapp() {
  const enlace = document.getElementById('enlaceWA');
  if (!enlace) return;
  try {
    const respuesta = await fetch('/api/whatsapp-config');
    if (!respuesta.ok) {
      throw new Error(`El servidor respondió ${respuesta.status}`);
    }
    const { numero, mensaje } = await respuesta.json();
    if (!numero) {
      throw new Error('No hay un número de WhatsApp configurado');
    }
    enlace.href = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  } catch (error) {
    console.error('Error cargando configuración de WhatsApp:', error);
  }
}

function configurarBotonFlotante() {
  const boton = document.getElementById('botonWA');
  const panel = document.getElementById('panelWA');
  if (!boton || !panel) return;

  boton.addEventListener('click', () => {
    const abierto = panel.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });

  document.addEventListener('click', (evento) => {
    if (!evento.target.closest('.wa-flotante')) {
      panel.classList.remove('abierto');
      boton.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---------- Home ----------
async function cargarHome() {
  const titulo = document.getElementById('heroTitulo');
  const texto = document.getElementById('heroTexto');
  if (!titulo || !texto) return;

  const datos = await (await fetch('/api/contenido')).json();
  titulo.textContent = datos.heroTitulo;
  texto.textContent = datos.heroTexto;
}

// ---------- Quiénes somos (misión / visión / principios / ficha) ----------
async function cargarNosotros() {
  const grid = document.getElementById('mvGrid');
  if (!grid) return;

  const datos = await (await fetch('/api/contenido')).json();

  document.getElementById('textoQuienesSomos').textContent = datos.quienesSomos;
  document.getElementById('razonSocial').textContent = datos.razonSocial;
  document.getElementById('nit').textContent = datos.nit;
  document.getElementById('sedeFicha').textContent = datos.sede;

  grid.innerHTML = `
    <div class="mv-tarjeta bloque-ancla" id="mision">
      <img src="${datos.fotoMision}" alt="Misión de Zona 10">
      <h3>Misión</h3>
      <p>${datos.mision}</p>
    </div>
    <div class="mv-tarjeta bloque-ancla" id="vision">
      <img src="${datos.fotoVision}" alt="Visión de Zona 10">
      <h3>Visión</h3>
      <p>${datos.vision}</p>
    </div>
  `;

  const listaPrincipios = document.getElementById('listaPrincipios');
  listaPrincipios.innerHTML = datos.principios.map(p => `<li>${p}</li>`).join('');
}

// ---------- Qué hacemos (públicos + servicios) ----------
async function cargarQueHacemos() {
  const grid = document.getElementById('servicios');
  const gridPublicos = document.getElementById('publicosGrid');
  if (!grid) return;

  const datos = await (await fetch('/api/servicios')).json();

  gridPublicos.innerHTML = datos.publicos.map(p => `
    <div class="material">
      <h3>${p.titulo}</h3>
      <p>${p.descripcion}</p>
      <p class="material__accion">${p.accion}</p>
    </div>
  `).join('');

  grid.innerHTML = datos.servicios.map(s => `
    <div class="material">
      <img src="${s.foto}" alt="${s.titulo}">
      <h3>${s.titulo}</h3>
      <p class="material__publico">${s.publico}</p>
      <p>${s.descripcion}</p>
    </div>
  `).join('');
}

// ---------- Actividades + impacto ----------
async function cargarActividades() {
  const contenedor = document.getElementById('listaActividades');
  if (!contenedor) return;

  const { actividades } = await (await fetch('/api/actividades')).json();

  contenedor.innerHTML = actividades.map(a => `
    <div class="hito">
      <div class="hito__foto"><img src="${a.foto}" alt="${a.titulo}"></div>
      <div>
        <h3>${a.titulo}</h3>
        <p>${a.descripcion}</p>
      </div>
    </div>
  `).join('');

  const gridImpacto = document.getElementById('impactoGrid');
  if (gridImpacto) {
    const datos = await (await fetch('/api/contenido')).json();
    gridImpacto.innerHTML = datos.impacto.map(i => `
      <div class="impacto-tarjeta">
        <h3>${i.titulo}</h3>
        <p>${i.descripcion}</p>
      </div>
    `).join('');
  }
}

// ---------- Aliados ----------
async function cargarAliados() {
  const grid = document.getElementById('aliadosGrid');
  if (!grid) return;

  const datos = await (await fetch('/api/aliados')).json();

  grid.innerHTML = datos.tipos.map(a => `
    <div class="aliado">
      <img src="${a.logo}" alt="${a.nombre}">
      <h3>${a.nombre}</h3>
      <p>${a.descripcion}</p>
    </div>
  `).join('');

  document.getElementById('notaAliados').textContent = datos.nota;

  const listaEntidades = document.getElementById('listaEntidades');
  if (listaEntidades) {
    listaEntidades.innerHTML = datos.entidadesQueRegulan.map(e => `
      <div class="entidad">
        <h3>${e.nombre}</h3>
        <p>${e.descripcion}</p>
      </div>
    `).join('');
  }
}

// ---------- Contacto ----------
async function cargarContacto() {
  const sede = document.getElementById('sedeContacto');
  if (!sede) return;

  const datos = await (await fetch('/api/contenido')).json();
  sede.textContent = datos.sede;
  document.getElementById('telefonoContacto').textContent = datos.telefono;
  document.getElementById('correoContacto').textContent = datos.correo;
}

// ---------- Formulario de contacto (por ahora solo maqueta visual) ----------
function configurarFormularios() {
  const formContacto = document.getElementById('formularioContacto');
  if (formContacto) {
    formContacto.addEventListener('submit', (evento) => {
      evento.preventDefault();
      alert('Gracias por escribirnos. Pronto este formulario quedará conectado para generar un número de radicado real.');
      formContacto.reset();
    });
  }
}

configurarIndicadorNav();
configurarWhatsapp();
configurarBotonFlotante();
cargarHome();
cargarNosotros();
cargarQueHacemos();
cargarActividades();
cargarAliados();
cargarContacto();
configurarFormularios();