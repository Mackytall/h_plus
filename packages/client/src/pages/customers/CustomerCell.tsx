import { IconButton, TableCell, TableRow, Avatar, styled, Checkbox} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ICustomer } from "../../types/customer";
import { convertDateStringToFormattedDate, labelizeCustomerType, stringAvatar } from "../../utils/funcs";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import DeleteCustomerComponent from "./DeleteCustomerComponent";

const StyledTableCell = styled(TableCell)(({theme}) => ({
  textAlign: "center"
})) 
interface ICustomerCellProps {
    customer: ICustomer;
    handleEdit: () => void;
    handleRowClick: (customer: ICustomer) => void;
    isItemSelected: boolean;

}


const CustomerCell = ({ customer, handleEdit, handleRowClick,isItemSelected }: ICustomerCellProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const navigate = useNavigate()
    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            onClick={() => handleRowClick(customer)}
        >
                      <StyledTableCell >
                        <Checkbox
                        checked={isItemSelected}
                        />
                      </StyledTableCell>

            <StyledTableCell>
               <div style={{ display: "flex", alignItems: "center", gap:"15px"}}>
                <Avatar
                    sx={{borderRadius:2}}
                    src= {customer.image}
                    alt="Remy Sharp"
                    {...stringAvatar( `${customer.name}`)} 
                />
                {customer.name}
               </div>
                
            </StyledTableCell>
            <StyledTableCell >{customer.incrementalId}</StyledTableCell>
            <StyledTableCell >{labelizeCustomerType(customer.customerType)}</StyledTableCell>
            <StyledTableCell  >{customer.city}</StyledTableCell>
            <StyledTableCell >{customer.isActive ? <DoneIcon/> : <CloseIcon/>}</StyledTableCell>
            <StyledTableCell >{customer.isActiveInApp ? <DoneIcon/> : <CloseIcon/>}</StyledTableCell>
            <StyledTableCell >{convertDateStringToFormattedDate(customer.createdAt)}</StyledTableCell>
            <StyledTableCell >
             <div style={{display:"flex"}}>
             <IconButton onClick={handleEdit}>
                <EditIcon/>
              </IconButton>
             <DeleteCustomerComponent customerName={customer.name} customerId={customer._id}/>
             </div>
            </StyledTableCell>
        </TableRow>
    )
}

export default CustomerCell;