import { darkenColor } from "./utils";

const theme = {
  palette: {
    main: {
      background: '#0b1b25',
      panel: '#FFFFFF',
      primary: '#0e8c68',
      secondary: '#64748B',
      accent: '#1c2c36',
      success: '#22C55E',
      error: '#EF4444',
      additional: '#A855F7',
    },
    button: {
      primary: '#2758e8',
      accent: darkenColor('#1349eb', 0.05),
      background: 'secondary',
    },
  },
};

export default theme;
