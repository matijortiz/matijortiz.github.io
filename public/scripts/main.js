// ════ MATIAS J. ORTIZ — script.js ════════════════════════════════════════

// ─── HAMBURGER MENU ─────────────────────────────────────────────────────────
var hamburger = document.getElementById('hamburger');
var navPrincipal = document.getElementById('nav-principal');

if (hamburger && navPrincipal) {
  hamburger.addEventListener('click', function() {
    var abierto = navPrincipal.classList.toggle('abierto');
    hamburger.classList.toggle('activo', abierto);
    hamburger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    document.body.style.overflow = abierto ? 'hidden' : '';
  });

  // Cerrar al hacer click en un link del menú
  navPrincipal.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      navPrincipal.classList.remove('abierto');
      hamburger.classList.remove('activo');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navPrincipal.classList.contains('abierto')) {
      navPrincipal.classList.remove('abierto');
      hamburger.classList.remove('activo');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ─── EMAIL ROT13 ────────────────────────────────────────────────────────────
function rot13(s) {
  return s.replace(/[a-zA-Z]/g, function(c) {
    return String.fromCharCode(
      (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
    );
  });
}
document.querySelectorAll('.email-link').forEach(function(el) {
  if (!el.dataset.e) return;
  el.href = 'mailto:' + rot13(el.dataset.e);
  el.removeAttribute('data-e');
});
document.querySelectorAll('.email-text').forEach(function(el) {
  el.textContent = rot13(el.textContent);
});

// ─── BADGE TIEMPO DE LECTURA ────────────────────────────────────────────────
document.querySelectorAll('.entrada').forEach(function(art) {
  var meta = art.querySelector('.entrada-meta');
  if (!meta) return;
  var txt = ['.entrada-cuerpo','.entrada-analisis','.entrada-extra'].reduce(function(acc, sel) {
    var el = art.querySelector(sel);
    return acc + (el ? el.innerText : '');
  }, '');
  var mins = Math.max(1, Math.round(txt.trim().split(/\s+/).length / 220));
  var badge = document.createElement('span');
  badge.className = 'entrada-lectura';
  badge.textContent = mins + ' min';
  meta.appendChild(badge);
});

// ─── MODO LECTURA (artículos) ───────────────────────────────────────────────
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

var focusAntLector = null;
var articuloActual = null; // referencia al artículo abierto en lector

function _cerrarLector() {
  lector.classList.remove('activo');
  document.body.style.overflow = '';
  articuloActual = null;
  setTimeout(function() {
    if (lectorImagen) { lectorImagen.removeAttribute('src'); lectorImagen.style.display = 'none'; }
  }, 100);
  if (focusAntLector) { focusAntLector.focus(); focusAntLector = null; }
}

if (lector && lectorCerrar) {

  function abrirLector(art) {
    articuloActual = art;
    var img      = art.querySelector('.entrada-imagen');
    var tipo     = art.querySelector('.entrada-tipo');
    var fecha    = art.querySelector('.entrada-fecha');
    var tit      = art.querySelector('.entrada-titulo');
    var cuerpo   = art.querySelector('.entrada-cuerpo');
    var analisis = art.querySelector('.entrada-analisis');
    var extra    = art.querySelector('.entrada-extra');

    if (img && img.src && img.src !== window.location.href) {
      lectorImagen.src = img.src; lectorImagen.alt = img.alt || '';
      lectorImagen.style.display = 'block';
    } else {
      lectorImagen.style.display = 'none'; lectorImagen.removeAttribute('src');
    }
    var tipoTxt = tipo ? tipo.textContent.trim() : '';
    if (lectorTipo)   lectorTipo.textContent   = tipoTxt;
    if (lectorMTipo)  lectorMTipo.textContent  = tipoTxt;
    if (lectorMFecha) lectorMFecha.textContent = fecha ? fecha.textContent.trim() : '';
    if (lectorTitulo) lectorTitulo.innerHTML   = tit ? tit.innerHTML : '';

    // Construir contenido
    var bloques = '';
    if (cuerpo)   bloques += cuerpo.innerHTML;
    if (analisis) bloques += analisis.innerHTML;
    if (extra)    bloques += extra.innerHTML;
    if (lectorTexto) lectorTexto.innerHTML = bloques;

    // Si el artículo tiene fragmento, inyectar botón "Leer las primeras páginas"
    // Se inserta DESPUÉS del cuerpo (entre cuerpo y análisis), marcado con id para no duplicar
    var fragmento = art.querySelector('.fragmento-contenido');
    if (fragmento && lectorTexto) {
      var btnExistente = lectorTexto.querySelector('.lector-abrir-libro');
      if (!btnExistente) {
        var titRelato = fragmento.dataset.titulo || 'el relato';
        var divBtn = document.createElement('div');
        divBtn.className = 'lector-fragmento-cta';
        divBtn.innerHTML =
          '<button class="abrir-libro lector-abrir-libro" ' +
          'aria-label="Leer las primeras páginas de ' + titRelato + ' tipografiadas como libro">' +
          'Leer las primeras páginas →' +
          '</button>';
        // Insertar después del primer bloque (cuerpo), antes del análisis
        var primerParrafo = lectorTexto.querySelector('p:last-of-type');
        if (primerParrafo) {
          primerParrafo.parentNode.insertBefore(divBtn, primerParrafo.nextSibling);
        } else {
          lectorTexto.appendChild(divBtn);
        }
        // El botón inyectado abre el libro-lector
        divBtn.querySelector('.lector-abrir-libro').addEventListener('click', function(e) {
          e.preventDefault();
          if (articuloActual) abrirLibro(articuloActual);
        });
      }
    }

    if (lectorBarra)  lectorBarra.style.width = '0%';
    if (lectorScroll) lectorScroll.scrollTop  = 0;
    document.body.style.overflow = 'hidden';

    var artId = art.id || '';
    history.pushState({ overlay: 'lector', id: artId }, '', artId ? '#' + artId : '');

    lector.classList.add('activo');
    focusAntLector = document.activeElement;
    setTimeout(function() { lectorCerrar.focus(); }, 50);
  }

  lectorScroll.addEventListener('scroll', function() {
    var max = lectorScroll.scrollHeight - lectorScroll.clientHeight;
    lectorBarra.style.width = (max > 0 ? (lectorScroll.scrollTop / max) * 100 : 100) + '%';
  });

  lectorCerrar.addEventListener('click', function() { history.back(); });
  lector.addEventListener('click', function(e) { if (e.target === lector || e.target === lectorScroll) history.back(); });

  // Botones "Seguir leyendo" del feed
  document.querySelectorAll('.leer-mas').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var art = this.closest('.entrada');
      if (art) abrirLector(art);
    });
  });

  // Botones "Leer sobre el libro" de las tarjetas de publicaciones
  document.querySelectorAll('[data-abrir-entrada]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var id = this.dataset.abrirEntrada;
      var art = document.getElementById(id);
      if (art) abrirLector(art);
    });
  });

}

