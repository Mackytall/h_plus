import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers';
import { useFormContext, RegisterOptions, Controller } from 'react-hook-form';
import fr from 'date-fns/esm/locale/fr/index';

export interface ICustomTimePickerProps {
  label: string;
  error: boolean;
  errorMessage: string | undefined;
  defaultValue?: Date;
  fullWidth: boolean;
  name: string;
  options?: RegisterOptions;
  variant: 'standard' | 'filled' | 'outlined' | undefined;
}

const CustomTimepicker = ({
  label,
  error,
  errorMessage,
  defaultValue,
  fullWidth,
  name,
  variant,
  options,
}: ICustomTimePickerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, onChange, value, ref } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <TimePicker
            label={label}
            value={value}
            onChange={onChange}
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  variant={variant}
                  onBlur={onBlur}
                  fullWidth={fullWidth}
                  error={params.error || error}
                  helperText={
                    params.error
                      ? params.helperText ?? errorMessage ?? ''
                      : error
                      ? errorMessage
                      : ''
                  }
                />
              ),
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default CustomTimepicker;
