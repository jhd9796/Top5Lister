import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export default function AppBanner() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  // const location = useLocation();
  // console.log("location~!", location.pathname);

  let guestLogIn = false;
  if (auth.LoggedIn) {
    if (auth.user.email === "guest@gmail.com") {
      guestLogIn = true;
    }
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    if (auth.loggedIn) {
      auth.logoutUser();
    }
  };

  const handleLogout = () => {
    handleMenuClose();
    auth.logoutUser();
    store.setCommunityListMode(false);
  };

  const menuId = "primary-search-account-menu";
  const loggedOutMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link to="/login/">Login</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/register/">Create New Account</Link>
      </MenuItem>
    </Menu>
  );
  
  const loggedInMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  let menu = loggedOutMenu;
  if (auth.loggedIn){
      menu=loggedInMenu
  }

  /////////////HD
  function getAccountMenu(loggedIn) {
    let isGuest = false;
    if (loggedIn) {
      if (auth.user.email === "guest@gmail.com") {
        isGuest = true;
      }
    }
    if (isGuest && loggedIn) {
      return <AccountCircleOutlinedIcon style={{ color: "black" }} />;
    } else if (loggedIn && !isGuest) {
      return (
        <Typography variant="h5" sx={{ color: "black" }}>
          {auth.user.firstName.charAt(0).toUpperCase() +
            auth.user.lastName.charAt(0).toUpperCase()}
        </Typography>
      );
    } else {
      return <AccountCircleOutlinedIcon style={{ color: "black" }} />;
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={4}
        style={{ background: "rgb(224, 223, 224)" }}
      >
        <Toolbar style={{ minHeight: "40px" }}>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Link
              style={{ textDecoration: "none", color: "rgb(212,175,56)" }}
              to="/"
            >
              T<sup>5</sup>L
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {getAccountMenu(auth.loggedIn)}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {menu}
    </Box>
  );
}
