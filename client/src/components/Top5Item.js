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
  const [editActive, setEditActive] = useState(false);

  //HD
  function handleKeyPress(event) {
      let index = event.target.id.substring("list-".length);
      let text = event.target.value;
      toggleEdit();
  }

  //HD
  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit();
  }

  //HD
  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsItemEditActive();
    }
    setEditActive(newActive);
  }

  //HD
  let editStatus = false;
  if (store.isItemEditActive) {
    editStatus = true;
  }

  let { index } = props;
  let itemClass = "top5-item";

  if (editActive) {
    return (
      <ListItem
        id={"item-" + (index + 1)}
        key={props.key}
        className={itemClass}
        draggable="true"
        sx={{ display: "flex", p: 1 }}
        style={{
          fontSize: "20pt",
          width: "100%",
        }}
      >
        <TextField
          margin="none"
          required
          fullWidth
          id={"item-" + (index + 1)}
          className={itemClass}
          onKeyPress={handleKeyPress}
          defaultValue={props.text}
          inputProps={{ style: { fontSize: 20 } }}
          autoFocus
        />
      </ListItem>
    );
  } else {
    return (
      <ListItem
        id={"item-" + (index + 1)}
        key={props.key}
        className={itemClass}
        draggable="true"
        sx={{ display: "flex", p: 1 }}
        style={{
          fontSize: "20pt",
          width: "100%",
          borderRadius:"6px",
          marginTop:"0px",
          marginBottom:"11px",
          backgroundColor:"rgb(212, 175, 56)"
        }}
      >
        <TextField
          margin="none"
          required
          fullWidth
          id={"item-" + (index + 1)}
          className={itemClass}
          // onChange={handleKeyPress}
          defaultValue={props.text}
          inputProps={{ style: { fontSize: 30, height:"1em"} }}
          autoFocus
        />
      </ListItem>
    );
  }
}

export default Top5Item;