# CÓMO HACER FUNCIONAR EL SITIO NUEVO
## Astro + Decap CMS → GitHub Pages

---

## LO QUE NECESITÁS INSTALADO

- **Node.js 18 o superior** — descargarlo de https://nodejs.org (versión LTS)
- **Git** — probablemente ya lo tenés si antes empujabas commits
- **Una terminal** (PowerShell en Windows, Terminal en Mac/Linux)

Para verificar que Node está instalado:
```
node --version   → tiene que mostrar v18 o v20
npm --version    → cualquier versión está bien
```

---

## PASO 1 — Descargar y configurar el proyecto

1. Descomprimí el archivo `astro-cms-v2.zip`
2. Abrí la carpeta `astro-project` en la terminal
3. Corré:
```
npm install
```
Instala Astro y marked. Tarda 1-2 minutos la primera vez.

---

## PASO 2 — Verlo funcionar en tu computadora

```
npm run dev
```

Abrí el navegador en `http://localhost:4321`

Vas a ver tu sitio completo, con los 12 artículos migrados.
Cualquier cambio que hagas en los archivos .md se refleja en el navegador al instante.

---

## PASO 3 — Subir a GitHub y que se publique solo

Tu repo actual es `matijortiz.github.io`. Tenés que reemplazar su contenido con este proyecto.

**Opción A — Si ya tenés el repo clonado localmente:**
```
# Desde dentro de la carpeta del proyecto Astro:
git init
git remote add origin https://github.com/matijortiz/matijortiz.github.io.git
git add .
git commit -m "Migración a Astro"
git push --force origin main
```

**Opción B — Más seguro: creás una branch nueva primero:**
```
git init
git remote add origin https://github.com/matijortiz/matijortiz.github.io.git
git checkout -b astro
git add .
git commit -m "Migración a Astro"
git push origin astro
```
Después en GitHub: Settings → Branches → cambiar la default branch a `astro`.

---

## PASO 4 — Activar el deploy automático en GitHub

En tu repo de GitHub, ir a:

**Settings → Pages → Source → seleccionar "GitHub Actions"**

La primera vez que pushes, GitHub Actions va a buildear el sitio automáticamente.
Podés ver el progreso en la pestaña **Actions** de tu repo.

En 2-3 minutos, `matijortiz.github.io` tiene el sitio nuevo.

---

## PASO 5 — Configurar el CMS (hacerlo una sola vez)

Esto te permite escribir artículos desde el navegador en `matijortiz.github.io/admin`.

### 5a. Crear el OAuth App en GitHub

Ir a: https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**

Completar:
- **Application name:** matijortiz CMS
- **Homepage URL:** `https://matijortiz.github.io`
- **Authorization callback URL:** `https://api.netlify.com/auth/done`

Hacer clic en "Register application".
Guardar el **Client ID** y generar un **Client Secret** (copiarlo ya que solo se muestra una vez).

### 5b. Crear cuenta en Netlify (gratis, solo para el OAuth)

Ir a https://netlify.com → Sign up con GitHub.

Crear un nuevo sitio:
- **Add new site → Import an existing project → GitHub**
- Seleccionar el repo `matijortiz.github.io`
- En "Build command": `npm run build`
- En "Publish directory": `dist`
- Hacer clic en Deploy

(Netlify va a intentar deployar también, pero no importa — el sitio real sigue siendo GitHub Pages)

### 5c. Activar Identity y Git Gateway en Netlify

En tu sitio de Netlify:

1. **Site configuration → Identity → Enable Identity**
2. **Identity → Settings → External providers → GitHub → Enable**
   - Pegar el Client ID y Client Secret del paso 5a
3. **Identity → Services → Git Gateway → Enable**

### 5d. Actualizar el config del CMS

Abrir `public/admin/config.yml` y verificar que la línea `repo:` tenga tu usuario correcto:
```yaml
backend:
  name: github
  repo: matijortiz/matijortiz.github.io   ← asegurate que sea tu usuario real
```

Si tu usuario de GitHub es distinto de "matijortiz", cambiarlo.

Hacer commit y push del cambio.

---

## PASO 6 — Entrar al panel y publicar tu primer artículo nuevo

Ir a `https://matijortiz.github.io/admin`

- Hacer clic en "Login with GitHub"
- Autorizar el acceso
- Listo — estás adentro del panel

Para publicar un artículo:
1. Clic en "Artículos" → "Nuevo artículo"
2. Completar los campos del formulario
3. Escribir el contenido (acepta Markdown)
4. Para agregar el fragmento del relato: incluir el separador `<!-- FRAGMENTO -->` en el cuerpo
5. Clic en "Publicar" → en 2 minutos está en el sitio

---

## USO DEL CMS EN LOCAL (sin configurar Netlify)

Para testear el CMS en tu computadora sin hacer nada de lo de arriba:

En una terminal:
```
npx decap-server
```

En otra terminal:
```
npm run dev
```

Abrir `http://localhost:4321/admin`

El backend local guarda los cambios directo en los archivos de tu proyecto.
Cuando terminás, hacés commit y push normalmente.

---

## CÓMO AGREGAR UN ARTÍCULO NUEVO (sin el CMS)

Si preferís editar archivos directamente, crear un nuevo `.md` en:
```
src/content/articulos/nombre-del-relato.md
```

Con este formato:
```markdown
---
titulo: "Título: <em>con cursiva si querés</em>"
tipo: "Sobre un relato"
fecha: "Marzo 2026"
imagen: "https://url-de-imagen.jpg"
imagenAlt: "Descripción"
pintura: false
fragmento: "NOMBRE DEL RELATO"
coleccion: "Egixi · Matias J. Ortiz · Rosario"
orden: 13
---

Acá va el cuerpo del artículo.

<!-- FRAGMENTO -->
Acá van las páginas del relato (aparecen en el libro tipografiado).

<!-- ANALISIS -->
Acá va el análisis literario.

<!-- EXTRA -->
Acá va el texto que se expande al hacer "Seguir leyendo".
```

Guardar → commit → push → en 2 minutos está publicado.

---

## ESTRUCTURA DE ARCHIVOS

```
src/content/articulos/    ← cada artículo = un .md
src/layouts/Layout.astro  ← header, footer, overlays
src/pages/index.astro     ← página principal
public/admin/config.yml   ← configuración del CMS
public/styles/global.css  ← todo el CSS
public/scripts/main.js    ← overlays, hamburger, rot13
```

---

## PROBLEMAS FRECUENTES

**El sitio no buildea en GitHub Actions**
→ Ir a la pestaña Actions del repo y ver el error exacto.
→ Normalmente es un error de YAML en algún .md (comillas sin cerrar, etc.)

**El CMS pide login pero no conecta**
→ Verificar que el Client ID y Secret en Netlify sean correctos.
→ Verificar que la Authorization callback URL en el OAuth App sea exactamente `https://api.netlify.com/auth/done`

**Las imágenes no cargan**
→ Si la URL es de Unsplash o ArtStation, pueden tener restricciones de hotlinking.
→ Para las imágenes propias, subirlas a `/public/uploads/` y usar la URL `/uploads/nombre.jpg`

**Un artículo no aparece en el sitio**
→ Verificar que `draft: false` (o que no tenga campo draft)
→ Verificar que el YAML del frontmatter esté bien cerrado con `---`
