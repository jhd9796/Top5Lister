import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import { React } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import AuthContext from "../auth";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const style = {
  width: 220,
  height: 50,
  color: "black",
  boxShadow: 23,
  m: 4,
  backgroundColor: "rgb(197,188,175)",
  fontSize: "16px",
};

export default function SplashScreen() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  function handleGuestLogin(event){
    auth.loginUser(
      {
        email: "guest@gmail.com",
        password: "guest1234",
      },
      store
    );
    store.setCommunityListMode(true);
  }

  return (
    <div id="splash-screen">
      Welcome to The Top 5<br />
      Lister!!!
      <EmojiEmotionsIcon
        sx={{ width: 52, height: 52 }}
        style={{ color: "yellow" }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          p: 1,
          marginRight: "3px",
          marginTop: "50px",
        }}
      >
        <Typography style={{ color: "white", fontSize: "28px" }}>
          The Top 5 Lister is an application where users can list <br />
          their five favorite things as well as see lists made by <br /> other
          users{" "}
        </Typography>
      </Box>
      <Box>
        <Stack spacing={2} direction="row" sx={{ marginTop: "180px" }}>
          <Box sx={{ flexGrow: 0.9 }}></Box>
          <Button component={Link} to="/login/" style={style}>
            Login
          </Button>
          <Button component={Link} to="/register/" style={style}>
            Create Account
          </Button>
          <Button onClick={handleGuestLogin} style={style}>Continue as Guest</Button>
        </Stack>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          p: 1,
          marginRight: "5px",
          marginTop: "70px",
        }}
      >
        <Typography
          color="white"
          style={{ fontStyle: "italic", fontSize: "16px" }}
        >
          developed by John Cho
        </Typography>
      </Box>
    </div>
  );
}
