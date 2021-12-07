import React, { useContext, useEffect, useState } from "react";
import { GlobalStoreContext } from "../store";
import ListCard from "./ListCard.js";
import { Typography } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import List from "@mui/material/List";
import AppBanner from "./AppBanner.js";
import WorkBanner from "./WorkBanner.js";
import IconButton from "@mui/material/IconButton";
import Top5Item from "./Top5Item";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
  const { store } = useContext(GlobalStoreContext);
  const [createView, setCreateView] = useState(false);
  const [top5Items, setTop5Items] = useState(["", "", "", "", ""]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  function handleNewListNameChange(event) {
    console.log("[HomeScreen] handleNewListNameChange = " + event.target.value);
    setNewListName(event.target.value);
    // store.setCurrentListName(newListName);
    store.setCurrentListName(event.target.value);
  }

  function handleCreateNewList() {
    setCreateView(true);
    setTop5Items(["", "", "", "", ""]);
    store.createNewList(top5Items);
    console.log(
      "currentList ==== !!!!!!!!!" + JSON.stringify(store.idNamePairs)
    );
  }

  function closeCreateView(event) {
    event.stopPropagation();
    console.log(
      "[HomeScreen] top5List before close = " + JSON.stringify(top5Items)
    );

    setCreateView(false);

    store.updateTop5List(top5Items, false);

    setNewListName("");
  }

  function handlePulishedBtn(event) {
    event.stopPropagation();
    console.log(
      "[HomeScreen] top5List before close = " + JSON.stringify(top5Items)
    );

    setCreateView(false);

    store.updateTop5List(top5Items, true);
    setNewListName("");
  }
  let editItems = "";
  console.log(
    "[HomeScreen] currentlist = " + JSON.stringify(store.currentList)
  );
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
          {top5Items.map((item, index) => (
            <React.Fragment key={index}>
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
                  top5Items={top5Items}
                  setTop5Items={setTop5Items}
                  text={item}
                  index={index}
                />
              </Box>
            </React.Fragment>
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
              onClick={handlePulishedBtn}
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

  let listCard = "";
  console.log("[HomeScreen]listcard = " + listCard);
  if (store) {
    listCard = (
      <List sx={{ width: "90%", left: "5%", bgcolor: "rgb(196, 196, 196)" }}>
        {console.log(
          "store.idNamePairs ====" + JSON.stringify(store.idNamePairs)
        )}
        {store.idNamePairs.map((pair) => (
          <ListCard
            key={pair._id}
            idNamePair={pair}
            selected={false}
            creatView={createView}
            setCreateView={setCreateView}
            top5Items={top5Items}
            setTop5Items={setTop5Items}
            newListName={newListName}
            setNewListName={setNewListName}
          />
        ))}
      </List>
    );
  }

  let handleBottomBar = (
    <>
      <IconButton
        aria-label="add"
        id="add-list-button"
        onClick={handleCreateNewList}
      >
        <AddOutlinedIcon sx={{ width: 62, height: 62, color: "black" }} />
      </IconButton>
      <Typography variant="h3">Your Lists</Typography>
    </>
  );
  if(store.getCommunityListMode()){
    handleBottomBar=(
      <Typography variant="h3">{store.searchWord + " "}Lists</Typography>
    )
  }

  if (createView) {
    return (
      <>
        <AppBanner />
        <WorkBanner createView={createView} />
        <div id="top5-workspace">
          <div id="workspace-edit">
            <TextField
              id="listName"
              variant="outlined"
              size="small"
              defaultValue={store.currentList && store.currentList.name}
              onChange={handleNewListNameChange}
              style={{
                backgroundColor: "white",
                marginLeft: "25px",
                marginTop: "7px",
                width: "630px",
              }}
            />
            {editItems}
          </div>
        </div>
        <div id="list-selector-heading" style={{ top: "89%" }}>
          <IconButton aria-label="add" id="add-list-button-disabled">
            <AddOutlinedIcon sx={{ width: 62, height: 62, color: "black" }} />
          </IconButton>
          <Typography variant="h3" style={{ opacity: "0.25" }}>
            Your Lists
          </Typography>
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
            {/* <IconButton
              aria-label="add"
              id="add-list-button"
              onClick={handleCreateNewList}
            >
              <AddOutlinedIcon sx={{ width: 62, height: 62, color: "black" }} />
            </IconButton>
            <Typography variant="h3">Your Lists</Typography> */}
            {handleBottomBar}
          </div>
        </div>
      </>
    );
  }
};

export default HomeScreen;
