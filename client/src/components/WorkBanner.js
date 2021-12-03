import { useContext, useState } from "react";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FunctionsOutlinedIcon from "@mui/icons-material/FunctionsOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import SortIcon from "@mui/icons-material/Sort";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Divider from '@mui/material/Divider';

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "white",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "50ch",
    },
  },
}));

export default function WorkBanner() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        style={{ background: "rgb(196, 196, 196)" }}
        sx={{marginTop:1}}
      >
        <Toolbar>
          <IconButton aria-label="home button" size="large">
            <HomeOutlinedIcon sx={{ width: 40, height: 40, color: "black" }} />
          </IconButton>
          <IconButton aria-label="all lists button" size="large">
            <PeopleOutlineOutlinedIcon
              sx={{ width: 40, height: 40, color: "black" }}
            />
          </IconButton>
          <IconButton aria-label="users button" size="large">
            <PersonOutlineOutlinedIcon
              sx={{ width: 40, height: 40, color: "black" }}
            />
          </IconButton>
          <IconButton aria-label="community list button" size="large">
            <FunctionsOutlinedIcon
              sx={{ width: 40, height: 40, color: "black" }}
            />
          </IconButton>
          <Search>
            <SearchIconWrapper>
              <SearchIcon style={{ color: "grey" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              style={{ color: "grey" }}
              onChange={(e)=>{console.log(e.target.value)}}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="h6" color="black" mt={1}>
            SORT BY
          </Typography>
          <IconButton aria-label="Sort By" size="large" onClick={handleClick}>
            <SortIcon sx={{ width: 40, height: 40, color: "black" }} />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>Publish Date(Newest)</MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>Publish Date(Oldest)</MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>Views</MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>Likes</MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>Dislikes</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
