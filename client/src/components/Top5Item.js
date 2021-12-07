import { React, useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
  const { store } = useContext(GlobalStoreContext);

  let { index, top5Items, setTop5Items } = props;
  let itemClass = "top5-item";

  function handleUpdateItems(event, index) {
    console.log("index !!!!!!!!!!! " + index + top5Items + event.target.value);
  
    setTop5Items((prev) => {
      const newItems = [...prev];
      console.log("@#!@#@!!!! " +newItems.splice(index, 1, event.target.value))
      newItems.splice(index, 1, event.target.value);
      return newItems
    });
  }
  console.log("index= " + index);

  return (
    <ListItem
      id={"item-" + (index + 1)}
      // key={key}
      className={itemClass}
      sx={{ display: "flex", p: 1 }}
      style={{
        fontSize: "20pt",
        width: "100%",
        borderRadius: "6px",
        marginTop: "0px",
        marginBottom: "11px",
        backgroundColor: "rgb(212, 175, 56)",
      }}
    >
      <TextField
        margin="none"
        required
        fullWidth
        id={"item-" + (index + 1)}
        className={itemClass}
        value={top5Items[index]}
        onChange={(event) => handleUpdateItems(event, index)}
        inputProps={{ style: { fontSize: 30, height: "1em" } }}
        autoFocus
      />
    </ListItem>
  );
}

export default Top5Item;
