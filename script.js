// ─── Expand / collapse artículos ───────────────────────────
document.querySelectorAll('.leer-mas').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var extra = this.previousElementSibling;
    if (!extra || !extra.classList.contains('entrada-extra')) return;
    var abierto = extra.classList.toggle('abierto');
    this.textContent = abierto ? 'Cerrar ↑' : 'Seguir leyendo →';
  });
});

// ─── Deobfuscación de email (rot13) ────────────────────────
// El email está codificado en rot13 en el HTML para evitar
// scrapers de spam. Esta función lo restaura en tiempo real.
function rot13(s) {
  return s.replace(/[a-zA-Z]/g, function(c) {
    return String.fromCharCode(
      (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
    );
  });
}

document.querySelectorAll('.email-link').forEach(function(el) {
  var decoded = rot13(el.dataset.e);
  el.href = 'mailto:' + decoded;
  el.removeAttribute('data-e');
});

document.querySelectorAll('.email-text').forEach(function(el) {
  el.textContent = rot13(el.textContent);
});
