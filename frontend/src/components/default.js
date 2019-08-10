import {
     modal_errors,
     modal_upvotecount,
     modal_comments
} from "./modal.js";

let setHeader = () => {
     let header = document.createElement("header");
     header.className = "banner";
     header.id = "navbar";
     return header;
}

let setMain = () => {
     let main = document.createElement("div");
     main.id = "main";
     main.className = "main";
     return main;
}

let setModals = () => {
     let modals = document.createElement("div");

     modals.appendChild(setModal3());
     modals.appendChild(setModal2());
     modals.appendChild(setModal1());
     return modals;
}

let setModal1 = () => {
     let modal = document.createElement("div");

     // Modal will be hidden by default until error happens
     modal.className = "modal";
     modal.id = "modal_1";

     let content = modal_errors();
     modal.appendChild(content);
     return modal;
}


let setModal2 = () => {
     let modal = document.createElement("div");

     // Modal will be hidden by default until error happens
     modal.className = "modal";
     modal.id = "modal_2";

     let content = modal_upvotecount();
     modal.appendChild(content);
     return modal;
}

let setModal3 = () => {
     let modal = document.createElement("div");

     // Modal will be hidden by default until error happens
     modal.className = "modal";
     modal.id = "modal_3";

     let content = modal_comments();
     modal.appendChild(content);
     return modal;
}

let loadDefault = () => {
     let header = setHeader();
     let main = setMain();
     let modals = setModals();

     document.body.appendChild(header);
     document.body.appendChild(main);
     document.body.appendChild(modals);



     // REMINDER!!
     /* Header (id: navbar), main (id: main), and footer (id: footer)
      * always exists. Do not remove unless generating a completely new page.
      * loadDefault() should only get called when the app starts.
      */
}

export default loadDefault;