import { IconButton, TableCell, TableRow, Avatar, styled, Checkbox} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ICustomer } from "../../types/customer";
import { convertDateStringToFormattedDate, labelizeCustomerType } from "../../utils/funcs";
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
function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    return color;
  }
  function stringAvatar(name: string) {
    const words = name.split(' ');
  
    return {
      style: {
        backgroundColor: stringToColor(name),
      },
      children: words.length > 1
        ? `${words[0][0].toUpperCase()}${words[1][0].toUpperCase()}`
        : `${name[0].toUpperCase()}`,
    };
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

            <StyledTableCell sx={{ display: "flex", alignItems: "center", gap:"15px"}}>
                <Avatar
                    sx={{borderRadius:2}}
                    src= {customer.image}
                    alt="Remy Sharp"
                    {...stringAvatar( `${customer.name}`)} 

                // sx={{ width: 100, height: 100 }}
                />
                {customer.name}
            </StyledTableCell>
            <StyledTableCell >{customer.incrementalId}</StyledTableCell>
            <StyledTableCell >{labelizeCustomerType(customer.customerType)}</StyledTableCell>
            <StyledTableCell  >{customer.city}</StyledTableCell>
            <StyledTableCell >{customer.isActive ? <DoneIcon/> : <CloseIcon/>}</StyledTableCell>
            <StyledTableCell >{customer.isActiveInApp ? <DoneIcon/> : <CloseIcon/>}</StyledTableCell>
            <StyledTableCell >{convertDateStringToFormattedDate(customer.createdAt)}</StyledTableCell>
            <StyledTableCell >
              <IconButton onClick={handleEdit}>
                <EditIcon/>
              </IconButton>
             <DeleteCustomerComponent customerName={customer.name} customerId={customer._id}/>
            </StyledTableCell>
        </TableRow>
    )
}

export default CustomerCell;