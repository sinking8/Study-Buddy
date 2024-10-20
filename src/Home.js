import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import getMPTheme from './theme/getMPTheme';

export default function Home() {
  const MPTheme = createTheme(getMPTheme('light'));
  return (
      <ThemeProvider theme={MPTheme}>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Hero/>
        <Footer/>
      </ThemeProvider>
  );
}
