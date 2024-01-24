import { Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import Splash from './components/Splash';
import { routes } from './routes';
import AuthProvider from './contexts/AuthContext';
import SideBar from './components/SideBar';
import Sb from './components/Sb';


export const appTheme: Theme = createTheme({
  palette: {
    primary: {
      main: '#009A95',
    },
    secondary: {
      main: '#ffffff',
    },
    text: {
      primary: '#191D23',
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
});

function App() {


  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>
       <Suspense fallback={<Splash />}>
          <AuthProvider>
            <BrowserRouter>
            <Routes>
        {routes.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={route.path !== '/' ? <Sb>{route.component}</Sb> : route.component}
          />
        ))}
      </Routes>
            </BrowserRouter>
          </AuthProvider>
        </Suspense>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
