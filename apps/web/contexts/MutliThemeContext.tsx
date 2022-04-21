import React from 'react';
import { Theme, ThemeProvider } from '@mui/material/styles';
import { MaybePromise } from 'shared';


export interface CreateMultiThemeContextProps<K extends string> {
  theme: Theme;
  themes?: Record<K, () => MaybePromise<Theme | { default: Theme }>>;
}

export interface MultiThemeContextValue<K extends string> {
  setTheme: (theme: Theme | K) => void;
}

const noop = () => {};

const createMultiThemeContext = <K extends string>({ theme: initialTheme, themes  }: CreateMultiThemeContextProps<K>) => {

  const Context = React.createContext<MultiThemeContextValue<K>>({ setTheme: noop });
  
  const Provider = ({ children }: { children: React.ReactNode }) => {

    const [theme, _setTheme] = React.useState(initialTheme);

    const setTheme = async (theme: K | Theme) => {

      if (typeof theme === 'string') {
        if (!themes) throw new Error('No themes defined!');
        if (!themes[theme]) throw new Error(`Theme '${theme}' not found!`);
        const result = await themes[theme]();
        
        if ('default' in result) {
          _setTheme(result.default);
          return;
        }
        
        _setTheme(result);
        return;
      }

      _setTheme(theme);
    }


    return (
      <Context.Provider value={{ setTheme }}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </Context.Provider>
    )
  }

  return {
    useContext: () => React.useContext(Context),
    Provider,
  }
}

export default createMultiThemeContext;