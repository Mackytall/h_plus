import { Grid } from "@mui/material"
import AddCustomerDialog from "./AddCustomerDialog"
import { useState } from "react";

const EditCustomer = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [isCustomerNew, setIsCustomerNew] = useState(true);
    const handleAddCustomer = () => {
        setOpenDialog(false);
      };
    
    return (
        <AddCustomerDialog handleCloseDialog={handleAddCustomer} openDialog={true} isNew={isCustomerNew}/>
    )
}

export default EditCustomer