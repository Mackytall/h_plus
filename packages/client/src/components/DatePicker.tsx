import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useFormContext, RegisterOptions, Controller } from 'react-hook-form';
import fr from 'date-fns/esm/locale/fr/index';

export interface IDatePickerProps {
  label: string;
  error: boolean;
  errorMessage: string | undefined;
  defaultValue?: Date;
  fullWidth: boolean;
  name: string;
  options?: RegisterOptions;
  variant: 'standard' | 'filled' | 'outlined' | undefined;
  maxDate?: Date;
  minDate?: Date;
}

const DatePicker = ({
  label,
  errorMessage,
  error,
  defaultValue,
  fullWidth,
  name,
  variant,
  options,
  maxDate,
  minDate,
}: IDatePickerProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onBlur, onChange, value, ref } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <DesktopDatePicker
            label={label}
            value={value}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  variant={variant}
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

export default DatePicker;
