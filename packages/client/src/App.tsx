import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
    fontFamily: 'Manrope',
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>
        <Suspense fallback={<Splash />}>
          <AuthProvider>
            <BrowserRouter>
            {/* <div style={{ display: 'flex',}}> */}
               {/* <SideBar/> */}
               <Sb>
              <Routes>
                {routes.map((route) => (
                  <Route key={route.id} path={route.path} element={route.component} />
                ))}
              </Routes>
              </Sb>
            {/* </div> */}
           
            </BrowserRouter>
          </AuthProvider>
        </Suspense>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
