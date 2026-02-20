// ─── UTILIDADES ────────────────────────────────────────────────────────────

// Rot13 para deobfuscación de email
function rot13(s) {
  return s.replace(/[a-zA-Z]/g, function(c) {
    return String.fromCharCode(
      (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
    );
  });
}

// Tiempo de lectura estimado (palabras / 220 palabras por minuto)
function tiempoLectura(el) {
  if (!el) return 1;
  var texto = el.innerText || el.textContent || '';
  var palabras = texto.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palabras / 220));
}


// ─── EMAIL DEOBFUSCADO ──────────────────────────────────────────────────────

document.querySelectorAll('.email-link').forEach(function(el) {
  var decoded = rot13(el.dataset.e);
  el.href = 'mailto:' + decoded;
  el.removeAttribute('data-e');
});

document.querySelectorAll('.email-text').forEach(function(el) {
  el.textContent = rot13(el.textContent);
});


// ─── BADGE TIEMPO DE LECTURA ────────────────────────────────────────────────

document.querySelectorAll('.entrada').forEach(function(art) {
  var meta = art.querySelector('.entrada-meta');
  if (!meta) return;
  var cuerpo = art.querySelector('.entrada-cuerpo');
  var extra  = art.querySelector('.entrada-extra');
  var mins   = tiempoLectura(cuerpo) + tiempoLectura(extra);
  var badge  = document.createElement('span');
  badge.className = 'entrada-lectura';
  badge.setAttribute('aria-label', mins + ' minutos de lectura');
  badge.textContent = mins + ' min';
  meta.appendChild(badge);
});


// ─── MODO LECTURA INMERSIVO ─────────────────────────────────────────────────

var lector       = document.getElementById('lector');
var lectorScroll = document.getElementById('lector-scroll');
var lectorBarra  = document.getElementById('lector-barra');
var lectorTipo   = document.getElementById('lector-tipo');
var lectorMTipo  = document.getElementById('lector-meta-tipo');
var lectorMFecha = document.getElementById('lector-meta-fecha');
var lectorTitulo = document.getElementById('lector-titulo');
var lectorImagen = document.getElementById('lector-imagen');
var lectorTexto  = document.getElementById('lector-texto');
var lectorCerrar = document.getElementById('lector-cerrar');

// Elemento que tenía el foco antes de abrir (para restaurarlo al cerrar)
var focusAnterior = null;

function abrirLector(articulo) {
  var img   = articulo.querySelector('.entrada-imagen');
  var tipo  = articulo.querySelector('.entrada-tipo');
  var fecha = articulo.querySelector('.entrada-fecha');
  var tit   = articulo.querySelector('.entrada-titulo');
  var cuerpo = articulo.querySelector('.entrada-cuerpo');
  var extra  = articulo.querySelector('.entrada-extra');

  // Imagen
  if (img && img.src) {
    lectorImagen.src = img.src;
    lectorImagen.alt = img.alt || '';
    lectorImagen.style.display = 'block';
  } else {
    lectorImagen.style.display = 'none';
  }

  // Meta
  var tipoText  = tipo  ? tipo.textContent  : '';
  var fechaText = fecha ? fecha.textContent : '';
  lectorTipo.textContent  = tipoText;
  lectorMTipo.textContent = tipoText;
  lectorMFecha.textContent = fechaText;

  // Título
  lectorTitulo.innerHTML = tit ? tit.innerHTML : '';

  // Texto: cuerpo visible + contenido extra
  var bloques = '';
  if (cuerpo) bloques += cuerpo.innerHTML;
  if (extra)  bloques += extra.innerHTML;
  lectorTexto.innerHTML = bloques;

  // Abrir
  lector.classList.add('activo');
  lectorScroll.scrollTop = 0;
  lectorBarra.style.width = '0%';
  document.body.style.overflow = 'hidden';

  // Accesibilidad — guardar foco y moverlo al botón cerrar
  focusAnterior = document.activeElement;
  lectorCerrar.focus();
}

function cerrarLector() {
  lector.classList.remove('activo');
  document.body.style.overflow = '';
  // Devolver el foco al elemento que lo tenía antes
  if (focusAnterior) {
    focusAnterior.focus();
    focusAnterior = null;
  }
}

// Barra de progreso al hacer scroll dentro del lector
lectorScroll.addEventListener('scroll', function() {
  var max = lectorScroll.scrollHeight - lectorScroll.clientHeight;
  var pct = max > 0 ? (lectorScroll.scrollTop / max) * 100 : 100;
  lectorBarra.style.width = pct + '%';
  lectorBarra.setAttribute('aria-valuenow', Math.round(pct));
});

// Cerrar con botón
lectorCerrar.addEventListener('click', cerrarLector);

// Cerrar con Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && lector.classList.contains('activo')) {
    cerrarLector();
  }
  // Trampa de foco dentro del overlay (Tab y Shift+Tab)
  if (e.key === 'Tab' && lector.classList.contains('activo')) {
    // Solo hay un elemento focusable (el botón cerrar), así que simplemente mantenemos el foco ahí
    e.preventDefault();
    lectorCerrar.focus();
  }
});

// Conectar cada botón "Seguir leyendo" al lector
document.querySelectorAll('.leer-mas').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var articulo = this.closest('.entrada');
    if (articulo) abrirLector(articulo);
  });
});
