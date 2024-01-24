import Paper from '@mui/material/Paper';
import { styled, Grid, Typography, InputLabel, FormControl } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm, FormProvider } from 'react-hook-form';
import { isValidEmail } from '../../utils/funcs';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContextType, UserRole } from '../../types/user';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


export interface ILoginProps {}

type LoginForm = {
  email: string;
  password: string;
};

const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
}));

const Login = (props: ILoginProps) => {
  const isTabletOrMobile = useMediaQuery('(max-width: 960px)');

  const { login } = useContext(AuthContext) as UserContextType;
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, ...restFormState },
    ...rest
  } = useForm<LoginForm>({ mode: 'onBlur', defaultValues: { email: '', password: '' } });

  const onSubmit = async (data: LoginForm) => {
    try {
      const user = await login(data);
      console.log(user)
      navigate("/dashboard")
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
    {
      isTabletOrMobile ? (
       <Grid   sx={{  minWidth:300, }} >
      <div style={{marginBottom: "1.5rem", display:"flex", flexDirection:"column",  justifyContent:"center", alignItems:"center"}}>
      <img src="logo.png" width="180" height="180" />
      </div>
      <FormProvider
        register={register}
        formState={{ errors, ...restFormState }}
        handleSubmit={handleSubmit}
        {...rest}
      >
        <Form onSubmit={handleSubmit(onSubmit)}        sx={{}}
>
        <FormControl fullWidth >
        <Typography variant="body1" sx={{color:"#757575"}}>Email de connexion</Typography>
          <TextField
          id="outlined-basic"
            {...register('email', {
              required: { value: true, message: "Le mail est obligatoire" },   
            })}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
            fullWidth
            required
            placeholder='exemple@gmail.com'
           
          />
        </FormControl>
        <FormControl fullWidth >
        <Typography variant="body1" sx={{color:"#757575"}}>Mot de passe</Typography>
           <PasswordInput
            color="primary"
            defaultValue=""
            fullWidth
            id="password"
            variant="outlined"
            name="password"
            error={!!errors.password}
            errorMessage={errors.password?.message}
            required
            options={{
              required: { value: true, message: 'Le mot de passe est obligatoire' },
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères',
              },
            }}
          />
        </FormControl>
         
          <Button variant="contained" style={{margin:"auto", backgroundColor:'#009A95', width:"fit-content", borderRadius:"20px"}} type="submit"  endIcon={<ArrowRightAltIcon/>}>
            Se connecter
          </Button>
          <Button variant="text" sx={{color:"black", textTransform:"none", fontSize:"16px", fontWeight:"400"}}>Mot de passe oublié </Button>
        </Form>
      </FormProvider>
    </Grid>
    )
: (
  <Paper elevation={6} sx={{ padding: '1.9rem 5rem', width: '50%', minWidth:300, maxWidth:600  }}>
      <div style={{marginBottom: "1.5rem", display:"flex", flexDirection:"column",  justifyContent:"center", alignItems:"center"}}>
      <img src="logo.png" width="150" height="150" />
      <Typography component="p" sx={{fontWeight:"bold", fontSize:"2rem"}}>Connexion</Typography>
      </div>
      <FormProvider
        register={register}
        formState={{ errors, ...restFormState }}
        handleSubmit={handleSubmit}
        {...rest}
      >
        <Form onSubmit={handleSubmit(onSubmit)} >
        <FormControl fullWidth >
        <Typography variant="body1" sx={{color:"#757575"}}>Email de connexion</Typography>
          <TextField
          id="outlined-basic"
            {...register('email', {
              required: { value: true, message: "Le mail est obligatoire" },   
            })}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
            fullWidth
            required
            placeholder='exemple@gmail.com'
           
          />
        </FormControl>
        <FormControl fullWidth >
        <Typography variant="body1" sx={{color:"#757575"}}>Mot de passe</Typography>
           <PasswordInput
            color="primary"
            defaultValue=""
            fullWidth
            id="password"
            variant="outlined"
            name="password"
            error={!!errors.password}
            errorMessage={errors.password?.message}
            required
            options={{
              required: { value: true, message: 'Le mot de passe est obligatoire' },
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères',
              },
            }}
          />
        </FormControl>
         
          <Button variant="contained" style={{margin:"auto", backgroundColor:'#009A95', width:"fit-content", borderRadius:"20px"}} type="submit"  endIcon={<ArrowRightAltIcon/>}>
            Se connecter
          </Button>
          <Button variant="text" sx={{color:"black", textTransform:"none", fontSize:"16px", fontWeight:"400"}}>Mot de passe oublié </Button>
        </Form>
      </FormProvider>
    </Paper>
)   }
    </>
    
  );
};

export default Login;
