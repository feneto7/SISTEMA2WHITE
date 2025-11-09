// Shared theme tokens for the system UI
// Todas as variáveis globais de tema ficam aqui

export type StatusToken = {
  color: string;
  background: string;
};

export interface ThemeTokens {
  background: {
    primary: string;
    secondary: string;
    sidebar: string;
    content: string;
    white: string;
    window: string;
  };
  border: {
    light: string;
    medium: string;
    dark: string;
    divider: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    label: string;
  };
  selection: {
    blue: string;
    blueLight: string;
    blueDark: string;
    background: string;
    border: string;
  };
  control: {
    background: string;
    border: string;
    hover: string;
    active: string;
    disabled: string;
  };
  input: {
    background: string;
    border: string;
    borderFocus: string;
  };
  button: {
    default: string;
    defaultBorder: string;
    blue: string;
    blueHover: string;
    gradient: string;
  };
  dock: {
    background: string;
    border: string;
    separator: string;
  };
  trafficLights: {
    red: string;
    yellow: string;
    green: string;
    inactive: string;
  };
  status: {
    authorized: StatusToken;
    canceled: StatusToken;
    closed: StatusToken;
    rejected: StatusToken;
    editing: StatusToken;
    waiting: StatusToken;
    closingPending: StatusToken;
    transmissionError: StatusToken;
    voided: StatusToken;
  };
}

export const lightTheme: ThemeTokens = {
  background: {
    primary: '#DEDEDE',
    secondary: '#E4E4E4',
    sidebar: '#D7D7D7',
    content: '#ECECEC',
    white: '#FFFFFF',
    window: '#d1d1d1'
  },
  border: {
    light: '#C8C8C8',
    medium: '#B4B4B4',
    dark: '#979797',
    divider: '#D0D0D0'
  },
  text: {
    primary: '#000000',
    secondary: '#6B6B6B',
    tertiary: '#8E8E8E',
    disabled: '#BEBEBE',
    label: '#464646'
  },
  selection: {
    blue: '#0066CC',
    blueLight: '#4A90E2',
    blueDark: '#0051A8',
    background: '#DCE9F7',
    border: '#3F8FCA'
  },
  control: {
    background: '#FBFBFB',
    border: '#C0C0C0',
    hover: '#F0F0F0',
    active: '#E5E5E5',
    disabled: '#F7F7F7'
  },
  input: {
    background: '#FFFFFF',
    border: '#BABABA',
    borderFocus: '#0066CC'
  },
  button: {
    default: '#FFFFFF',
    defaultBorder: '#ADADAD',
    blue: '#007AFF',
    blueHover: '#0051D5',
    gradient: 'linear-gradient(to bottom, #FFFFFF, #F0F0F0)'
  },
  dock: {
    background: 'rgba(255, 255, 255, 0.25)',
    border: 'rgba(255, 255, 255, 0.5)',
    separator: 'rgba(0, 0, 0, 0.15)'
  },
  trafficLights: {
    red: '#FF5F57',
    yellow: '#FFBD2E',
    green: '#28CA42',
    inactive: '#D6D6D6'
  },
  status: {
    authorized: { color: '#34C759', background: 'rgba(52, 199, 89, 0.1)' },
    canceled: { color: '#FF3B30', background: 'rgba(255, 59, 48, 0.1)' },
    closed: { color: '#5856D6', background: 'rgba(88, 86, 214, 0.1)' },
    rejected: { color: '#FF3B30', background: 'rgba(255, 59, 48, 0.1)' },
    editing: { color: '#FF9500', background: 'rgba(255, 149, 0, 0.1)' },
    waiting: { color: '#007AFF', background: 'rgba(0, 122, 255, 0.1)' },
    closingPending: { color: '#AF52DE', background: 'rgba(175, 82, 222, 0.1)' },
    transmissionError: { color: '#FF3B30', background: 'rgba(255, 59, 48, 0.1)' },
    voided: { color: '#8E8E93', background: 'rgba(142, 142, 147, 0.1)' }
  }
};

export const darkTheme: ThemeTokens = {
  background: {
    primary: '#2F2F31',
    secondary: '#3A3A3D',
    sidebar: '#2B2B2E',
    content: '#38383B',
    white: '#FFFFFF',
    window: '#2A2A2D'
  },
  border: {
    light: '#4A4A4E',
    medium: '#5A5A5E',
    dark: '#6A6A70',
    divider: '#404044'
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#BEBEC2',
    tertiary: '#9A9AA0',
    disabled: '#6E6E73',
    label: '#E6E6EA'
  },
  selection: {
    blue: '#0A84FF',
    blueLight: '#4AA3FF',
    blueDark: '#0066CC',
    background: 'rgba(10, 132, 255, 0.18)',
    border: '#0A84FF'
  },
  control: {
    background: '#2E2E31',
    border: '#45454A',
    hover: '#333336',
    active: '#3A3A3E',
    disabled: '#2E2E31'
  },
  input: {
    background: '#333336',
    border: '#45454A',
    borderFocus: '#0A84FF'
  },
  button: {
    default: '#343437',
    defaultBorder: '#505055',
    blue: '#0A84FF',
    blueHover: '#006FE0',
    gradient: 'linear-gradient(to bottom, #3A3A3D, #343437)'
  },
  dock: {
    background: 'rgba(60, 60, 65, 0.35)',
    border: 'rgba(255, 255, 255, 0.14)',
    separator: 'rgba(255, 255, 255, 0.10)'
  },
  trafficLights: {
    red: '#FF5F57',
    yellow: '#FFBD2E',
    green: '#28CA42',
    inactive: '#68686B'
  },
  status: {
    authorized: { color: '#30D158', background: 'rgba(48, 209, 88, 0.14)' },
    canceled: { color: '#FF453A', background: 'rgba(255, 69, 58, 0.14)' },
    closed: { color: '#5E5CE6', background: 'rgba(94, 92, 230, 0.14)' },
    rejected: { color: '#FF453A', background: 'rgba(255, 69, 58, 0.14)' },
    editing: { color: '#FF9F0A', background: 'rgba(255, 159, 10, 0.14)' },
    waiting: { color: '#0A84FF', background: 'rgba(10, 132, 255, 0.14)' },
    closingPending: { color: '#BF5AF2', background: 'rgba(191, 90, 242, 0.14)' },
    transmissionError: { color: '#FF453A', background: 'rgba(255, 69, 58, 0.14)' },
    voided: { color: '#8E8E93', background: 'rgba(142, 142, 147, 0.14)' }
  }
};


