// ─── UTILIDADES ────────────────────────────────────────────────────────────

function rot13(s) {
  return s.replace(/[a-zA-Z]/g, function(c) {
    return String.fromCharCode(
      (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
    );
  });
}

function tiempoLectura(el) {
  if (!el) return 0;
  var palabras = (el.innerText || el.textContent || '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(palabras / 220));
}


// ─── EMAIL ─────────────────────────────────────────────────────────────────

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
  var mins = tiempoLectura(art.querySelector('.entrada-cuerpo'))
           + tiempoLectura(art.querySelector('.entrada-extra'));
  var badge = document.createElement('span');
  badge.className = 'entrada-lectura';
  badge.textContent = mins + ' min';
  meta.appendChild(badge);
});


// ─── MODO LECTURA ──────────────────────────────────────────────────────────
// display:none / display:flex — 100% robusto, sin opacity ni pointer-events.

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

if (!lector || !lectorCerrar) {
  console.warn('Modo lectura: overlay no encontrado en el DOM');
} else {

  var focusAnterior = null;

  function abrirLector(articulo) {
    var img    = articulo.querySelector('.entrada-imagen');
    var tipo   = articulo.querySelector('.entrada-tipo');
    var fecha  = articulo.querySelector('.entrada-fecha');
    var tit    = articulo.querySelector('.entrada-titulo');
    var cuerpo = articulo.querySelector('.entrada-cuerpo');
    var extra  = articulo.querySelector('.entrada-extra');

    // Imagen — solo si tiene src real
    if (img && img.src && img.src !== window.location.href) {
      lectorImagen.src = img.src;
      lectorImagen.alt = img.alt || '';
      lectorImagen.style.display = 'block';
    } else {
      lectorImagen.style.display = 'none';
      lectorImagen.removeAttribute('src');
    }

    // Meta
    var tipoText = tipo ? tipo.textContent.trim() : '';
    lectorTipo.textContent   = tipoText;
    lectorMTipo.textContent  = tipoText;
    lectorMFecha.textContent = fecha ? fecha.textContent.trim() : '';

    // Título (preserva HTML para itálicas)
    lectorTitulo.innerHTML = tit ? tit.innerHTML : '';

    // Texto: cuerpo + extra juntos
    var bloques = '';
    if (cuerpo) bloques += cuerpo.innerHTML;
    if (extra)  bloques += extra.innerHTML;
    lectorTexto.innerHTML = bloques;

    // Reset scroll y barra
    lectorBarra.style.width = '0%';
    lectorScroll.scrollTop = 0;

    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';

    // MOSTRAR overlay
    lector.classList.add('activo');

    // Foco al botón cerrar (con pequeño delay para que el display:flex esté activo)
    focusAnterior = document.activeElement;
    setTimeout(function() { lectorCerrar.focus(); }, 50);
  }

  function cerrarLector() {
    lector.classList.remove('activo');
    document.body.style.overflow = '';
    // Limpiar src después de que desaparece
    setTimeout(function() {
      lectorImagen.removeAttribute('src');
      lectorImagen.style.display = 'none';
    }, 100);
    if (focusAnterior) {
      focusAnterior.focus();
      focusAnterior = null;
    }
  }

  // Barra de progreso al scrollear dentro del lector
  lectorScroll.addEventListener('scroll', function() {
    var max = lectorScroll.scrollHeight - lectorScroll.clientHeight;
    var pct = max > 0 ? (lectorScroll.scrollTop / max) * 100 : 100;
    lectorBarra.style.width = pct + '%';
  });

  // Cerrar con el botón
  lectorCerrar.addEventListener('click', cerrarLector);

  // Cerrar con Escape / trampa Tab
  document.addEventListener('keydown', function(e) {
    if (!lector.classList.contains('activo')) return;
    if (e.key === 'Escape') { cerrarLector(); }
    if (e.key === 'Tab')    { e.preventDefault(); lectorCerrar.focus(); }
  });

  // Click en el fondo oscuro también cierra
  lector.addEventListener('click', function(e) {
    if (e.target === lector) cerrarLector();
  });

  // Conectar todos los "Seguir leyendo" al lector
  document.querySelectorAll('.leer-mas').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var articulo = this.closest('.entrada');
      if (articulo) abrirLector(articulo);
    });
  });

} // fin if lector existe
