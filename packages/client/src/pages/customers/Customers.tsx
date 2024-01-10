import { TableRow, Grid, TableContainer, Table, TableHead, TableCell, TableBody, Paper, Typography, Avatar, Button, styled, Checkbox, TableFooter, TablePagination } from "@mui/material";
import { useUsers } from "../../hooks/users";
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useContext, useState } from "react";
import { IUser, UserContextType, UserRole } from "../../types/user";
import { useFormContext } from "react-hook-form";
import { AuthContext } from "../../contexts/AuthContext";
import { labelizeUserRole } from "../../utils/funcs";
import SearchBar from "../../components/SearchBar";
import AddCustomerDialog from "./AddCustomerDialog";
import { useCustomers } from "../../hooks/customers";
import CustomerCell from "./CustomerCell";
import { ICustomer } from "../../types/customer";
import ExcelExportExportButton from "../../components/ExcelExportButton";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: 'pre',
  fontWeight: 'bold',
  textAlign: 'center',
}));

const Customers = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isCustomerNew, setIsCustomerNew] = useState(true);
  const [customerId, setCustomerId] = useState<string>();
  const [selected, setSelected] = useState<ICustomer[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (events || []).length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
  const handleClickAddCustomer = () => {
    setCustomerId(undefined);
    setIsCustomerNew(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEdit = (id:string) => {
    setCustomerId(id);
    setIsCustomerNew(false);
    setOpenDialog(true);
  }
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectAllClick = () => {
    if (customers && selected.length !== customers.length) {
      const newSelected = customers.map((n) => n);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleRowClick = (customer: ICustomer) => {
    console.log(customer.name)
    const selectedIndex = selected.indexOf(customer);
    let newSelected: ICustomer[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, customer);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  return (
    <Grid container sx={{ height: "80%", }} >
      <Grid item container spacing={4}>
      <Grid item xs={8}>
        
        <SearchBar setSearchQuery={setSearchQuery} />
      </Grid>
      <Grid item xs={4} sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-start", gap: "30px" }}>
        <Button variant="text" endIcon={<AddIcon />} onClick={() => handleClickAddCustomer()}>
          <Typography fontWeight="500" style={{ color: 'black' }}>
            Ajouter
          </Typography>
        </Button>
        <ExcelExportExportButton excelData={selected} fileName="customers" /> 
      </Grid>
      </Grid>
      <AddCustomerDialog handleCloseDialog={handleCloseDialog} openDialog={openDialog} isNew={isCustomerNew} customerId={customerId}/>
    {
      customers && 
      <TableContainer component={Paper} sx={{marginTop:5}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <StyledTableCell  >
          <Checkbox
          indeterminate={selected.length > 0 && selected.length < customers.length}
          checked={customers.length > 0 && selected.length === customers.length}
          onClick={handleSelectAllClick}
          
        />
                    </StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell >ID</StyledTableCell>
            <StyledTableCell >Type</StyledTableCell>
            <StyledTableCell >Ville</StyledTableCell>
            <StyledTableCell >Statut global</StyledTableCell>
            <StyledTableCell >Statut application</StyledTableCell>
            <StyledTableCell >Date création</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData(searchQuery, customers).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer : ICustomer) => {
             const isItemSelected = selected.indexOf(customer) !== -1;
            // const labelId = `enhanced-table-checkbox-${customer._id}`;
            return (
            <CustomerCell key={customer._id} customer={customer} handleEdit={() => handleEdit(customer._id)} handleRowClick={handleRowClick} isItemSelected={isItemSelected} />
          )}
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
             <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} sur ${count !== -1 ? count : `plus que ${to}`}`
              }
          count={customers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          //sx={{ width: '100%' }}
        />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    }
    </Grid>
  );
}

export default Customers;