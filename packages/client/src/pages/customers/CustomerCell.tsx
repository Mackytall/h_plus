import { IconButton, TableCell, TableRow, Avatar,} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ICustomer } from "../../types/customer";
import { convertDateStringToFormattedDate, labelizeCustomerType } from "../../utils/funcs";
import DoneIcon from '@mui/icons-material/Done';

interface ICustomerCellProps {
    customer: ICustomer

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
    return {
      style: {
        backgroundColor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0].toUpperCase()}${name.split(' ')[1][0].toUpperCase()}`,
    };
  }

const CustomerCell = ({ customer }: ICustomerCellProps) => {
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
        >
            <TableCell sx={{ display: "flex", alignItems: "center", gap:"15px"}}>
                <Avatar
                    sx={{borderRadius:2}}
                    alt="Remy Sharp"
                    {...stringAvatar( `${customer.name}`)} 

                // sx={{ width: 100, height: 100 }}
                />
                {customer.name}
            </TableCell>
            <TableCell align="right">{customer.incrementalId}</TableCell>
            <TableCell align="right">{labelizeCustomerType(customer.customerType)}</TableCell>
            <TableCell align="right">{customer.city}</TableCell>
            <TableCell align="right">{customer.isActive ? <DoneIcon/> : <CloseIcon/>}</TableCell>
            <TableCell align="right">{customer.isActiveInApp ? <DoneIcon/> : <CloseIcon/>}</TableCell>
            <TableCell align="right">{convertDateStringToFormattedDate(customer.createdAt)}</TableCell>
        </TableRow>
    )
}

export default CustomerCell;