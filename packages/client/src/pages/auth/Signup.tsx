import { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import { useForm, FormProvider } from 'react-hook-form';
import { UserSignup, UserRole } from '../../types/user';
import PasswordInput from '../../components/PasswordInput';
import PhotoInput from '../../components/PhotoInput';
import Compressor from 'compressorjs';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContextType } from '../../types/user';
import { useNavigate } from 'react-router-dom';
import { displayToast } from '../../helper/toastHelper';
import { showErrorMessage } from '../../helper/errorHandler';

export interface ISignupProps {}

const Form = styled('form')(({ theme }) => ({
  paddingTop: '2rem',
}));

const Signup = (props: ISignupProps) => {
  const { signup } = useContext(AuthContext) as UserContextType;
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, ...stateRest },
    ...rest
  } = useForm<UserSignup>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      photo: [],
      confirmPassword: '',
    },
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const onSubmit = async (data: UserSignup) => {
    setIsLoading(true);
    try {
      let compressedFiles: File[] = [];
      if (data.photo.length > 0) {
        compressedFiles = await Promise.all<File>(
          [data.photo[0]].map((photo) => {
            return new Promise((resolve, reject) => {
              new Compressor(photo, {
                quality: 0.6,
                success: (result: File) => {
                  resolve(result);
                },
                error: (error: Error) => reject(error),
              });
            });
          })
        );
      }
      const newData: UserSignup = {
        ...data,
        photo: compressedFiles as string & File[],
      };
      const form = new FormData();
      for (const key in newData) {
        if (key === 'photo' && compressedFiles.length > 0) {
          form.append(key, newData[key][0], compressedFiles[0].name.toLowerCase());
        } else {
          if (Array.isArray(newData[key])) {
            form.append(key, JSON.stringify(newData[key]));
          } else {
            form.append(key, newData[key]);
          }
        }
      }

      const user = await signup(form);
      displayToast({ type: 'success', message: 'Connexion réussie', autoClose: 4000 });
      switch (user.role) {
        case UserRole.admin:
          navigate('/admin');
          break;
        case UserRole.user:
          navigate('/dashboard');
          break;
        default:
          throw new Error(
            'Oups ! Une erreur est survenue. Votre utilisateur ne contient pas de rôle, veuillez réessayer. Si le problème persiste veuillez prendre contact avec nous.'
          );
      }
    } catch (error) {
      showErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Typography variant="body1" component="p" textAlign="center">
        Pas de compte ?{' '}
        <Typography
          variant="body1"
          sx={{ color: theme.palette.primary.main, textDecoration: 'underline', cursor: 'pointer' }}
          component="span"
          onClick={handleClickOpen}
        >
          Créez-en un ici !
        </Typography>
      </Typography>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="signup-dialog"
        fullWidth
      >
        <DialogTitle id="signup-dialog">Créez votre compte</DialogTitle>
        <DialogContent>
          <FormProvider
            register={register}
            formState={{ errors, ...stateRest }}
            handleSubmit={handleSubmit}
            {...rest}
          >
            <Form onSubmit={handleSubmit(onSubmit)} id="signup-form">
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                  <TextField
                    {...register('firstName')}
                    error={!!errors.firstName}
                    helperText={errors.firstName && errors.firstName.message}
                    type="text"
                    required
                    fullWidth
                    label="Prénom"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register('lastName')}
                    error={!!errors.lastName}
                    helperText={errors.lastName && errors.lastName.message}
                    type="text"
                    required
                    fullWidth
                    label="Nom"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email && errors.email.message}
                    type="email"
                    required
                    fullWidth
                    label="Email"
                  />
                </Grid>
                <Grid item xs={12}>
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <PasswordInput
                    color="primary"
                    defaultValue=""
                    fullWidth
                    id="confirmPassword"
                    label="Confirmez votre mot de passe"
                    variant="outlined"
                    name="confirmPassword"
                    error={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword?.message}
                    required
                  />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center" flexDirection="column">
                  <Typography fontWeight={600}>Photo:</Typography>
                  <PhotoInput<UserSignup> name="photo" />
                </Grid>
              </Grid>
            </Form>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <LoadingButton
            loading={isLoading}
            type="submit"
            form="signup-form"
            variant="contained"
            color="primary"
          >
            Créer mon compte
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Signup;
