import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Login from './Login';
import Signup from './Signup';

export interface IAuthProps {}

const Auth = (props: IAuthProps) => {
  return ( 
    <Grid container spacing={2} display="flex" justifyContent="center" alignItems="center" sx={{height:"80vh"}}>
      <Grid item xs={12}  display="flex" direction="column" alignItems="center">
     {/* <Signup /> */}
      <Login />
      </Grid>
    </Grid>
  );
};

export default Auth;
 