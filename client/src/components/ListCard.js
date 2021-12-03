import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./DeleteModal";
import Top5Item from "./Top5Item.js";

import {
  ThumbUpOffAlt,
  ThumbDownOffAlt,
  ArrowCircleDown,
  ArrowCircleUp,
} from "@mui/icons-material";

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its
    name or deleting it
    @author McKilla Gorilla

*/

function ListCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState("");
  const [extendView, setExtendView] = useState(false); ////////HD
  const { idNamePair } = props;

  //HD
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleLoadList(event, id) {
    if (!event.target.disabled) {
      // CHANGE THE CURRENT LIST
      store.setCurrentList(id);
    }
  }

  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit();
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsListNameEditActive();
    }
    setEditActive(newActive);
  }

  async function handleDeleteList(event, id) {
    event.stopPropagation();
    store.markListForDeletion(id);
    handleOpen();
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      let id = event.target.id.substring("list-".length);
      store.changeListName(id, text);
      toggleEdit();
    }
  }

  function handleUpdateText(event) {
    setText(event.target.value);
  }

  // let listInformation = <></>;

  let cardElement = (
    <>
      <DeleteModal handleClose={handleClose} open={open} />
      <ListItem
        id={idNamePair._id}
        key={idNamePair._id}
        sx={{ marginTop: "10px", display: "flex", p: 1 }}
        button
        // onClick={(event) => {
        //   handleLoadList(event, idNamePair._id);
        // }}
        style={{
          fontSize: "20pt",
          fontWeight: "bold",
          width: "100%",
          backgroundColor: "rgb(170, 170, 228, 1)",
          borderColor: "black",
          borderRadius: "16px",
          borderStyle: "solid",
          borderWidth: "2px",
        }}
      >
        <Box
          sx={{
            p: 1,
            flexGrow: 1,
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              id: "UpperBoxInListItem",
              display: "grid",
              gridAutoColumns: "1fr",
              gap: 1,
            }}
          >
            <Box
              sx={{
                gridRow: "1",
                gridColumn: "span 2",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "regular",
                  fontSize: "20pt",
                  display: "flex",
                  align: "left",
                }}
              >
                {idNamePair.name}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "regular",
                  fontSize: "12pt",
                  display: "flex",
                  align: "left",
                }}
              >
                {"By: " + idNamePair.ownerName}
              </Typography>
            </Box>
            <Box sx={{ gridRow: "1", gridColumn: "4 / 5" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 1,
                }}
              >
                <IconButton
                  sx={{
                    gridRow: "1",
                    gridColumn: "span 1",
                  }}
                  onClick={handleToggleEdit}
                  aria-label="ThumbUpOffAlt"
                >
                  <ThumbUpOffAlt style={{ fontSize: "32pt" }} />
                </IconButton>
                <Typography
                  sx={{
                    lineHeight: "4",
                    fontWeight: "regular",
                    fontSize: "12pt",
                    align: "left",
                    gridRow: "1",
                    gridColumn: "span 1",
                  }}
                >
                  "2M"
                </Typography>

                <IconButton
                  sx={{
                    gridRow: "1",
                    gridColumn: "span 1",
                  }}
                  onClick={handleToggleEdit}
                  aria-label="ThumbDownOffAlt"
                >
                  <ThumbDownOffAlt style={{ fontSize: "32pt" }} />
                </IconButton>
                <Typography
                  sx={{
                    lineHeight: "4",
                    fontWeight: "regular",
                    fontSize: "12pt",
                    align: "left",
                    gridRow: "1",
                    gridColumn: "span 1",
                  }}
                >
                  "55K"
                </Typography>
                <IconButton
                  sx={{
                    gridRow: "1",
                    gridColumn: "span 1",
                  }}
                  onClick={(event) => {
                    handleDeleteList(event, idNamePair._id);
                  }}
                  aria-label="delete"
                >
                  <DeleteIcon style={{ fontSize: "32pt" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              id: "MiddleBoxInListItem",
              display: "grid",
              gridAutoColumns: "1fr",
              gap: 1,
            }}
          >
            <Box
              sx={{
                gridRow: "1",
                gridColumn: "span 2",
              }}
            >
              <Box
                style={{
                  backgroundColor: "rgb(45, 46, 112)",
                  borderRadius: "16px",
                  borderStyle: "solid",
                  borderColor: "black",
                  borderWidth: "2px",
                }}
              >
                <Typography
                  style={{ fontSize: "30px", color: "rgb(187, 156, 62)" }}
                >
                  {"1. " + idNamePair.items[0]}
                  <br />
                  {"2. " + idNamePair.items[1]}
                  <br />
                  {"3. " + idNamePair.items[2]}
                  <br />
                  {"4. " + idNamePair.items[3]}
                  <br />
                  {"5. " + idNamePair.items[4]}
                  <br />
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              id: "LowerBoxInListItem",
              display: "grid",
              gridAutoColumns: "1fr",
              gap: 1,
            }}
          >
            <Box
              sx={{
                gridRow: "1",
                gridColumn: "span 2",
              }}
            >
              <Typography
                sx={{
                  lineHeight: "2",
                  fontWeight: "bold",
                  fontSize: "12pt",
                  color: "red",
                }}
                onClick={handleToggleEdit}
              >
                "Edit"
              </Typography>
            </Box>
            {console.log(store.currentList)}
            <Box
              sx={{
                gridRow: "1",
                gridColumn: "4/5",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    gridRow: "1",
                    gridColumn: "span 4",
                    lineHeight: "2",
                    fontWeight: "regular",
                    fontSize: "12pt",
                  }}
                >
                  "Views: 12,123,122"
                </Typography>

                <IconButton
                  sx={{
                    gridRow: "1",
                    gridColumn: "span 1",
                  }}
                  // onClick={handleToggleEdit}
                  aria-label="ArrowCircleDown"
                >
                  <ArrowCircleDown style={{ fontSize: "20pt" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </ListItem>
    </>
  );

  if (editActive) {
    cardElement = (
      <TextField
        margin="normal"
        required
        fullWidth
        id={"list-" + idNamePair._id}
        label="Top 5 List Name"
        name="name"
        autoComplete="Top 5 List Name"
        className="list-card"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        defaultValue={idNamePair.name}
        inputProps={{ style: { fontSize: 48 } }}
        InputLabelProps={{ style: { fontSize: 24 } }}
        autoFocus
      />
    );
  }

  return cardElement;
}

export default ListCard;
