import Paper from '@mui/material/Paper';
import { styled } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm, FormProvider } from 'react-hook-form';
import { isValidEmail } from '../../utils/funcs';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContextType, UserRole } from '../../types/user';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput';

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
      switch (user.role) {
        case UserRole.admin:
          navigate('/admin');
          break;
        case UserRole.user:
          navigate('/dashboard');
          break;
        default:
          throw new Error(
            'Oups ! Une erreur est survenue. Votre utilisateur ne contient pas de rôle, réessayer de vous connecter. Si le problème persiste veuillez prendre contact avec nous.'
          );
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Paper elevation={6} sx={{ padding: '3rem 2rem', width: '50%', borderRadius: '30px' }}>
      <FormProvider
        register={register}
        formState={{ errors, ...restFormState }}
        handleSubmit={handleSubmit}
        {...rest}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('email', {
              required: { value: true, message: "L'email est obligatoire" },
              validate: (value: string) =>
                isValidEmail(value) ? true : "L'email n'est pas valide",
            })}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
            fullWidth
            required
            type="email"
            label="Email"
          />
          <PasswordInput
            color="primary"
            defaultValue=""
            fullWidth
            id="password"
            label="Mot de passe"
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
          <Button type="submit" sx={{ alignSelf: 'end' }}>
            Se connecter
          </Button>
        </Form>
      </FormProvider>
    </Paper>
  );
};

export default Login;
