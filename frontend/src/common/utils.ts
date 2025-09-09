export const getPercentage = (count: number, total: number) =>
  total > 0 ? (count / total) * 100 : 0;

export function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(255 * amount);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `rgb(${R}, ${G}, ${B})`;
}

export const colorPalette = [
  '#FF6B6B',
  '#00ffff',
  '#F2D60D',
  '#6A5ACD',
  '#78C07C',
  '#DDA0DD',
  '#1a24f7',
  '#804040',
  '#e67300',
  '#800040',
  '#408080',
];

export function getColor(identifier: number) {
  return colorPalette[identifier % colorPalette.length];
};

export function isMobileView() {
  return window.innerWidth <= 968;
}
