import { useContext, useState, useEffect } from "react";
import { React } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Fab, Icon, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Link } from 'react-router-dom'
import AuthContext from "../auth";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';


export default function SplashScreen() {
  const { auth } = useContext(AuthContext);

  return (
    <div id="splash-screen">
      Welcome to The Top 5<br />
      Lister!!!
      <EmojiEmotionsIcon sx={{width:52, height:52}} style={{color:"yellow"}}/>
      <Box sx={{my:10, mx:1}}>
        <Typography variant="h4" mx={30} style={{color:"white"}}>
          The Top 5 Lister is an application where users can list their five
          favorite things as well as see lists made by other users{" "}
        </Typography>
      </Box>
      <Box sx={{}}>
        <Stack spacing={2} direction="row">
          <Button variant="contained"><Link to='/login/'>Login</Link></Button>
          <Button variant="contained"><Link to='/register/'>Create Account</Link></Button>
          <Button variant="contained">
            Continue as Guest
          </Button>
        </Stack>
      </Box>
      <Box sx={{}}>
        <Typography variant="h6" mx={30} color="white">
          developed by John Cho
        </Typography>
      </Box>
    </div>
  );
}