// ─── LIBRO LECTOR (fragmento tipografiado) ──────────────────────────────────
var libroLector    = document.getElementById('libro-lector');
var libroScroll    = document.getElementById('libro-scroll');
var libroBarra     = document.getElementById('libro-barra');
var libroCerrar    = document.getElementById('libro-cerrar');
var libroColeccion = document.getElementById('libro-coleccion');
var libroTituloEl  = document.getElementById('libro-titulo-relato');
var libroRunningEl = document.getElementById('libro-running-titulo');
var libroTextoEl   = document.getElementById('libro-texto');

var focusAntLibro = null;

function _cerrarLibro() {
  libroLector.classList.remove('activo');
  document.body.style.overflow = 'hidden'; // volver al modo lectura (que sigue abierto)
  if (focusAntLibro) { focusAntLibro.focus(); focusAntLibro = null; }
}

if (libroLector && libroCerrar) {

  function abrirLibro(art) {
    var fragmento = art.querySelector('.fragmento-contenido');
    if (!fragmento) return;

    if (libroColeccion) libroColeccion.textContent = fragmento.dataset.coleccion || '';
    if (libroTituloEl)  libroTituloEl.textContent  = fragmento.dataset.titulo    || '';
    if (libroRunningEl) libroRunningEl.textContent = fragmento.dataset.titulo    || '';
    if (libroTextoEl) {
      libroTextoEl.innerHTML = '';
      fragmento.querySelectorAll('p').forEach(function(p) {
        libroTextoEl.appendChild(p.cloneNode(true));
      });
    }
    if (libroBarra)  libroBarra.style.width = '0%';
    if (libroScroll) libroScroll.scrollTop  = 0;
    document.body.style.overflow = 'hidden';

    // Segundo pushState: atrás cierra libro pero queda en lector
    history.pushState({ overlay: 'libro' }, '');

    libroLector.classList.add('activo');
    focusAntLibro = document.activeElement;
    setTimeout(function() { libroCerrar.focus(); }, 50);
  }

  if (libroScroll && libroBarra) {
    libroScroll.addEventListener('scroll', function() {
      var max = libroScroll.scrollHeight - libroScroll.clientHeight;
      libroBarra.style.width = (max > 0 ? (libroScroll.scrollTop / max) * 100 : 100) + '%';
    });
  }

  libroCerrar.addEventListener('click', function() { history.go(-2); }); // cierra libro Y lector
  var libroVolver = document.getElementById('libro-volver');
  if (libroVolver) libroVolver.addEventListener('click', function() { history.back(); }); // solo cierra libro
  libroLector.addEventListener('click', function(e) { if (e.target === libroLector) history.back(); });

}

// ─── POPSTATE — botón Atrás cierra overlays, no sale del sitio ─────────────
// Stack de navegación:
// página → lector (pushState) → libro (pushState)
// Atrás desde libro: cierra libro, queda en lector
// Atrás desde lector: cierra lector, queda en página
window.addEventListener('popstate', function(e) {
  if (libroLector && libroLector.classList.contains('activo')) {
    _cerrarLibro(); return;
  }
  if (lector && lector.classList.contains('activo')) {
    _cerrarLector(); return;
  }
});

// ─── ESCAPE + TAB TRAP ─────────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (libroLector && libroLector.classList.contains('activo')) {
    if (e.key === 'Escape') { e.preventDefault(); history.back(); return; }
    if (e.key === 'Tab')    { e.preventDefault(); libroCerrar.focus(); return; }
  }
  if (lector && lector.classList.contains('activo')) {
    if (e.key === 'Escape') { e.preventDefault(); history.back(); return; }
    if (e.key === 'Tab')    { e.preventDefault(); lectorCerrar.focus(); return; }
  }
});

// ─── ABRIR OVERLAY DESDE HASH EN LA URL ───────────────────────────────────
// Permite compartir links directos: matijortiz.github.io/#entrada-genius
window.addEventListener('DOMContentLoaded', function() {
  var hash = window.location.hash.replace('#', '');
  if (!hash) return;
  var art = document.getElementById(hash);
  if (art && art.classList.contains('entrada')) {
    setTimeout(function() { abrirLector(art); }, 150);
  }
});
