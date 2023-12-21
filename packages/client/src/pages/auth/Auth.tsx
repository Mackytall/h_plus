import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Login from './Login';
import Signup from './Signup';

export interface IAuthProps {}

const Auth = (props: IAuthProps) => {
  return (
    <Grid container spacing={2} direction="column">
      <Grid item xs={12}>
        <Typography variant="h1" component="h1" textAlign="center" fontWeight="600">
          Connectez-vous
        </Typography>
        <Signup />
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
        <Login />
      </Grid>
    </Grid>
  );
};

export default Auth;
