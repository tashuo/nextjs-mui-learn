import { InputBase, alpha, styled } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

interface Props {
    placeholder?: string;
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('lg')]: {
        width: '40ch',
        '&:focus': {
          width: '80ch',
        },
      },
      [theme.breakpoints.up('md')]: {
        width: '20ch',
        '&:focus': {
          width: '50ch',
        },
      },
      [theme.breakpoints.up('sm')]: {
          width: '20ch',
          '&:focus': {
            width: '50ch',
          },
        },
    },
  }));

  export default function SearchBar(props: Props) {
    const placeholder = props.placeholder ? props.placeholder : 'Search…';
    return (
        <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={placeholder}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
    )
  }