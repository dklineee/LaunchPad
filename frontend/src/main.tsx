import React from 'react';
import {createRoot} from 'react-dom/client';
import {ThemeProvider, createTheme, CssBaseline} from '@mui/material';
import App from './App';
import './style.css';

const theme = createTheme({
  palette: {primary: {main: '#375ddd'}, background: {default:'#f5f7fb'}},
  typography: {fontFamily: 'Inter, system-ui, sans-serif', button:{textTransform:'none',fontWeight:600}},
  shape:{borderRadius:10},
  components:{MuiButton:{defaultProps:{disableElevation:true}}}
});
createRoot(document.getElementById('root')!).render(
  <React.StrictMode><ThemeProvider theme={theme}><CssBaseline/><App/></ThemeProvider></React.StrictMode>
);
