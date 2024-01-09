import { TextField, InputAdornment} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
    setSearchQuery: (query: string) => void;
  }

const SearchBar = ({setSearchQuery}: SearchBarProps) => {
    return (
        <form>
        <TextField
          id="search"
          type="search"
          placeholder="Rechercher un nom"
          fullWidth
          onChange={(e :any) => {
            setSearchQuery(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              <SearchIcon />
               </InputAdornment>
            ),
          }}
        />
        </form>
    );
}

export default SearchBar;