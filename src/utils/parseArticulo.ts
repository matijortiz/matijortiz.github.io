// src/utils/parseArticulo.ts
import { marked } from 'marked';

marked.setOptions({ breaks: false, gfm: true });

export interface SeccionesArticulo {
  cuerpoHtml:    string;
  fragmentoHtml: string;
  analisisHtml:  string;
  extraHtml:     string;
}

function renderMd(md: string): string {
  if (!md.trim()) return '';
  return marked.parse(md) as string;
}

export function parseArticulo(rawBody: string): SeccionesArticulo {
  const SEP_FRAG  = /<!--\s*FRAGMENTO\s*-->/i;
  const SEP_ANAL  = /<!--\s*ANALISIS\s*-->/i;
  const SEP_EXTRA = /<!--\s*EXTRA\s*-->/i;

  let cuerpo = rawBody, fragmento = '', analisis = '', extra = '';

  const idxFrag = rawBody.search(SEP_FRAG);
  if (idxFrag !== -1) {
    cuerpo = rawBody.slice(0, idxFrag).trim();
    const r1 = rawBody.slice(idxFrag).replace(SEP_FRAG, '').trim();

    const idxAnal = r1.search(SEP_ANAL);
    if (idxAnal !== -1) {
      fragmento = r1.slice(0, idxAnal).trim();
      const r2  = r1.slice(idxAnal).replace(SEP_ANAL, '').trim();
      const idxX = r2.search(SEP_EXTRA);
      if (idxX !== -1) { analisis = r2.slice(0, idxX).trim(); extra = r2.slice(idxX).replace(SEP_EXTRA,'').trim(); }
      else { analisis = r2; }
    } else {
      const idxX = r1.search(SEP_EXTRA);
      if (idxX !== -1) { fragmento = r1.slice(0, idxX).trim(); extra = r1.slice(idxX).replace(SEP_EXTRA,'').trim(); }
      else { fragmento = r1; }
    }
  } else {
    const idxX = rawBody.search(SEP_EXTRA);
    if (idxX !== -1) { cuerpo = rawBody.slice(0, idxX).trim(); extra = rawBody.slice(idxX).replace(SEP_EXTRA,'').trim(); }
  }

  return {
    cuerpoHtml:    renderMd(cuerpo),
    fragmentoHtml: renderMd(fragmento),
    analisisHtml:  renderMd(analisis),
    extraHtml:     renderMd(extra),
  };
}
