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


const Customers = () => {
    const [openDialog, setOpenDialog] = useState(false);

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
        <Grid container p={4} sx={{ height: "80%", }} >
      <Grid item container mb={2}>
        <Grid item >
          <SearchBar setSearchQuery={setSearchQuery} />
        </Grid>
        <Grid ml={8} sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-start", gap: "30px" }}>
          <Button variant="text" endIcon={<AddIcon />} onClick={() => handleClickOpenDialog()}>
            <Typography fontWeight="500" style={{ color: 'black' }}>
              Ajouter
            </Typography>
          </Button>
          {/* <ExportExcel excelData={users} fileName="data" /> */}
        </Grid>
      </Grid>
      <AddCustomerDialog handleCloseDialog={handleCloseDialog} openDialog={openDialog}/>

      {/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell align="right">Nom d'utilisateur</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Date de création</TableCell>
              <TableCell align="right">Date de mise à jour</TableCell>
              <TableCell align="right">Rôle</TableCell>
              <TableCell align="right">Actif</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && filterData(searchQuery, users).map((user) => (
              <UserCell key={user._id} user={user} stringAvatar={stringAvatar} />
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </Grid>
    );
}

export default Customers;