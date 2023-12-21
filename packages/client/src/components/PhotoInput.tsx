import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Alert from '@mui/material/Alert';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';

export interface IPhotoInputProps<T> {
  name: Path<T>;
  width?: number;
  height?: number;
}

const PhotoInput = <T extends FieldValues>({
  name,
  width = 56,
  height = 56,
}: IPhotoInputProps<T>) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<T>();
  const files = watch(name);
  const [photoUrl, setPhotoUrl] = useState<string>('');

  useEffect(
    () => () => {
      URL.revokeObjectURL(photoUrl);
    },
    [photoUrl]
  );

  useEffect(() => {
    if (files && files.length > 0) {
      setPhotoUrl(URL.createObjectURL(files[0]));
    }
  }, [files]);

  return (
    <Grid container direction="row" display="flex" justifyContent="center" gap="1rem">
      <IconButton color="primary" aria-label="ajouter une photo" component="label">
        <input hidden accept="image/*" type="file" {...register(name)} />
        <PhotoCamera fontSize="large" />
      </IconButton>
      {photoUrl && <Avatar src={photoUrl} sx={{ width, height }} alt="User avatar" />}
      {errors[name] && (
        <Alert severity="error" variant="outlined">
          {errors[name]?.message?.toString() ?? ''}
        </Alert>
      )}
    </Grid>
  );
};

export default PhotoInput;
