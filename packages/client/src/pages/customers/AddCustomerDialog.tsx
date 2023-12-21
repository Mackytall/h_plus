import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, Grid, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { CustomerTypes, OpeningDays } from '../../types/customer';
import { labelizeCustomerType } from '../../utils/funcs';
import uniqid from 'uniqid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';


const steps = ['Info', 'Détail', 'Menu'];


interface IAddCustomerDialogProps {
  handleCloseDialog(): void
  openDialog: boolean;
}

interface IOfficeHoursFields {
  day: string;
  startHour: string;
  endHour: string;
}

interface IMenuFields {
  image: string;
  name: string;
  price: number;
  description: string;
}

const AddCustomerDialog = ({ handleCloseDialog, openDialog }: IAddCustomerDialogProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [officeHoursFields, setOfficeHoursFields] = useState<IOfficeHoursFields[]>([{ day: "", startHour: "", endHour: "" }])
  const [menuFields, setMenuFields] = useState<IMenuFields[]>([{ image: "", name: "", price: 0, description: "" }])

  const addOfficeHoursFields = () => {
    let newOfficeHoursFields = { day: '', startHour: "", endHour: "" }
    setOfficeHoursFields([...officeHoursFields, newOfficeHoursFields])
  }

  const removeOfficeHoursFields = (index: number) => {
    let data = [...officeHoursFields]
    data.splice(index, 1)
    setOfficeHoursFields(data)
  }

  const addMenuFields = () => {
    let newMenuFields = { image: "", name: "", price: 0, description: "" }
    setMenuFields([...menuFields, newMenuFields])
  }

  const removeMenuFields = (index: number) => {
    let data = [...menuFields]
    data.splice(index, 1)
    setMenuFields(data)
  }

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const {
    handleSubmit,
    register,
    formState: { errors, ...restState },
    watch,
    reset,
    control,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: "",
      mail: "",
      phone: "",
      customerType: CustomerTypes.butcher,
      address: "",
      zipCode: "",
      city: "",
      country: "France",
      photo: []
    },
  });
  const photo = watch('photo');
  const photoPreview = photo?.length > 0 && URL.createObjectURL(photo[0]);

  useEffect(
    () => () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoPreview]
  );

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} fullScreen={true} sx={{ width: "80%", height: "50%", margin: "auto" }} >
      <DialogTitle>Nouveau</DialogTitle>
      <DialogContent >
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
          
        <Grid pt={2} sx={{ height: "85%", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
          <Grid item>
            <form onSubmit={handleSubmit(onSubmit)}>
              {activeStep === 0 &&
                <Grid container spacing={2} >
                  <Grid item xs={12} >
                    <label htmlFor="photo">
                      <div
                        style={
                          photoPreview
                            ? {
                              height: '140px',
                              width: '140px',
                              backgroundImage: `url(${photoPreview})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              borderRadius: '12px',
                              margin: "auto"
                            }
                            : {
                              height: '140px',
                              width: '140px',
                              backgroundColor: 'gray',
                              borderRadius: '12px',
                              textAlign: 'center',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              color: 'white',
                              margin: "auto"
                            }
                        }
                      >
                        {!photoPreview &&
                          <Typography>Logo</Typography>
                        }
                      </div>
                    </label>
                    <input
                      {...register('photo')}
                      id="photo"
                      type="file"
                      accept="images/*"
                      hidden
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      {...register("name")}
                      required
                      placeholder="Nom"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      {...register("mail")}
                      required
                      placeholder="Email"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      {...register("phone")}
                      required
                      placeholder="Téléphone"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="customerType-label">Type</InputLabel>
                      <Select
                        labelId="cutomerType-label"
                        id="status"
                        {...register('customerType')}
                        // value={selectedStatus || []}
                        label="Type"
                      >
                        {Object.values(CustomerTypes).map((type) => (
                          <MenuItem key={uniqid()} value={type}>
                            {labelizeCustomerType(type)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      {...register("address")}
                      required
                      placeholder="Adresse"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      {...register("zipCode")}
                      required
                      placeholder="Code Postal"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      {...register("city")}
                      required
                      placeholder="Ville"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      {...register("country")}
                      required
                      placeholder="Pays"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>


                </Grid>
              }
              {
                activeStep === 1 &&
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Desciption..."
                      multiline
                      fullWidth
                      maxRows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Horraires d'ouvertures</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Button variant="outlined" disabled={officeHoursFields.length === 7} onClick={addOfficeHoursFields}>Ajouter</Button>
                        <Grid mt={2} container >
                          <Grid item xs={4}>
                            <Typography>Jour</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography>Ouverture</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography>Fermeture</Typography>
                          </Grid>
                        </Grid>
                        {
                          officeHoursFields.map((officeHour, index) => (
                            <Grid mt={2} container spacing={2} columns={13}>
                              <Grid item xs={4}>
                                <FormControl fullWidth>
                                  <Select
                                    labelId="officeHoursDay-label"
                                    id="officeHoursDay"
                                  //{...register('customerType')}
                                  // value={selectedStatus || []}
                                  >
                                    {Object.values(OpeningDays).map((openingDay) => (
                                      <MenuItem key={uniqid()} value={openingDay}>
                                        {openingDay}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  //    {...register("country")}
                                  required
                                  placeholder="8h30"
                                  variant="outlined"

                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  //    {...register("country")}
                                  required
                                  placeholder="18h00"
                                  variant="outlined"

                                />
                              </Grid>
                              <Grid item xs={1}   >
                                <IconButton onClick={() => removeOfficeHoursFields(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))
                        }
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </Grid>
              }
              {
                activeStep === 2 &&
                <Grid container spacing={2}>
                  <Grid xs={12} item sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant='h4'>Menu</Typography>
                    <Button variant="outlined" onClick={addMenuFields}>Ajouter</Button>
                  </Grid>
                  {
                    menuFields.map((menu, index) => (
                      <Grid item container xs={12}>
                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <label htmlFor="photo">
                            <div
                              style={
                                photoPreview
                                  ? {
                                    height: '120px',
                                    width: '120px',
                                    backgroundImage: `url(${photoPreview})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    borderRadius: '12px',
                                    margin: "auto"
                                  }
                                  : {
                                    height: '120px',
                                    width: '120px',
                                    backgroundColor: 'gray',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    margin: "auto"
                                  }
                              }
                            >
                              {!photoPreview &&
                                <Typography>Image</Typography>
                              }
                            </div>
                          </label>
                          <input
                            {...register('photo')}
                            id="photo"
                            type="file"
                            accept="images/*"
                            hidden
                          />
                        </Grid>
                        <Grid item container spacing={2} xs={7}>
                          <Grid item xs={12} md={8}>
                            <TextField
                              //  {...register("name")}
                              required
                              placeholder="Nom"
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              //  {...register("name")}
                              required
                              type="number"
                              placeholder="Prix"
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              //  {...register("name")}
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
                    ))
                  }
                </Grid>
              }
            </form>
          </Grid>

          {activeStep === steps.length ? (
            <Grid item>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </Grid>
          ) : (
            <Grid item>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Retour
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Sauter
                  </Button>
                )}
                {activeStep === steps.length - 1 ?
                  <Button type="submit">
                    Terminer
                  </Button> :
                  <Button onClick={handleNext}>
                    Suivant
                  </Button>
                }
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCloseDialog}>Subscribe</Button>
      </DialogActions> */}
    </Dialog>

  )
}

export default AddCustomerDialog;