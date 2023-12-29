import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {Grid, IconButton,} from '@mui/material';
import { CustomerMenu,} from '../../types/customer';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
 import { styled } from '@mui/material/styles';
 import Button from '@mui/material/Button';
 import CloudUploadIcon from '@mui/icons-material/CloudUpload';

 
 const VisuallyHiddenInput = styled('input')({
   clip: 'rect(0 0 0 0)',
   clipPath: 'inset(50%)',
   height: 1,
   overflow: 'hidden',
   position: 'absolute',
   bottom: 0,
   left: 0,
   whiteSpace: 'nowrap',
  width: 1,
 });

export interface ICustomerMenuProps {
    index: number
    indexProps: number
    removeMenuFields: (index?: number | number[]) => void
}

const CustomerMenuComponent = ({index, removeMenuFields, indexProps}:ICustomerMenuProps) => {
    const { register, watch } = useFormContext();
    const imageName = `menu.${index}.image`;
  const image = watch(imageName);
    const imagePreview = image?.length > 0 && URL.createObjectURL(image[0]);


    useEffect(
      () => () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
      },
      [imagePreview, ]
    );
  
    return (
        <Grid item container xs={12}  >
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <label htmlFor="photo">
            <div
              style={
                imagePreview
                  ? {
                    height: '120px',
                    width: '120px',
                    backgroundImage: `url(${imagePreview})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    margin: "auto"
                  }
                  : {
                    height: '120px',
                    width: '120px',
                    backgroundColor: 'gray',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    margin: "auto"
                  }
              }
            >
              {!imagePreview &&
                <Typography>Image</Typography>
              }
               
            </div>
            <Button sx={{display:"flex", justifyContent:"center", alignItems:"flex-bottom", }} component="label" variant="contained" hidden startIcon={<CloudUploadIcon />}>
      <VisuallyHiddenInput 
      required
      type="file"  
      accept="images/*" 
      {...register(`menu.${index}.image`)}/>
    </Button>
          </label>
         
           {/* <input
          onClick={()=> console.log(index)}
            {...register(`menu.${index}.image`)}
            id="photo"
           type="file"
            accept="images/*"
            
          />  */}
        </Grid> 
        <Grid item container spacing={2} xs={7}>
          <Grid item xs={12} md={8}>
            <TextField
              {...register(`menu.${index}.name`)}
              required
              placeholder="Nom"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              {...register(`menu.${index}.price`)}
              required
              type="number"
              placeholder="Prix"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register(`menu.${index}.description`)}
              required
              placeholder="Description"
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <IconButton onClick={() => removeMenuFields(index)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
   ) }


export default CustomerMenuComponent