import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { GlobalStoreContext } from "../store";
import { useContext, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 390,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

export default function DeleteModal({ open, handleClose }) {
  const { store } = useContext(GlobalStoreContext);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" ml={6}>
            Delete the{" "}
            {store.listMarkedForDeletion && store.listMarkedForDeletion.name}{" "}
            Top 5 List?
          </Typography>

          <Box sx={{ mx: 12, my: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                store.deleteList(store.listMarkedForDeletion);
                handleClose();
              }}
            >
              Confirm
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleClose();
                store.unmarkListForDeletion();
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
