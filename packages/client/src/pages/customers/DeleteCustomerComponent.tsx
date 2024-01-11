import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton, Typography } from '@mui/material';
import styled from '@emotion/styled';
import InfoIcon from '@mui/icons-material/Info';
import { useDeleteCustomer } from '../../hooks/customers';
import { displayToast } from '../../helper/toastHelper';

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
}))

interface IDeleteCustomerComponentProps {
  customerName: string;
  customerId: string;
}

const DeleteCustomerComponent = ({customerId, customerName} : IDeleteCustomerComponentProps) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const { mutateAsync: deleteCustomer } = useDeleteCustomer({
    onSuccess: (data) => {
      displayToast({
        type: 'success',
        message: "L'établissement a été supprimé avec succès",
        autoClose: 4000,
        
      })
      handleClose()
    },
    onError: (error) =>
      displayToast({
        type: 'error',
        message:
          error.error || error.message || error ||
          'Un problème est survenu, veuillez réessayer',
      }),
      id: customerId

  })

  const handleDeleteCustomer = async () => {
    await deleteCustomer({id:customerId})
  }


  return (
    <Fragment>
      <IconButton onClick={handleClickOpen}>
        <DeleteIcon sx={{ color: "#ef5350" }} />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ paddingX: 10, paddingY: 5, textAlign: "center" }}>
          <InfoIcon sx={{ fontSize: "3rem", color: "#f44336" }} />
          <Typography variant='h6' component="p" sx={{fontWeight:"bold"}}>Êtes-vous sur ?</Typography>
          <Typography variant='body1' component="p" sx={{ marginX: 5, marginY:2}}> Supprimer l'établissement {customerName} ?
          </Typography>

          <Grid container spacing={2} direction="column">
            <Grid xs={12} item>
              <StyledButton variant="contained" fullWidth onClick={handleDeleteCustomer} style={{ backgroundColor: '#f44336', color: "white" }} >Supprimer</StyledButton>
            </Grid>
            <Grid xs={12} item>
              <StyledButton variant="contained" fullWidth style={{ backgroundColor: "transparent", color: "black", border: "1px solid" }} onClick={handleClose} autoFocus>
                Annuler
              </StyledButton>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
export default DeleteCustomerComponent