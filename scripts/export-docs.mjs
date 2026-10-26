import { build } from 'esbuild';
import { mkdir, writeFile, copyFile, cp } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import katex from 'katex';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
await mkdir('.cache', { recursive: true });
await build({
  stdin: {
    contents:
      "export {exercises} from './src/content'; export {presentation} from './presentation.config'; export {ModelPlot} from './src/components/ModelPlot'; export {modelPlotDescriptions} from './src/model-plots';",
    resolveDir: process.cwd(),
  },
  outfile: '.cache/handout.mjs',
  bundle: true,
  format: 'esm',
  platform: 'node',
  packages: 'external',
});
const { exercises, presentation, ModelPlot, modelPlotDescriptions } = await import(
  pathToFileURL(resolve('.cache/handout.mjs')).href + '?' + Date.now()
);
const escape = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const math = (tex) =>
  katex.renderToString(tex, {
    displayMode: true,
    throwOnError: true,
    trust: false,
    strict: 'ignore',
  });
let md = '# ' + presentation.title + '\n\n' + presentation.description + '\n\n';
let body = `<h1>${escape(presentation.title)}</h1><p>${escape(presentation.description)}</p>`;
for (const section of exercises) {
  md += `## ${section.title}\n\n`;
  body += `<section><h2>${escape(section.title)}</h2>`;
  for (const activity of section.activities) {
    md += `### ${activity.label}\n\n${activity.prompt}\n\n$$${activity.tex}$$\n\n`;
    body += `<article><h3>${escape(activity.label)}</h3><p>${escape(activity.prompt)}</p><div class="formula">${math(activity.tex)}</div>`;
    if (activity.note) {
      md += activity.note + '\n\n';
      body += `<aside>${escape(activity.note)}</aside>`;
    }
    for (const [i, step] of activity.steps.entries()) {
      md +=
        `${i + 1}. **${step.title}**\n\n` +
        (step.prose ? step.prose.join('\n\n') : `$$${step.tex}$$`) +
        (step.plot ? `\n\n${modelPlotDescriptions[step.plot]}` : '') +
        `\n\n${step.why}\n\n`;
      body +=
        `<div class="step"><h4>${i + 1}. ${escape(step.title)}</h4>` +
        (step.prose
          ? step.prose.map((p) => `<p>${escape(p)}</p>`).join('')
          : `<div class="formula">${math(step.tex)}</div>`) +
        (step.plot
          ? renderToStaticMarkup(createElement(ModelPlot, { kind: step.plot, print: true }), {
              identifierPrefix: `${activity.id}-${i}-`,
            })
          : '') +
        `<p>${escape(step.why)}</p></div>`;
    }
    md += `$$${activity.result}$$\n\n`;
    body += `<div class="result formula">${math(activity.result)}</div></article>`;
  }
  body += '</section>';
}
const html = `<!doctype html><html lang="${escape(presentation.locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(presentation.title)}</title><link rel="stylesheet" href="assets/katex.min.css"><style>body{font:17px/1.65 system-ui,sans-serif;color:#182923;background:#fafbf7;margin:0}main{max-width:940px;margin:auto;padding:30px}article{border-top:1px solid #cdd5c9;margin:35px 0}.step{margin:26px 0;break-inside:avoid}.formula{overflow:auto}h1,h2{font-family:Georgia,serif}.result{border-top:1px solid #cdd5c9;padding:15px}aside{padding:12px;background:#f1ecd7}@media print{body{background:white}main{padding:0}section+section{break-before:page}.formula{overflow:visible}}</style></head><body><main>${body}</main></body></html>`;
await mkdir('public/handout/assets', { recursive: true });
await copyFile('node_modules/katex/dist/katex.min.css', 'public/handout/assets/katex.min.css');
await cp('node_modules/katex/dist/fonts', 'public/handout/assets/fonts', { recursive: true });
await writeFile('public/handout/index.html', html);
await writeFile('public/handout/handout.md', md);
console.log(`Exported ${exercises.length} sections to public/handout (HTML and Markdown).`);
