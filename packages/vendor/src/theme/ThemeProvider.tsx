import { ThemeProvider } from '@mui/material';
import { StylesProvider } from '@mui/styles';
import React, { useState } from 'react';

import { themeCreator } from './base';

const ThemeContext = React.createContext(
  // eslint-disable-next-line unused-imports/no-unused-vars
  (themeName: string): void => {}
);

interface ThemeProviderWrapperProps {
  children?: React.ReactNode;
}
const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({
  children
}) => {
  const curThemeName = localStorage.getItem('appTheme') || 'PureLightTheme';
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const setThemeName = (themeName: string): void => {
    localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StylesProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;