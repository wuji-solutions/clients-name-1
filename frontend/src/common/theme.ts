import { darkenColor, lightenColor } from "./utils";

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
      info_text: lightenColor('#1c2c36', 0.13),
    },
    button: {
      primary: '#2758e8',
      accent: darkenColor('#1349eb', 0.03),
      background: 'secondary',
      info: '#626770',
      info_accent: darkenColor('#626770', 0.1),
    },
  },
};

export default theme;
