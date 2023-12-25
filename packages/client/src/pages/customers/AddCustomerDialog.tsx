import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { yupResolver } from '@hookform/resolvers/yup';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useFieldArray, useForm } from 'react-hook-form';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, Grid, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { CreateCustomer, CreateCustomerMenu, CustomerMenu, CustomerTypes, OpeningDays } from '../../types/customer';
import { labelizeCustomerType } from '../../utils/funcs';
import uniqid from 'uniqid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { customerSchema } from '../../utils/schemas';
import { useCreateCustomer } from '../../hooks/customers';
import { displayToast } from '../../helper/toastHelper';


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
  const [isOfficeHoursAccordionOpen, setIsOfficeHoursAccordionOpen] = useState<boolean>(true)

  const { mutateAsync: createCustomer } = useCreateCustomer({
    onSuccess: (data) => {
      displayToast({
        type: 'success',
        message: 'Le frigo a été entregistré avec succès',
        autoClose: 4000,
      })
      handleCloseDialog()
    },
    onError: (error) =>
      displayToast({
        type: 'error',
        message:
          error.error || error.message || error ||
          'Un problème est survenu, veuillez réessayer',
      }),

  })

  const {
    handleSubmit,
    register,
    formState: { errors, ...restState },
    watch,
    reset,
    control,
  } = useForm<CreateCustomer>({
    mode: 'onBlur',
    // control:control,
    defaultValues: {
      name: "",
      mail: "",
      phone: "",
      customerType: CustomerTypes.butcher,
      address: "",
      zipCode: "",
      city: "",
      country: "France",
      photo: [],
      description: "",
      officeHours: [
        { day: OpeningDays.Lundi, startHour: "", endHour: "" },
      ],
      menu: [{ image: "", name: "", price: 0, description: "" }],
      menuPriceUnit:"€",
      createdBy: '656f23faeda3351e49d7c53c',

    },
    resolver: yupResolver(customerSchema),
  });

  const { fields: officeHoursFields, append: addOfficeHours, remove: removeOfficeHoursFields } = useFieldArray({
    control,
    name: 'officeHours',
  });

  const { fields: menuFields, append: addMenuFields, remove: removeMenuFields } = useFieldArray({
    control,
    name: 'menu',
  });

  const photo = watch('photo');
  const photoPreview = photo?.length > 0 && URL.createObjectURL(photo[0]);

  useEffect(
    () => () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoPreview]
  );


  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
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

  const onSubmit = async (data: any) => {
    handleNext();
    if (activeStep === 2) {
      console.log(data)
      const {photo, ...newData} = data
      const customer = {
        ...newData,
        displayName: newData.name,
        isActiveInApp: true
      }
      await createCustomer({customer})
    }
  }

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} fullScreen={true} sx={{ width: "80%", height: "80%", margin: "auto", backgroundCOlor: "blue" }} >
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
                  //error={!!errors.name}
                  placeholder="Nom"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("mail")}
                  required
                  error={!!errors.mail}
                  placeholder="Email"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("phone")}
                  required
                  error={!!errors.phone}
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
                    required
                    // error={!!errors.customerType}
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
                  // error={!!errors.address}
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
                  //  error={!!errors.zipCode}
                  placeholder="Code Postal"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("city")}
                  required
                  // error={!!errors.city}
                  placeholder="Ville"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("country")}
                  required
                  //  error={!!errors.country}
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
                  {...register("description")}
                  //error={!!errors.description}
                  id="outlined-multiline-flexible"
                  label="Desciption..."
                  multiline
                  fullWidth
                  maxRows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <Accordion expanded={isOfficeHoursAccordionOpen}>
                  <AccordionSummary
                    onClick={() => setIsOfficeHoursAccordionOpen((prevState) => {
                      console.log(prevState)
                      return !prevState
                    })}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Horraires d'ouvertures</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Button variant="outlined" disabled={officeHoursFields.length === 7} onClick={() => addOfficeHours({ day: OpeningDays.Lundi, startHour: "", endHour: "" })}>Ajouter</Button>
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
                      officeHoursFields.map((field, index) => {
                        const selectedDay = watch(`officeHours.${index}.day`);

                        return <Grid mt={2} container spacing={2} columns={13} key={field.id}>
                          <Grid item xs={4}>
                            <FormControl fullWidth>
                              <Select
                                {...register(`officeHours.${index}.day`)}
                                required
                                labelId="officeHoursDay-label"
                                id="officeHoursDay"
                                value={selectedDay || []}
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
                              {...register(`officeHours.${index}.startHour`)}
                              required
                              placeholder="8h30"
                              variant="outlined"

                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              {...register(`officeHours.${index}.endHour`)}
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
                      })
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
                <Button variant="outlined" onClick={() => addMenuFields({ image: "", name: "", price: 0, description: "" })}>Ajouter</Button>
              </Grid>
              {
                menuFields.map((field, index) => {
                  const photo = watch('photo');
                  const photoPreview = photo?.length > 0 && URL.createObjectURL(photo[0]);
                
                 
                  return  <Grid item container xs={12} key={field.id}>
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
                        {...register(`menu.${index}.image`)}
                        id="photo"
                        type="file"
                        accept="images/*"
                        hidden
                      />
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
                })
              }
            </Grid>
          }

          {activeStep === steps.length ? (
            <Grid item>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </Grid>
          ) : (
            <Grid item sx={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
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
                  <Button type='submit'>
                    Suivant
                  </Button>
                }
              </Box>
            </Grid>
          )}
        </form>
      </DialogContent>

    </Dialog>

  )
}

export default AddCustomerDialog;