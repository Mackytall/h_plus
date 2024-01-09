import { TableRow, Grid, TableContainer, Table, TableHead, TableCell, TableBody, Paper, Typography, Avatar, Button } from "@mui/material";
import { useUsers } from "../../hooks/users";
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { IUser, UserContextType, UserRole } from "../../types/user";
import { useFormContext } from "react-hook-form";
import { AuthContext } from "../../contexts/AuthContext";
import { labelizeUserRole } from "../../utils/funcs";
import SearchBar from "../../components/SearchBar";
import AddCustomerDialog from "./AddCustomerDialog";
import { useCustomers } from "../../hooks/customers";
import CustomerCell from "./CustomerCell";
import { ICustomer } from "../../types/customer";


const Customers = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const filterData = (query: string, data: ICustomer[]) => {
    if (!query) {
      return data;
    } else {
      const lowerCaseQuery = query.toLocaleLowerCase();
      return data.filter(
        (d) =>
          d.name.toLocaleLowerCase().includes(lowerCaseQuery)
      );
    }
  };

  const {data: customers} = useCustomers();
  console.log(customers)
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
    console.log("clicked")
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Grid container sx={{ height: "80%", }} >
      <Grid item container spacing={4}>
      <Grid item xs={8}>
        
        <SearchBar setSearchQuery={setSearchQuery} />
      </Grid>
      <Grid item xs={4} sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-start", gap: "30px" }}>
        <Button variant="text" endIcon={<AddIcon />} onClick={() => handleClickOpenDialog()}>
          <Typography fontWeight="500" style={{ color: 'black' }}>
            Ajouter
          </Typography>
        </Button>
        {/* <ExportExcel excelData={users} fileName="data" /> */}
      </Grid>
      </Grid>
      <AddCustomerDialog handleCloseDialog={handleCloseDialog} openDialog={openDialog} />
      <TableContainer component={Paper} sx={{marginTop:5}}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">ID</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Ville</TableCell>
              <TableCell align="right">Statut global</TableCell>
              <TableCell align="right">Statut application</TableCell>
              <TableCell align="right">Date création</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers && filterData(searchQuery, customers).map((customer : ICustomer) => (
              <CustomerCell key={customer._id} customer={customer} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default Customers;