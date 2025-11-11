import Star from '../components/StarRating';

export const getPercentage = (count: number, total: number) =>
  total > 0 ? (count / total) * 100 : 0;

export function darkenColor(hex: string, amount: number): string {
  const num = Number.parseInt(hex.slice(1), 16);
  const amt = Math.round(255 * amount);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `rgb(${R}, ${G}, ${B})`;
}

export function lightenColor(hex: string, amount: number): string {
  const num = Number.parseInt(hex.slice(1), 16);
  const amt = Math.round(255 * amount);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
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
  '#E63946', // bright red
  '#F1FAEE', // soft off-white
  '#1D2ff7', // dark navy blue
  '#A8DADC', // light cyan
  '#FFBE0B', // golden yellow
  '#261653', // deep teal
  '#F77F00', // vivid orange
  '#6A4C93', // purple
  '#2A9D8F', // teal green
  '#fD99AE', // muted gray-blue
  '#0077B6', // strong blue
  '#7300E6', // neon purple
];

export function getColor(identifier: number) {
  return colorPalette[identifier % colorPalette.length];
}

export function isMobileView() {
  return window.innerWidth <= 948;
}

export function getParsedDifficultyLevel(difficultyLevel: string) {
  switch (difficultyLevel) {
    case 'EASY':
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          <span style={{ color: '#11EE0A' }}>ŁATWE</span>
          <Star />
        </div>
      );
    case 'MEDIUM':
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          <span style={{ color: '#FFC96B' }}>ŚREDNIE</span>
          <Star />
          <Star />
        </div>
      );
    case 'HARD':
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          <span style={{ color: '#CC211F' }}>TRUDNE</span>
          <Star />
          <Star />
          <Star />
        </div>
      );
  }
}
