/**
 * Top5ListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ZeaWolfs
 */
export default class Top5Controller {
    constructor() {

    }

    setModel(initModel) {
        this.model = initModel;
        this.initHandlers();
    }

    initHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        document.getElementById("add-list-button").onmousedown = (event) => {
            if(!this.model.hasCurrentList()){
                let newList = this.model.addNewList("Untitled", ["?","?","?","?","?"]);            
                this.model.loadList(newList.id);
                this.model.saveLists();
            }
        }
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }
        //Part 5 Redo Button
        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
        }
        //Part 6 Close Button
        document.getElementById("close-button").onmousedown = (event) => {
            this.model.close();
        }

        let oldIndex = null;
        // SETUP THE ITEM HANDLERS
        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);

            // AND FOR TEXT EDITING
            item.ondblclick = (ev) => {
                if (this.model.hasCurrentList()) {
                    // CLEAR THE TEXT
                    item.innerHTML = "";

                    // ADD A TEXT FIELD
                    let textInput = document.createElement("input");
                    textInput.setAttribute("type", "text");
                    textInput.setAttribute("id", "item-text-input-" + i);
                    textInput.setAttribute("value", this.model.currentList.getItemAt(i-1));
                    item.appendChild(textInput);
                    textInput.focus();
                    textInput.ondblclick = (event) => {
                        this.ignoreParentClick(event);
                    }
                    textInput.onkeydown = (event) => {
                        if (event.key === 'Enter') {
                            this.model.addChangeItemTransaction(i-1, event.target.value);
                        }
                    }
                    textInput.onblur = (event) => {
                        this.model.restoreList();
                    }
                }
            }

            //part3 drag and drop
            item.draggable = true;
            item.ondragstart = (ev) =>{
                oldIndex = i-1;
            }
            item.ondragover = (ev) =>{
                ev.preventDefault();
            }
            item.ondrop = (ev) =>{
                this.model.addMoveItemTransaction(oldIndex, i-1);
            }
        }
    }

    registerListSelectHandlers(id) {
        // FOR SELECTING THE LIST
        document.getElementById("top5-list-" + id).onmousedown = (event) => {
            this.model.unselectAll();

            // GET THE SELECTED LIST
            this.model.loadList(id);

            this.model.loadStatusBar();
        }
        // FOR DELETING THE LIST
        document.getElementById("delete-list-" + id).onmousedown = (event) => {
            this.ignoreParentClick(event);
            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE LIST
            let modal = document.getElementById("delete-modal");
            this.listToDeleteIndex = id;
            let listName = this.model.getList(this.model.getListIndex(id)).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            modal.classList.add("is-visible");

            //Part 3 Deleting a List
            let deletionConfirm = document.getElementById("dialog-confirm-button");
            deletionConfirm.onmousedown = (ev)=>{
                this.model.deleteListElement(id);
                modal.classList.remove("is-visible");
            }

            let deletionCancel = document.getElementById("dialog-cancel-button");
            deletionCancel.onmousedown = (ev)=>{
                modal.classList.remove("is-visible");
            }
        }

        //Part 1 Editing the Name of a List
        let list = document.getElementById("top5-list-"+id);
        list.ondblclick = (event) => {
            this.model.loadStatusBar();
            list.innerHTML = "";
            let textInput = document.createElement("input");
            textInput.setAttribute("type", "text");
            textInput.setAttribute("id", "list-card-text-" + id);
            textInput.setAttribute("value", this.model.currentList.getName());
            list.appendChild(textInput);
            textInput.focus();
            textInput.ondblclick = (event) => {
                this.ignoreParentClick(event);
            }
            textInput.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    this.model.changeName(id, event.target.value);
                }
            }
            textInput.onblur = (event) => {
                this.model.changeName(id, event.target.value);
            }
        }
    }

    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }





}