import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import jsTPS from "../common/jsTPS";
import api from "../api";
import MoveItem_Transaction from "../transactions/MoveItem_Transaction";
import UpdateItem_Transaction from "../transactions/UpdateItem_Transaction";
import AuthContext from "../auth";

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers.
    @author McKilla Gorilla
*/
// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE

export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
  CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
  CREATE_NEW_LIST: "CREATE_NEW_LIST",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
  UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
  SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
};

export const GlobalFilterListMode = {
  EXACT_MODE: "EXACT_MODE",
  INCLUDE_MODE: "INCLUDE_MODE",
  USER_EXACT_MODE: "USER_EXACT_MODE",
  PUBLISHED_ASC_MODE: "PUBLISHED_ASC_MODE",
  PUBLISHED_DES_MODE: "PUBLISHED_DES_MODE",
  VIEWS_ASC_MODE: "VIEWS_ASC_MODE",
  LIKES_ASC_MODE: "LIKES_ASC_MODE",
  DISLIKES_ASC_MODE: "DISLIKES_ASC_MODE",
};
// WE'LL NEED THIS TO PROCESS TRANSACTIONS

const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    idNamePairs: [],
    currentList: null,
    newListCounter: 0,
    listNameActive: false,
    itemActive: false,
    listMarkedForDeletion: null,
    communityListMode: false,
    searchWord: "",
    filterMode: "",
  });

  const history = useHistory();
  // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE

  const { auth } = useContext(AuthContext);

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;

    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          idNamePairs: payload.idNamePairs,
          currentList: payload.top5List,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          communityListMode: payload.communityListMode,
          searchWord: store.searchWord,
          filterMode: store.filterMode,
        });
      }

      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          filterMode: store.filterMode,
        });
      }

      // CREATE A NEW LIST
      case GlobalStoreActionType.CREATE_NEW_LIST: {
        return setStore({
          idNamePairs: [...store.idNamePairs, payload],
          currentList: payload,
          newListCounter: store.newListCounter + 1,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          communityListMode: false,
          filterMode: store.filterMode,
        });
      }

      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          idNamePairs: payload.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          communityListMode: payload.communityListMode,
          searchWord: store.searchWord,
          filterMode: store.filterMode,
        });
      }

      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: payload,
        });
      }

      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
        });
      }

      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          filterMode: store.filterMode,
        });
      }

      // START EDITING A LIST ITEM

      case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: true,
          listMarkedForDeletion: null,
        });
      }

      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          isListNameEditActive: true,
          isItemEditActive: false,
          listMarkedForDeletion: null,
        });
      }
      default:
        return store;
    }
  };
  store.setFilterMode = function (mode) {
    store.filterMode = mode;
  };

  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.
  // THIS FUNCTION PROCESSES CHANGING A LIST NAME

  store.getFilteredArray = function (inputArray) {
    console.log(
      "[Store:getFilteredArray] filterMode = " +
        store.filterMode +
        ",\n input array = " +
        JSON.stringify(inputArray)
    );
    console.log(
      "[Store:getFilteredArray] START store.searchWord = " + store.searchWord
    );

    let filteredArray = [];
    switch (store.filterMode) {
      case GlobalFilterListMode.EXACT_MODE: // searchWord === word.name
        if (store.searchWord !== "") {
          console.log(
            "[Store:getFilteredArray] GlobalFilterListMode.EXACT_MODE store.searchWord = " +
              store.searchWord
          );
          filteredArray = inputArray.filter(
            (word) => word.name === store.searchWord
          );
        } else {
          console.log(
            "[Store:getFilteredArray] GlobalFilterListMode.EXACT_MODE store.searchWord = EMPTY"
          );
          filteredArray = inputArray;
        }
        break;

      case GlobalFilterListMode.INCLUDE_MODE: 
        if (store.searchWord !== "") {
          console.log(
            "[Store:getFilteredArray] GlobalFilterListMode.INCLUDE_MODE store.searchWord = " +
              store.searchWord
          );
          filteredArray = inputArray.filter(
            (word) => word.name.indexOf(store.searchWord) === 0
          );
        } else {
          console.log(
            "[Store:getFilteredArray] GlobalFilterListMode.INCLUDE_MODE store.searchWord = EMPTY"
          );
          filteredArray = inputArray;
        }
        break;

      case GlobalFilterListMode.USER_EXACT_MODE:
        if (store.searchWord !== "") {
          console.log(
            "[Store:getFilteredArray] GlobalFilterListMode.USER_EXACT_MODE store.searchWord = " +
              store.searchWord
          );
          filteredArray = inputArray.filter(
            (word) => word.ownerName === store.searchWord
          );
        } else {
          console.log(
            "[Store:getFilteredArray] GlobalFilterListMode.USER_EXACT_MODE store.searchWord = EMPTY"
          );
          filteredArray = inputArray;
        }
        break;

      case GlobalFilterListMode.PUBLISHED_ASC_MODE: // ascending: published
        filteredArray = inputArray;
        filteredArray.sort((a, b) => {
          if (a.published > b.published) return 1;
          if (a.published < b.published) return -1;
          return 0;
        });
        break;

      case GlobalFilterListMode.PUBLISHED_DES_MODE: // descending:  published
        filteredArray = inputArray;
        filteredArray.sort((a, b) => {
          if (a.published > b.published) return -1;
          if (a.published < b.published) return 1;
          return 0;
        });
        break;

      case GlobalFilterListMode.VIEWS_ASC_MODE: // ascending: views
        filteredArray = inputArray;
        filteredArray.sort((a, b) => {
          if (a.views > b.views) return -1;
          if (a.views < b.views) return 1;
          return 0;
        });
        break;

      case GlobalFilterListMode.LIKES_ASC_MODE: // ascending: likes
        filteredArray = inputArray;
        filteredArray.sort((a, b) => {
          if (a.likes > b.likes) return -1;
          if (a.likes < b.likes) return 1;
          return 0;
        });
        break;

      case GlobalFilterListMode.DISLIKES_ASC_MODE: // ascending: dislikes
        filteredArray = inputArray;
        filteredArray.sort((a, b) => {
          if (a.dislikes > b.dislikes) return -1;
          if (a.dislikes < b.dislikes) return 1;
          return 0;
        });
        break;
      default:
        console.log(
          "[Store:getFilteredArray] DEFAULT: inputArray is returned "
        );

        return inputArray;
    }
    console.log(
      "[Store:getFilteredArray] Returning RESULT, filterMode = " +
        store.filterMode +
        ",\n filteredArray = " +
        JSON.stringify(filteredArray)
    );
    return filteredArray;
  };

  
  store.changeListName = async function (id, newName) {
    let response = await api.getTop5ListById(id);

    if (response.data.success) {
      let top5List = response.data.top5List;

      top5List.name = newName;

      async function updateList(top5List) {
        response = await api.updateTop5ListById(top5List._id, top5List);

        if (response.data.success) {
          async function getListPairs(top5List) {
            if (store.communityListMode) {
              console.log(
                "[store.changeListName] api.getTop5ListPairsAllUser()"
              );

              response = await api.getTop5ListPairsAllUser();
            } else {
              console.log("[store.changeListName] api.getTop5ListPairs()");

              response = await api.getTop5ListPairs();
            }

            if (response.data.success) {
              let pairsArray = store.getFilteredArray(
                response.data.idNamePairs
              );

              storeReducer({
                type: GlobalStoreActionType.CHANGE_LIST_NAME,

                payload: {
                  idNamePairs: pairsArray,

                  top5List: top5List,

                  communityListMode: store.communityListMode,
                },
              });
            }
          }

          getListPairs(top5List);
        }
      }

      updateList(top5List);
    }
  };

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME

  store.changeThumbDownCount = async function (id, disLikeCnt) {
    console.log("[store.changeThumbDownCount] likeCnt = " + disLikeCnt);

    let response = await api.getTop5ListById(id);

    if (response.data.success) {
      let top5List = response.data.top5List;

      top5List.dislikes = disLikeCnt;

      console.log(
        "[store.changeThumbDownCount] top5List = " + JSON.stringify(top5List)
      );

      async function updateList(top5List) {
        response = await api.updateTop5ListById(top5List._id, top5List);

        if (response.data.success) {
          async function getListPairs(top5List) {
            if (store.communityListMode) {
              console.log(
                "[store.changeThumbDownCount] api.getTop5ListPairsAllUser()"
              );

              response = await api.getTop5ListPairsAllUser();
            } else {
              console.log(
                "[store.changeThumbDownCount] api.getTop5ListPairs()"
              );

              response = await api.getTop5ListPairs();
            }

            // response = await api.getTop5ListPairs();

            if (response.data.success) {
              let pairsArray = store.getFilteredArray(
                response.data.idNamePairs
              );

              storeReducer({
                type: GlobalStoreActionType.CHANGE_LIST_NAME,

                payload: {
                  idNamePairs: pairsArray,

                  top5List: top5List,

                  communityListMode: store.communityListMode,
                },
              });
            }
          }

          getListPairs(top5List);
        }
      }

      updateList(top5List);
    }
  };

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME

  store.changeThumbUpCount = async function (id, likeCnt) {
    console.log("[store.changeThumbUpCount] likeCnt = " + likeCnt);

    let response = await api.getTop5ListById(id);

    if (response.data.success) {
      let top5List = response.data.top5List;

      top5List.likes = likeCnt;

      console.log(
        "[store.changeThumbUpCount] top5List = " + JSON.stringify(top5List)
      );

      async function updateList(top5List) {
        response = await api.updateTop5ListById(top5List._id, top5List);

        if (response.data.success) {
          async function getListPairs(top5List) {
            if (store.communityListMode) {
              console.log(
                "[store.changeThumbUpCount] api.getTop5ListPairsAllUser()"
              );

              response = await api.getTop5ListPairsAllUser();
            } else {
              console.log("[store.changeThumbUpCount] api.getTop5ListPairs()");

              response = await api.getTop5ListPairs();
            }

            // response = await api.getTop5ListPairs();

            if (response.data.success) {
              let pairsArray = store.getFilteredArray(
                response.data.idNamePairs
              );

              storeReducer({
                type: GlobalStoreActionType.CHANGE_LIST_NAME,

                payload: {
                  idNamePairs: pairsArray,

                  top5List: top5List,

                  communityListMode: store.communityListMode,
                },
              });
            }
          }

          getListPairs(top5List);
        }
      }

      updateList(top5List);
    }
  };

  store.updateTop5Comment = async function (id, comments) {
    let response = await api.getTop5ListById(id);

    if (response.data.success) {
      let top5List = response.data.top5List;

      top5List.comments = comments;

      async function updateList(top5List) {
        response = await api.updateTop5ListById(top5List._id, top5List);

        if (response.data.success) {
          async function getListPairs(top5List) {
            if (store.communityListMode) {
              console.log(
                "[store.changeListName] api.getTop5ListPairsAllUser()"
              );

              response = await api.getTop5ListPairsAllUser();
            } else {
              console.log("[store.changeListName] api.getTop5ListPairs()");

              response = await api.getTop5ListPairs();
            }

            // response = await api.getTop5ListPairs();

            if (response.data.success) {
              let pairsArray = store.getFilteredArray(
                response.data.idNamePairs
              );

              storeReducer({
                type: GlobalStoreActionType.CHANGE_LIST_NAME,

                payload: {
                  idNamePairs: pairsArray,

                  top5List: top5List,

                  communityListMode: store.communityListMode,
                },
              });
            }
          }

          getListPairs(top5List);
        }
      }

      updateList(top5List);
    }
  };

  store.changeViewsCount = async function (id) {
    let response = await api.getTop5ListById(id);

    if (response.data.success) {
      let top5List = response.data.top5List;

      top5List.views = top5List.views + 1;

      async function updateList(top5List) {
        response = await api.updateTop5ListById(top5List._id, top5List);

        if (response.data.success) {
          async function getListPairs(top5List) {
            if (store.communityListMode) {
              console.log(
                "[store.changeViewsCount] api.getTop5ListPairsAllUser()"
              );

              response = await api.getTop5ListPairsAllUser();
            } else {
              console.log("[store.changeViewsCount] api.getTop5ListPairs()");

              response = await api.getTop5ListPairs();
            }

            // response = await api.getTop5ListPairs();

            if (response.data.success) {
              let pairsArray = store.getFilteredArray(
                response.data.idNamePairs
              );

              storeReducer({
                type: GlobalStoreActionType.CHANGE_LIST_NAME,

                payload: {
                  idNamePairs: pairsArray,

                  top5List: top5List,

                  communityListMode: store.communityListMode,
                },
              });
            }
          }

          getListPairs(top5List);
        }
      }

      updateList(top5List);
    }
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST

  store.closeCurrentList = function () {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,

      payload: {},
    });

    tps.clearAllTransactions();

    history.push("/");
  };

  // THIS FUNCTION CREATES A NEW LIST

  store.createNewList = async function (top5Items) {
    let newListName = " ";

    let initDate = new Date();

    initDate.setFullYear("0000");

    console.log("[Store:createNewList] initDate = " + initDate.getFullYear());

    let payload = {
      name: newListName,
      items: top5Items,
      ownerEmail: auth.user.email,
      ownerName: auth.user.firstName + " " + auth.user.lastName,
      views: 0,
      likes: [],
      dislikes: [],
      comments: [],
      published: initDate,
      isListPublished: false,
      // published: null
    };

    console.log("[Store:createNewList] paylod = " + JSON.stringify(payload));
    const response = await api.createTop5List(payload);
    if (response.data.success) {
      tps.clearAllTransactions();
      let newList = response.data.top5List;
      storeReducer({
        type: GlobalStoreActionType.CREATE_NEW_LIST,
        payload: newList,
      });
    } else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  };

  store.setSearchWord = function (word) {
    console.log("search Word ==== " + word);
    store.searchWord = word;
    store.loadIdNamePairs();
  };

  store.setCommunityListMode = function (mode) {
    store.communityListMode = mode;
    store.loadIdNamePairs();
  };

  store.getCommunityListMode = function () {
    console.log("getCommunityLIstMOde ====== " + store.communityListMode);
    return store.communityListMode;
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS

  store.loadIdNamePairs = async function () {
    //   console.log("load")
    if (auth.user) {
      if (store.communityListMode) {
        console.log(
          "loadIdNamePairs communityListMode ===== " + store.communityListMode
        );
        console.log("Community List Mode Is True");
        const response = await api.getTop5ListPairsAllUser();
        if (response.data.success) {
          let pairsArray = store.getFilteredArray(response.data.idNamePairs);
          storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: { idNamePairs: pairsArray, communityListMode: true },
          });
        } else {
          console.log("API FAILED TO GET THE LIST PAIRS");
        }
      } else {
        console.log(
          "loadIdNamePairs communityListMode ===== " + store.communityListMode
        );
        console.log("Community List Mode Is False");
        const response = await api.getTop5ListPairs();
        if (response.data.success) {
          // let pairsArray = response.data.idNamePairs;
          let pairsArray = store.getFilteredArray(response.data.idNamePairs);
          storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: { idNamePairs: pairsArray, communityListMode: false },
          });
        } else {
          console.log("API FAILED TO GET THE LIST PAIRS");
        }
      }
    }
  };

  // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION

  // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE

  // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,

  // showDeleteListModal, and hideDeleteListModal

  store.markListForDeletion = async function (id) {
    // GET THE LIST
    console.log("ID = " + id);
    let response = await api.getTop5ListById(id);
    if (response.data.success) {
      let top5List = response.data.top5List;
      storeReducer({
        type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
        payload: top5List,
      });
    }
  };

  store.deleteList = async function (listToDelete) {
    let response = await api.deleteTop5ListById(listToDelete._id);
    if (response.data.success) {
      store.loadIdNamePairs();
      history.push("/");
    }
  };

  store.deleteMarkedList = function () {
    store.deleteList(store.listMarkedForDeletion);
  };

  store.unmarkListForDeletion = function () {
    storeReducer({
      type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,

      payload: null,
    });
  };

  // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
  // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
  // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
  // moveItem, updateItem, updateCurrentList, undo, and redo

  store.setCurrentListById = async function (id) {
    let response = await api.getTop5ListById(id);
    if (response.data.success) {
      let top5List = response.data.top5List;
      // response = await api.updateTop5ListById(top5List._id, top5List);
      // if (response.data.success) {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_LIST,
        payload: top5List,
      });
      console.log(
        "[store.setCurrentListById] top5List = \n" + JSON.stringify(top5List)
      );
      console.log(
        "[store.setCurrentListById] currentList = \n" +
          JSON.stringify(store.currentList)
      );
      // history.push("/top5list/" + top5List._id);
      // }
    }
  };

  store.setCurrentListIDName = function (id, listName) {
    if (store.currentList == null) {
      store.currentList = {
        _id: id,
        name: listName,
      };
    } else {
      store.currentList._id = id;
      store.currentList.name = listName;
    }
    console.log(
      "[Store:setCurrentListIDName] id = " + JSON.stringify(store.currentList)
    );
  };

  store.setCurrentListName = function (listName) {
    if (store.currentList == null) {
      store.currentList = {
        name: listName,
      };
    } else {
      store.currentList.name = listName;
    }
    console.log(
      "[Store:setCurrentListName] id = " + JSON.stringify(store.currentList)
    );
  };

  store.getCurrentListIDPair = function () {
    if (store.currentList == null) {
      return null;
    } else {
      return {
        id: store.currentList._id,
        name: store.currentList.name,
      };
    }
  };

  store.getCurrentListName = function () {
    if (store.currentList == null) {
      console.log("[Store:getCurrentListName] name = empty");
      return "";
    } else {
      console.log(
        "[Store:getCurrentListName] name = " + store.currentList.name
      );
      return store.currentList.name;
    }
  };

  store.addMoveItemTransaction = function (start, end) {
    let transaction = new MoveItem_Transaction(store, start, end);
    tps.addTransaction(transaction);
  };

  store.addUpdateItemTransaction = function (index, newText) {
    let oldText = store.currentList.items[index];
    let transaction = new UpdateItem_Transaction(
      store,
      index,
      oldText,
      newText
    );

    tps.addTransaction(transaction);
  };

  store.moveItem = function (start, end) {
    start -= 1;
    end -= 1;
    if (start < end) {
      let temp = store.currentList.items[start];
      for (let i = start; i < end; i++) {
        store.currentList.items[i] = store.currentList.items[i + 1];
      }
      store.currentList.items[end] = temp;
    } else if (start > end) {
      let temp = store.currentList.items[start];
      for (let i = start; i > end; i--) {
        store.currentList.items[i] = store.currentList.items[i - 1];
      }
      store.currentList.items[end] = temp;
    }
    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };

  store.updateItem = function (index, newItem) {
    store.currentList.items[index] = newItem;
    store.updateCurrentList();
  };

  store.updateCurrentList = async function () {
    const response = await api.updateTop5ListById(
      store.currentList._id,
      store.currentList
    );

    if (response.data.success) {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_LIST,
        payload: store.currentList,
      });
    }
  };

  store.getCurrentListName = function () {
    if (store.currentList) {
      return store.currentList.name;
    } else {
      return "";
    }
  };

  
  store.updateTop5List = async function (top5list, isPublished) {
    store.currentList.items = top5list;

    if (isPublished) {
      store.currentList.published = Date.now();
      store.currentList.isListPublished = true;
      console.log(
        "[Store: updateTop5List] top5list is published = " +
          store.currentList.published
      );
    }

    console.log(
      "[Store: updateTop5List] top5list to update = " + JSON.stringify(top5list)
    );

    const response = await api.updateTop5ListById(
      store.currentList._id,
      store.currentList
    );

    if (response.data.success) {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_LIST,
        payload: store.currentList,
      });
    }
    store.loadIdNamePairs();
  };

  store.undo = function () {
    tps.undoTransaction();
  };

  store.redo = function () {
    tps.doTransaction();
  };

  store.canUndo = function () {
    return tps.hasTransactionToUndo();
  };

  store.canRedo = function () {
    return tps.hasTransactionToRedo();
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME

  store.setIsListNameEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,

      payload: null,
    });
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM

  store.setIsItemEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
      payload: null,
    });
  };

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

export default GlobalStoreContext;

export { GlobalStoreContextProvider };
