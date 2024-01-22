import Paper from '@mui/material/Paper';
import { styled, Grid } from '@mui/material';
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


export interface ILoginProps {}

type LoginForm = {
  username: string;
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
  } = useForm<LoginForm>({ mode: 'onBlur', defaultValues: { username: '', password: '' } });

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
       <Grid   sx={{  minWidth:300  }}>
      <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
      <img src="logo.png" width="200" height="200" />
      </div>
      <FormProvider
        register={register}
        formState={{ errors, ...restFormState }}
        handleSubmit={handleSubmit}
        {...rest}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('username', {
              required: { value: true, message: "Le nom d'utilisateur est obligatoire" },   
            })}
            error={!!errors.username}
            helperText={errors.username && errors.username.message}
            fullWidth
            required
            placeholder="Nom d'utilisateur"
          />
          <PasswordInput
            color="primary"
            defaultValue=""
            fullWidth
            id="password"
            placeholder="Mot de passe"
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
          <Button variant="contained" style={{backgroundColor:'#009A95'}} type="submit" fullWidth>
            Se connecter
          </Button>
          <Button variant="text">Mot de passe oublié ?</Button>
        </Form>
      </FormProvider>
    </Grid>
    )
: (
  <Paper elevation={6} sx={{ padding: '3rem 5rem', width: '50%', minWidth:300  }}>
      <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
      <img src="logo.png" width="200" height="200" />
      </div>
      <FormProvider
        register={register}
        formState={{ errors, ...restFormState }}
        handleSubmit={handleSubmit}
        {...rest}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('username', {
              required: { value: true, message: "Le nom d'utilisateur est obligatoire" },   
            })}
            error={!!errors.username}
            helperText={errors.username && errors.username.message}
            fullWidth
            required
            placeholder="Nom d'utilisateur"
          />
          <PasswordInput
            color="primary"
            defaultValue=""
            fullWidth
            id="password"
            placeholder="Mot de passe"
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
          <Button variant="contained" style={{backgroundColor:'#009A95'}} type="submit" fullWidth>
            Se connecter
          </Button>
          <Button variant="text">Mot de passe oublié ?</Button>
        </Form>
      </FormProvider>
    </Paper>
)   }
    </>
    
  );
};

export default Login;
