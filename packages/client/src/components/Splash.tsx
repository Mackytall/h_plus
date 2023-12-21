import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

export interface ISplashProps {}

const Splash = (props: ISplashProps) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <img src="/logo.png" alt="Mektaba" height="254" width="254" />
      <Box sx={{ width: '50%' }}>
        <LinearProgress color="primary" />
      </Box>
    </div>
  );
};

export default Splash;
