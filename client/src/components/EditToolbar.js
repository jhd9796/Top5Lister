import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    //HD
    let enabledButtonClass = "top5-button";
    let disabledButtonClass = "top5-button-disabled";

    //HD
    let undoButtonClass = disabledButtonClass;
    let redoButtonClass = disabledButtonClass;
    //let closeButtonClass = disabledButtonClass;

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        store.closeCurrentList();
    }

    if(store.canUndo()){
        undoButtonClass = enabledButtonClass;
    }else{
        undoButtonClass = disabledButtonClass;
    }

    if(store.canRedo()){
        redoButtonClass = enabledButtonClass;
    }else{
        redoButtonClass = disabledButtonClass;
    }




    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }

    return (
        <div id="edit-toolbar">
            <Button
                id='undo-button'
                onClick={handleUndo}
                className={undoButtonClass}
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                id='redo-button'
                onClick={handleRedo}
                className={redoButtonClass}
                variant="contained">
                    <RedoIcon />
            </Button>
            <Button 
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                variant="contained">
                    <CloseIcon />
            </Button>
        </div>
    )
}

export default EditToolbar;