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
import { Controller, FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { CreateCustomer, CreateCustomerMenu, CustomerMenu, CustomerTypes, ICustomer, OpeningDays } from '../../types/customer';
import { labelizeCustomerType } from '../../utils/funcs';
import uniqid from 'uniqid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { customerSchema } from '../../utils/schemas';
import { saveImage, useCreateCustomer, useCustomer, useUpdateCustomer } from '../../hooks/customers';
import { displayToast } from '../../helper/toastHelper';
import CustomerMenuComponent from './CustomerMenuComponent';
import Compressor from 'compressorjs';
import { useParams } from 'react-router-dom';



const steps = ['Info', 'Détail', 'Menu'];


interface IAddCustomerDialogProps {
  handleCloseDialog(): void
  openDialog: boolean;
  isNew: boolean;
  customerId?: string;
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

const AddCustomerDialog = ({ handleCloseDialog, openDialog, isNew, customerId }: IAddCustomerDialogProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [isOfficeHoursAccordionOpen, setIsOfficeHoursAccordionOpen] = useState<boolean>(true)
  const [customer, setCustomer] = useState<ICustomer>()
  const { data: fetchedCustomer } = useCustomer(customerId);
  const [fetchedMenu, setFetchedMenu] = useState<CustomerMenu>()

  useEffect(() => {
    setActiveStep(0)
    if (customerId && customerId !== undefined && fetchedCustomer) {
      setCustomer(fetchedCustomer)
      reset({
        name: fetchedCustomer.name ?? "",
        mail: fetchedCustomer.mail ?? "",
        phone: fetchedCustomer.phone ?? "",
        customerType: fetchedCustomer.customerType ?? CustomerTypes.butcher,
        address: fetchedCustomer.address ?? "",
        zipCode: fetchedCustomer.zipCode ?? "",
        city: fetchedCustomer.city ?? "",
        country: fetchedCustomer.country ?? "France",
        image: [],
        description: fetchedCustomer.description ?? "",
        officeHours: fetchedCustomer.officeHours ?? [
          { day: OpeningDays.Lundi, startHour: "", endHour: "" },
        ],
        menu: (fetchedCustomer.menu ?? [
          { image: undefined, name: "", price: 0, description: "" }
        ]) as CreateCustomerMenu[],
        menuPriceUnit: fetchedCustomer.menuPriceUnit ?? "€",
        createdBy: fetchedCustomer.createdBy ?? '656f23faeda3351e49d7c53c',
      })
    } else {
      reset()
    }
  }, [customerId, fetchedCustomer,])

  const { mutateAsync: createCustomer } = useCreateCustomer({
    onSuccess: (data) => {
      displayToast({
        type: 'success',
        message: "L'établissement a été entregistré avec succès",
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

  const { mutateAsync: updateCustomer } = useUpdateCustomer({
    onSuccess: () => {
        //setRequestLoding(false)
        displayToast({
            type: 'success',
            message: "L' établissement a été mis à jour avec succès",
            autoClose: 4000,
        })
        handleCloseDialog()
    },
    onError: (error) =>
        displayToast({
            type: 'error',
            message:
                error.error || error.message || error || 'Un problème est survenu, veuillez réessayer',
        }),
    id: customerId ?? '',
});

  const methods = useForm<CreateCustomer>({
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
      image: [],
      description: "",
      officeHours: [
        { day: OpeningDays.Lundi, startHour: "", endHour: "" },
      ],
      menu: [({ image: [] as File[], name: "", price: 0, description: "" }) as CreateCustomerMenu],
      menuPriceUnit: "€",
      createdBy: '656f23faeda3351e49d7c53c',
    },
    resolver: yupResolver(customerSchema),
  });
  const { handleSubmit, register, watch, reset, control } = methods;
  const selectedCustomerType = watch("customerType")

  const { fields: officeHoursFields, append: addOfficeHours, remove: removeOfficeHoursFields } = useFieldArray({
    control,
    name: 'officeHours',
  });

  const { fields: menuFields, append: addMenuFields, remove: removeMenuFields } = useFieldArray({
    control,
    name: 'menu',
  });

  const image = watch('image');
  const imagePreview = image?.length > 0 && URL.createObjectURL(image[0]);

  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview]
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

  const getMenuWithImage = async (menu: CreateCustomerMenu[]) => {
    if (menu.length > 0) {
      // Use Promise.all to wait for all asynchronous operations to complete
      await Promise.all(
        menu.map(async (item: CreateCustomerMenu) => {
          const menuImageFormData = new FormData();

          if (typeof item.image !== 'string') {
            let compressedMenuImage = await Promise.all<File>(
              [item.image[0]].map((image) => {
                return new Promise((resolve, reject) => {
                  new Compressor(image, {
                    quality: 0.6,
                    success: (result: File) => resolve(result),
                    error: (error: Error) => reject(error),
                  });
                });
              })
            );
            menuImageFormData.append('image', compressedMenuImage[0]);
            const { image } = await saveImage(menuImageFormData);
            item.image = image;
          }
        })
      );
    }

    return menu;
  };


  const onSubmit = async (data: any) => {
    handleNext();
    if (activeStep === 2) {
    
      let compressedImage: File[] = [];
      if (data.image.length > 0 && typeof data.image !== 'string') {
        compressedImage = await Promise.all<File>(
          [data.image[0]].map((image) => {
            return new Promise((resolve, reject) => {
              new Compressor(image, {
                quality: 0.6,
                success: (result: File) => resolve(result),
                error: (error: Error) => reject(error),
              });
            });
          })
        );

      }

      const imageFormData = new FormData();
      imageFormData.append('image', compressedImage[0])
      const { image } = typeof data.image === 'string' ? data.image : await saveImage(imageFormData);
      
      try {
        await getMenuWithImage(data.menu).then(async (menu) => {
          const customerData = {
            ...data,
            image: image,
            displayName: data.name,
            menu: menu,
          }
          if(!isNew && customerId) {
            console.log(customerData)
            await updateCustomer({customer:customerData, id:customerId })
          } else {
            await createCustomer({
              customer: customerData
            })
          }
        })

      }catch(e) {

      }
    }
  }

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} fullScreen={true} sx={{ width: "80%", height: "80%", margin: "auto", backgroundCOlor: "blue" }} >
      <DialogTitle> {isNew ? "Création d'un établissement" : "Mise à jour d'un établissement"

      }</DialogTitle>
      <DialogContent >
        <Stepper activeStep={activeStep} sx={{ marginBottom: 3 }} >
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            // const labelProps: {
            //   optional?: React.ReactNode;
            // } = {};
            // if (isStepOptional(index)) {
            //   labelProps.optional = (
            //     <Typography variant="caption">Optional</Typography>
            //   );
            // }
            // if (isStepSkipped(index)) {
            //   stepProps.completed = false;
            // }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel
                // {...labelProps}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <FormProvider {...methods}>


          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {activeStep === 0 &&
              <Grid container spacing={2} >
                <Grid item xs={12} >
                  <label htmlFor="image">
                    <div
                      style={
                        imagePreview || customer?.image
                          ? {
                            height: '140px',
                            width: '140px',
                            backgroundImage: `url(${imagePreview || customer?.image})`,
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
                      {!imagePreview && !customer?.image &&
                        <Typography>Logo</Typography>
                      }
                    </div>
                  </label>
                  <input
                    {...register('image')}
                    id="image"
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
                    //error={!!errors.mail}
                    placeholder="Email"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    {...register("phone")}
                    //   error={!!errors.phone}
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
                      value={selectedCustomerType || []}
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
                <Grid item xs={6} >
                  <FormControlLabel
                    control={
                      <Controller
                        name="isActive"
                        control={control}
                        render={({ field: { value, onChange, ...props } }) => (
                          <Checkbox
                            {...props}
                            checked={value}
                            onChange={(e) => onChange(e.target.checked)}
                          />
                        )}
                      />
                    }
                    label="Activer l'établissement(statut global)"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="isActiveInApp"
                        control={control}
                        render={({ field: { value, onChange, ...props } }) => (
                          <Checkbox
                            {...props}
                            checked={value}
                            onChange={(e) => onChange(e.target.checked)}
                          />
                        )}
                      />
                    }
                    label="Activer l'établissement dans l'application"
                  />
                </Grid>
              </Grid>
            }
            {
              activeStep === 1 &&
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h6' component="p" my={2}>Description de l'établissement</Typography>
                  <TextField
                    {...register("description")}
                    //error={!!errors.description}
                    id="outlined-multiline-flexible"
                    placeholder='Une simple description'
                    multiline
                    fullWidth
                    minRows={3}
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
                  <Button
                    variant="outlined"
                    onClick={() =>
                      addMenuFields({
                        image: [] as File[],
                        name: "",
                        price: 0,
                        description: ""
                      } as CreateCustomerMenu)
                    }
                  >
                    Ajouter</Button>
                </Grid>
                {menuFields &&
                  menuFields.map((field, index) => (
                    <CustomerMenuComponent key={field.id} index={index} removeMenuFields={removeMenuFields} indexProps={index} fetchedImage={field.image} />
                  ))
                }
              </Grid>
            }

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

          </form>
        </FormProvider>
      </DialogContent>

    </Dialog>

  )
}

export default AddCustomerDialog;