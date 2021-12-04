import React, { useContext, useEffect, useState } from "react";
import { GlobalStoreContext } from "../store";
import ListCard from "./ListCard.js";
import { Fab, Typography } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import List from "@mui/material/List";
import AppBanner from "./AppBanner.js";
import WorkBanner from "./WorkBanner.js";
import IconButton from "@mui/material/IconButton";
import Top5Item from "./Top5Item";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
  const { store } = useContext(GlobalStoreContext);
  const [createView, setCreateView] = useState(false);
  

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  function handleCreateNewList() {
    setCreateView(true);
    store.createNewList();
  }

  function closeCreateView() {
    setCreateView(false);
  }

  let editItems = "";
  if (store.currentList) {
    editItems = (
      <>
        <Box
          sx={{
            bgcolor: "rgb(45, 46, 112)",
            position: "absolute",
            top: "9%",
            width: "96%",
            height: "80%",
            left: "2%",
            borderRadius: "16px",
          }}
        >
          <List
            id="edit-items"
            sx={{ width: "100%", bgcolor: "background.paper" }}
          >
            {store.currentList.items.map((item, index) => (
              <>
                <Box sx={{ display: "flex", bgcolor: "rgb(45, 46, 112)" }}>
                  <Box
                    sx={{
                      bgcolor: "rgb(212, 175, 56)",
                      width: "82px",
                      borderRadius: "6px",
                      height: "78px",
                      marginRight: "10px",
                      marginBottom: "5px",
                    }}
                  >
                    <Typography
                      sx={{ marginTop: "8px", marginLeft: "24px" }}
                      style={{ fontSize: "40px" }}
                    >
                      {index + 1}
                      {"."}
                    </Typography>
                  </Box>
                  <Top5Item
                    key={"top5-item-" + (index + 1)}
                    text={item}
                    index={index}
                  />
                </Box>
              </>
            ))}
          </List>
          <Box
            sx={{
              width: "40%",
              position: "absolute",
              left: "79%",
              top: "101%",
            }}
          >
            <Stack spacing={2} direction="row">
              <Button
                onClick={closeCreateView}
                style={{
                  backgroundColor: "rgb(186, 186, 186)",
                  width: "132px",
                  height: "58px",
                  borderRadius: "8px",
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              >
                <Typography
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "23px",
                  }}
                >
                  Save
                </Typography>
              </Button>
              <Button
                style={{
                  backgroundColor: "rgb(186, 186, 186)",
                  width: "132px",
                  height: "58px",
                  borderRadius: "8px",
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              >
                <Typography
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "23px",
                  }}
                >
                  Publish
                </Typography>
              </Button>
            </Stack>
          </Box>
        </Box>
      </>
    );
  }

  let listCard = "";
  if (store) {
    listCard = (
      <List sx={{ width: "90%", left: "5%", bgcolor: "rgb(196, 196, 196)" }}>
        {store.idNamePairs.map((pair) => (
          <ListCard key={pair._id} idNamePair={pair} selected={false} />
        ))}
      </List>
    );
  }

  if (createView) {
    return (
      <>
        <AppBanner />
        <WorkBanner />
        <div id="top5-workspace">
          <div id="workspace-edit">{editItems}</div>
        </div>
        <div id="list-selector-heading" style={{ top: "89%" }}>
          <IconButton
            aria-label="add"
            id="add-list-button-disabled"
          >
            <AddOutlinedIcon sx={{ width: 62, height: 62, color: "black" }} />
          </IconButton>
          <Typography variant="h3" style={{opacity:"0.25"}}>Your Lists</Typography>
        </div>
      </>
    );
  } else {
    return (
      <>
        <AppBanner />
        <WorkBanner />
        <div id="top5-list-selector">
          <div id="list-selector-list">{listCard}</div>
          <div id="list-selector-heading">
            <IconButton
              aria-label="add"
              id="add-list-button"
              onClick={handleCreateNewList}
            >
              <AddOutlinedIcon sx={{ width: 62, height: 62, color: "black" }} />
            </IconButton>
            <Typography variant="h3">Your Lists</Typography>
          </div>
        </div>
      </>
    );
  }
};

export default HomeScreen;
