import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";
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
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";

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
const notPublishedStyle = {
  fontSize: "20pt",
  fontWeight: "bold",
  width: "100%",
  backgroundColor: "rgb(255, 255, 241)",
  borderColor: "black",
  borderRadius: "16px",
  borderStyle: "solid",
  borderWidth: "2px",
};
const publishedStyle = {
  fontSize: "20pt",
  fontWeight: "bold",
  width: "100%",
  backgroundColor: "rgb(170, 170, 228, 1)",
  borderColor: "black",
  borderRadius: "16px",
  borderStyle: "solid",
  borderWidth: "2px",
};

const purpleColor = {
  backgroundColor: "rgb(170, 170, 228)",
  width: "50%",
};

const yellowColor = {
  backgroundColor: "rgb(255, 255, 241)",
  width: "50%",
};

function ListCard(props) {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [text, setText] = useState("");
  const [extendView, setExtendView] = useState(false); ////////HD
  const {
    idNamePair,
    // createView,
    setCreateView,
    // top5Items,
    setTop5Items,
    // newListName,
    // setNewListName,
  } = props;

  // console.log("[ListCard] Initial idNamePair = " + JSON.stringify(idNamePair));

  //HD
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // console.log("[ListCard] idNamePair = " + JSON.stringify(idNamePair));

  function handleEditView() {
    setCreateView(true);
    const editItems = idNamePair.items;
    setTop5Items(editItems);
    store.setCurrentListIDName(idNamePair._id, idNamePair.name);
    store.setCurrentListById(idNamePair._id);
  }

  function handleExtendView(event) {
    store.changeViewsCount(idNamePair._id);
    // event.stopPropagation();
    setExtendView(true);
  }

  function handleCloseExtendView(event) {
    setExtendView(false);
  }

  async function handleDeleteList(event, id) {
    event.stopPropagation();
    store.markListForDeletion(id);
    handleOpen();
  }

  function handleThumbDownOff(event) {
    // console.log("[ListCard:handleThumbDownOff] user = " + auth.user);
    if (auth.user == null) {
      return;
    }
    if (idNamePair.likes.indexOf(auth.user.email) !== -1) {
      // console.log("[ListCard:handleThumbUpOff] ALREADY vote for LIKE");
    } else {
      if (idNamePair.dislikes.indexOf(auth.user.email) === -1) {
        idNamePair.dislikes.push(auth.user.email);
      } else {
        idNamePair.dislikes.pop(auth.user.email);
        // console.log(
        //   "[ListCard:handleThumbDownOff] User Already vote for dislike. Removed"
        // );
      }
      store.changeThumbDownCount(idNamePair._id, idNamePair.dislikes);
    }
  }
  function handleThumbUpOff(event) {
    // console.log("[ListCard:handleThumbUpOff] user = " + auth.user);
    if (auth.user == null) {
      return;
    }
    if (idNamePair.dislikes.indexOf(auth.user.email) !== -1) {
      // console.log("[ListCard:handleThumbUpOff] ALREADY vote for DISLIKE");
    } else {
      if (idNamePair.likes.indexOf(auth.user.email) === -1) {
        idNamePair.likes.push(auth.user.email);
      } else {
        idNamePair.likes.pop(auth.user.email);
        // console.log(
        //   "[ListCard:handleThumbUpOff] User Already vote for like. Removed"
        // );
      }
      store.changeThumbUpCount(idNamePair._id, idNamePair.likes);
    }
  }

  function handleKeyPress(event) {
    // console.log("enter succeeded");
    event.stopPropagation();
    if (event.code === "Enter") {
      console.log("comments ======   " + event.target.value);
      let username = auth.user.firstName + " " + auth.user.lastName;
      let newComment = [username, event.target.value];
      idNamePair.comments.unshift(newComment);
      // console.log(
      //   "idNamePair.comments =====   " + JSON.stringify(idNamePair.comments)
      // );
      store.updateTop5Comment(idNamePair._id, idNamePair.comments);
    }
  }
  let guestButtonDisabled = false;
  if (auth.user.email === "guest@gmail.com") {
    guestButtonDisabled = true;
  }

  let hiddenView = (
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
        <Stack spacing={2} direction="row">
          <Box
            style={{
              backgroundColor: "rgb(45, 46, 112)",
              borderRadius: "16px",
              borderStyle: "solid",
              borderColor: "black",
              borderWidth: "2px",
              width: "50%",
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
          <Box
            id="comment-list"
            style={idNamePair.isListPublished ? purpleColor : yellowColor}
          >
            <List>
              {idNamePair.comments.map((pair) => (
                <Box
                  key={pair._id}
                  sx={{
                    boxShadow: 3,
                  }}
                  style={{
                    backgroundColor: "rgb(212, 175, 56)",
                    margin: "3px",
                    borderRadius: "8px",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    height: "70px",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      color: "blue",
                      marginTop: "6px",
                      marginLeft: "18px",
                    }}
                  >
                    {pair[0]}
                  </Typography>
                  <Typography style={{ marginLeft: "18px" }}>
                    {pair[1]}
                  </Typography>
                </Box>
              ))}
            </List>
          </Box>
        </Stack>
        <TextField
          id="listName"
          variant="outlined"
          size="small"
          placeholder="Add comment"
          onKeyPress={handleKeyPress}
          disabled={guestButtonDisabled || !idNamePair.isListPublished}
          style={{
            backgroundColor: "white",
            width: "400px",
            position: "absolute",
            left: "50.8%",
            bottom: "16%",
            width: "47%",
          }}
        />
      </Box>
    </Box>
  );

  let arrowCircleDown = (
    <IconButton
      sx={{
        gridRow: "1",
        gridColumn: "span 1",
      }}
      onClick={handleExtendView}
      aria-label="ArrowCircleDown"
    >
      <ArrowCircleDown style={{ fontSize: "20pt" }} />
    </IconButton>
  );

  let arrowCircleUp = (
    <IconButton
      sx={{
        gridRow: "1",
        gridColumn: "span 1",
      }}
      onClick={handleCloseExtendView}
      aria-label="ArrowCircleDown"
    >
      <ArrowCircleUp style={{ fontSize: "20pt" }} />
    </IconButton>
  );

  let editMark = (
    <Typography
      sx={{
        lineHeight: "2",
        fontWeight: "bold",
        fontSize: "12pt",
        color: "red",
      }}
      onClick={handleEditView}
    >
      "Edit"
    </Typography>
  );

  let publishedMark = (
    <Typography
      sx={{
        lineHeight: "2",
        fontWeight: "bold",
        fontSize: "12pt",
        color: "black",
      }}
    >
      {"Published: " + JSON.stringify(idNamePair.published).substring(1, 11)}
    </Typography>
  );

  let deleteIconVisible = (
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
  );

  let blankIconSpace = (
    <IconButton
      disabled={true}
      sx={{
        gridRow: "1",
        gridColumn: "span 1",
      }}
      aria-label="delete"
    >
      <DeleteIcon style={{ fontSize: "32pt", opacity: "0" }} />
    </IconButton>
  );

  let deleteIcon = "";
  if (store.getCommunityListMode()) {
    console.log("store.communityListMode =====" + store.getCommunityListMode());
    deleteIcon = blankIconSpace;
  } else {
    deleteIcon = deleteIconVisible;
  }

  let cardElement = (
    <>
      <DeleteModal handleClose={handleClose} open={open} />
      <ListItem
        id={idNamePair._id}
        key={idNamePair._id}
        sx={{ marginTop: "10px", display: "flex", p: 1 }}
        button
        style={idNamePair.isListPublished ? publishedStyle : notPublishedStyle}
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
                  disabled={guestButtonDisabled}
                  onClick={handleThumbUpOff}
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
                  {idNamePair.likes.length}
                </Typography>

                <IconButton
                  sx={{
                    gridRow: "1",
                    gridColumn: "span 1",
                  }}
                  disabled={guestButtonDisabled}
                  onClick={handleThumbDownOff}
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
                  {idNamePair.dislikes.length}
                </Typography>
                {deleteIcon}
              </Box>
            </Box>
          </Box>
          {extendView && hiddenView}
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
              {idNamePair.isListPublished ? publishedMark : editMark}
            </Box>
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
                  {"Views: " + idNamePair.views}
                </Typography>
                {extendView ? arrowCircleUp : arrowCircleDown}
              </Box>
            </Box>
          </Box>
        </Box>
      </ListItem>
    </>
  );
  return cardElement;
}

export default ListCard;
