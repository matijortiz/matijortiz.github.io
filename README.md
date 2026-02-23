# matijortiz.github.io — v2 con Astro + Decap CMS

Sitio personal de Matias J. Ortiz. Arquitectura estática generada con Astro,
contenido gestionado desde un panel CMS en el navegador.

---

## ¿Qué cambia respecto a la versión 1?

| Antes (v1)                              | Ahora (v2)                                  |
|-----------------------------------------|---------------------------------------------|
| Editar HTML a mano para cada artículo   | Escribir en panel CMS → publicar            |
| Un archivo index.html de 700 líneas     | Cada artículo = un archivo .md              |
| Sin URLs individuales                   | `matijortiz.github.io/articulos/genius`     |
| Sin RSS                                 | Feed RSS automático en /rss.xml             |
| Sin sitemap                             | Sitemap XML automático                      |
| Sin búsqueda posible                    | Base para búsqueda por slug/tipo            |
| Deploy manual por commit directo        | Deploy automático por GitHub Actions        |

El diseño, tipografías, overlays, libro-lector y todo lo visual **queda igual**.

---

## Cómo publicar un artículo nuevo

### Opción A — Panel CMS (recomendada)

1. Abrí `https://matijortiz.github.io/admin`
2. Iniciá sesión con tu cuenta de GitHub
3. Clic en "Artículos" → "Nuevo artículo"
4. Completá los campos: título, tipo, fecha, imagen, etc.
5. Escribí el contenido en el editor. Usá los separadores:

```
Este texto es el cuerpo visible del artículo (entrada-cuerpo).

<!-- FRAGMENTO -->
Acá van las primeras páginas del relato — aparecen en el libro-lector tipografiado.

<!-- ANALISIS -->
Acá va el análisis literario (visible en modo lectura).

<!-- EXTRA -->
Acá va el texto que se expande al hacer "Seguir leyendo".
```

6. Clic en "Publicar" → Decap hace el commit → GitHub Actions buildea → en 2 minutos está live.

### Opción B — Archivo Markdown directo

Creá un archivo en `src/content/articulos/nombre-del-relato.md`:

```markdown
---
titulo: "Título del artículo: <em>con cursiva si querés</em>"
tipo: "Sobre un relato"
fecha: "Marzo 2026"
imagen: "https://url-de-la-imagen.jpg"
imagenAlt: "Descripción de la imagen"
pintura: false
fragmento: "NOMBRE DEL RELATO"
coleccion: "Egixi · Matias J. Ortiz · Rosario"
orden: 1
---

Texto del cuerpo acá.

<!-- FRAGMENTO -->
Texto del relato acá.

<!-- ANALISIS -->
Análisis acá.

<!-- EXTRA -->
Extra acá.
```

Hacé commit y push. GitHub Actions se encarga del resto.

---

## Estructura del proyecto

```
matijortiz.github.io/
├── src/
│   ├── content/
│   │   ├── config.ts              ← schema de los artículos
│   │   └── articulos/
│   │       ├── genius.md          ← artículo 1
│   │       ├── rompe-piernas.md   ← artículo 2
│   │       └── ...               ← uno por artículo
│   ├── layouts/
│   │   └── Layout.astro           ← header, footer, overlays
│   ├── components/
│   │   └── ArticuloCard.astro     ← tarjeta de artículo en el feed
│   ├── pages/
│   │   └── index.astro            ← página principal
│   └── utils/
│       └── parseArticulo.ts       ← parser de separadores
├── public/
│   ├── admin/
│   │   ├── index.html             ← panel CMS
│   │   └── config.yml             ← configuración del CMS
│   ├── styles/
│   │   └── global.css             ← CSS del sitio
│   ├── scripts/
│   │   └── main.js                ← lógica de overlays y menú
│   ├── foto.jpg
│   ├── foto2.JPG
│   └── promesaycastigo.png
├── .github/
│   └── workflows/
│       └── deploy.yml             ← deploy automático
├── astro.config.mjs
└── package.json
```

---

## Instalación desde cero

```bash
# Clonar el repo
git clone https://github.com/matijortiz/matijortiz.github.io
cd matijortiz.github.io

# Instalar dependencias
npm install

# Servidor de desarrollo (localhost:4321)
npm run dev

# Build de producción
npm run build
```

---

## Configurar el panel CMS (una sola vez)

1. En GitHub: **Settings → Pages → Source → GitHub Actions**
2. En GitHub: **Settings → Developer Settings → OAuth Apps → New OAuth App**
   - Application name: `Matias CMS`
   - Homepage URL: `https://matijortiz.github.io`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
3. Guardá el Client ID y Client Secret
4. En Netlify (cuenta gratuita, solo para el auth):
   - New site from Git → elegí el repo
   - Site settings → Identity → Enable
   - Settings → Identity → External providers → GitHub → pegá las credenciales
5. Listo. Entrás a `https://matijortiz.github.io/admin` con tu GitHub.

---

## Fixes aplicados en v2 (respecto a v1)

- ✅ Hamburger menu en mobile (nav fullscreen con animación)
- ✅ Mobile strip — muestra info del sidebar que desaparece en mobile
- ✅ Stub del artículo PyC expandido con contenido real
- ✅ Link Twitter/X marcado como "próximamente" en lugar de href="#" roto
- ✅ `src=""` vacío eliminado del lector-imagen (evita petición 404 on load)
- ✅ `<header>` semántico dentro del overlay → `<div>` (HTML válido)
- ✅ `inset: 0` → `top/left/right/bottom: 0` (compatibilidad Safari antiguo)
- ✅ `<div id="lector-header">` en lugar de `<header>` duplicado

---

## Para agregar más adelante

- **Página individual por artículo** — crear `src/pages/articulos/[slug].astro`
- **RSS feed** — instalar `@astrojs/rss` y crear `src/pages/rss.xml.ts`
- **Búsqueda** — pagefind (se integra en el build de Astro, sin backend)
- **Videos reales** — reemplazar los video-thumbs con embeds de YouTube/Vimeo
- **Modo oscuro/claro** — el tema ya es oscuro, añadir toggle opcional
