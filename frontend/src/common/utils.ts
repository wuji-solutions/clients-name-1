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

export const boardgameColorPalette = [
  '#FFC96B',
  '#00BBBf',
  '#F2440D',
  '#6A21CD',
  '#78237C',
  '#B992AA',
  '#dd94f7',
  '#802210',
  '#AD7911',
  '#888040',
  '#992080',
  '#BAAFFA',
  '#CC211F',
  '#972FFF',
  '#A3D922',
  '#AAFFFF',
  '#11EE0A',
];

export function getColor(identifier: number) {
  return colorPalette[identifier % colorPalette.length];
};

export function isMobileView() {
  return window.innerWidth <= 968;
}
