import { useContext, useState } from "react";
import AuthContext from "../auth";
import { GlobalStoreContext, GlobalFilterListMode } from "../store";
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
import Divider from "@mui/material/Divider";

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

const guestHomeButtonStyle = {
  opacity: "0.25",
};

const userHomeButtonStyle = {};
const HOME_MODE = 0;

export default function WorkBanner(props) {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { createView } = props;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchText = (event) => {
    console.log("event.target.value ====" + event.target.value);
    store.setSearchWord(event.target.value);
  };

  const handleHomeButton = (event) => {
    store.setFilterMode(GlobalFilterListMode.INCLUDE_MODE);
    store.setCommunityListMode(false);
    console.log(auth.user.email);
    console.log(auth.user.email === "guest@gmail.com");
  };

  const handleAllListButton = (event) => {
    store.setFilterMode(GlobalFilterListMode.EXACT_MODE);
    store.setCommunityListMode(true);
  };

  const handleUsersButton = (event) => {
    store.setFilterMode(GlobalFilterListMode.USER_EXACT_MODE);
    store.setCommunityListMode(true);
  };

  const handleCommunityListButton = (event) => {
    store.setFilterMode(GlobalFilterListMode.INCLUDE_MODE);
    store.setCommunityListMode(true);
  };

  const handlePublishAsc = function () {
    console.log("[WorkBanner:handlePublishAsc]");
    store.setFilterMode(GlobalFilterListMode.PUBLISHED_ASC_MODE);
    store.setCommunityListMode(store.getCommunityListMode());
  };

  const handlePublishDes = function () {
    console.log("[WorkBanner:handlePublishAsc]");
    store.setFilterMode(GlobalFilterListMode.PUBLISHED_DES_MODE);
    store.setCommunityListMode(store.getCommunityListMode());
  };

  const handleViewsAsc = function () {
    console.log("[WorkBanner:handlePublishAsc]");
    store.setFilterMode(GlobalFilterListMode.VIEWS_ASC_MODE);
    store.setCommunityListMode(store.getCommunityListMode());
  };

  const handleLikesAsc = function () {
    console.log("[WorkBanner:handlePublishAsc]");
    store.setFilterMode(GlobalFilterListMode.LIKES_ASC_MODE);
    store.setCommunityListMode(store.getCommunityListMode());
  };

  const handleDislikesAsc = function () {
    console.log("[WorkBanner:handlePublishAsc]");
    store.setFilterMode(GlobalFilterListMode.DISLIKES_ASC_MODE);
    store.setCommunityListMode(store.getCommunityListMode());
  };

  const getSearchText = (event) => {
    return event.target.value;
  };

  let HomeButtonDisabled = false;
  if (auth.user.email === "guest@gmail.com") {
    HomeButtonDisabled = true;
  }

  if (createView) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          elevation={0}
          style={{ background: "rgb(196, 196, 196)" }}
          sx={{ marginTop: 1 }}
        >
          <Toolbar>
            <IconButton aria-label="home button" size="large" disabled>
              <HomeOutlinedIcon
                sx={{ width: 40, height: 40, color: "black", opacity: "0.25" }}
              />
            </IconButton>
            <IconButton aria-label="all lists button" size="large" disabled>
              <PeopleOutlineOutlinedIcon
                sx={{ width: 40, height: 40, color: "black", opacity: "0.25" }}
              />
            </IconButton>
            <IconButton aria-label="users button" size="large" disabled>
              <PersonOutlineOutlinedIcon
                sx={{ width: 40, height: 40, color: "black", opacity: "0.25" }}
              />
            </IconButton>
            <IconButton
              aria-label="community list button"
              size="large"
              disabled
            >
              <FunctionsOutlinedIcon
                sx={{ width: 40, height: 40, color: "black", opacity: "0.25" }}
              />
            </IconButton>
            <Search style={{ backgroundColor: "rgb(220, 217, 217, 1)" }}>
              <SearchIconWrapper>
                <SearchIcon style={{ color: "rgb(186, 185, 185)" }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
                style={{ color: "rgb(186, 185, 185)" }}
                disabled
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Typography
              variant="h6"
              color="black"
              mt={1}
              sx={{ opacity: "0.25" }}
            >
              SORT BY
            </Typography>
            <IconButton
              aria-label="Sort By"
              size="large"
              onClick={handleClick}
              disabled
            >
              <SortIcon
                sx={{ width: 40, height: 40, color: "black", opacity: "0.25" }}
              />
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
              <MenuItem onClick={handlePublishAsc}>
                Publish Date(Newest)
              </MenuItem>
              <Divider />
              <MenuItem onClick={handlePublishDes}>
                Publish Date(Oldest)
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleViewsAsc}>Views</MenuItem>
              <Divider />
              <MenuItem onClick={handleLikesAsc}>Likes</MenuItem>
              <Divider />
              <MenuItem onClick={handleDislikesAsc}>Dislikes</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>
    );
  } else {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          elevation={0}
          style={{ background: "rgb(196, 196, 196)" }}
          sx={{ marginTop: 1 }}
        >
          <Toolbar>
            <IconButton
              aria-label="home button"
              size="large"
              onClick={handleHomeButton}
              disabled={HomeButtonDisabled}
            >
              <HomeOutlinedIcon
                sx={{ width: 40, height: 40, color: "black" }}
                style={
                  HomeButtonDisabled
                    ? guestHomeButtonStyle
                    : userHomeButtonStyle
                }
              />
            </IconButton>
            <IconButton
              aria-label="all lists button"
              size="large"
              onClick={handleAllListButton}
            >
              <PeopleOutlineOutlinedIcon
                sx={{ width: 40, height: 40, color: "black" }}
              />
            </IconButton>
            <IconButton
              aria-label="users button"
              size="large"
              onClick={handleUsersButton}
            >
              <PersonOutlineOutlinedIcon
                sx={{ width: 40, height: 40, color: "black" }}
              />
            </IconButton>
            <IconButton
              aria-label="community list button"
              size="large"
              onClick={handleCommunityListButton}
            >
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
                onChange={handleSearchText}
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
              <MenuItem onClick={handlePublishAsc}>
                Publish Date(Newest)
              </MenuItem>
              <Divider />
              <MenuItem onClick={handlePublishDes}>
                Publish Date(Oldest)
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleViewsAsc}>Views</MenuItem>
              <Divider />
              <MenuItem onClick={handleLikesAsc}>Likes</MenuItem>
              <Divider />
              <MenuItem onClick={handleDislikesAsc}>Dislikes</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}
