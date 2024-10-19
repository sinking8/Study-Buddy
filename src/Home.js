import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import getMPTheme from './theme/getMPTheme';

export default function Home() {
  const [mode, setMode] = React.useState('light');
  const MPTheme = createTheme(getMPTheme(mode));

  return (
      <ThemeProvider theme={MPTheme} mode='light'>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <div>
            <Hero/>
        </div>
        <Footer/>
      </ThemeProvider>
  );
}
