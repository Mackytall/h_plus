import { useState } from 'react';
import { useTheme } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormContext, RegisterOptions } from 'react-hook-form';

export interface IPasswordInputProps {
  label: string;
  color: 'error' | 'info' | 'primary' | 'secondary' | 'success' | 'warning' | undefined;
  id: string;
  error: boolean;
  errorMessage: string | undefined;
  defaultValue: string;
  fullWidth: boolean;
  name: string;
  variant: 'standard' | 'filled' | 'outlined' | undefined;
  required?: boolean;
  options?: RegisterOptions;
}

const PasswordInput = ({
  label,
  color,
  id,
  error,
  errorMessage,
  defaultValue,
  fullWidth,
  name,
  options,
  variant,
  required,
}: IPasswordInputProps) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useFormContext();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      variant={variant ?? 'standard'}
      color={color}
      required={required}
    >
      <InputLabel htmlFor={id} color={error ? 'error' : color}>
        {label}
      </InputLabel>
      <OutlinedInput
        autoComplete="off"
        id={id}
        label={label}
        type={showPassword ? 'text' : 'password'}
        {...register(name, options)}
        error={error}
        defaultValue={defaultValue}
        aria-describedby={`${id}-helper-text`}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="afficher le mot de passe"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      {error && (
        <FormHelperText
          sx={{ color: theme.palette.error.main }}
          variant="standard"
          id={`${id}-helper-text`}
        >
          {errorMessage}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PasswordInput;
