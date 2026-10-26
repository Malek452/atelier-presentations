/** Preserve semantic color roles when customizing this palette.
 * The same values feed React/CSS, KaTeX highlights and Motion Canvas. */
export const theme = {
  board: '#182923',
  panel: '#233a2f',
  controls: '#20372b',
  line: '#3b5143',
  text: '#eef2e9',
  explanation: '#e3e9de',
  muted: '#b4c3b3',
  controlAccent: '#e7c484',
  mathInk: '#f1f2e9',
  active: '#edc57e',
  second: '#a9cfe8',
  base: '#b8d6ba',
  fallbackActive: '#e4bb78',
};

export function applyTheme() {
  const root = document.documentElement;
  const properties = {
    '--board': theme.board,
    '--panel': theme.panel,
    '--controls': theme.controls,
    '--line': theme.line,
    '--ink': theme.text,
    '--explanation': theme.explanation,
    '--muted': theme.muted,
    '--gold': theme.controlAccent,
    '--active': theme.active,
    '--second': theme.second,
    '--base': theme.base,
  };
  for (const [key, value] of Object.entries(properties)) root.style.setProperty(key, value);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.board);
}
