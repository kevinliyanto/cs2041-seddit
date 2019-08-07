let closeModal = (modal) => {
    // let modal = document.getElementById("modal");
    if (modal != null)
        document.body.removeChild(modal);
}

let errorModal = (headerstring, string) => {
    let modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";

    let modal_content = document.createElement("div");
    modal_content.className = "modal-content";

    let close_button = document.createElement("span");
    close_button.className = "close-button";
    close_button.innerText = "✕";
    close_button.onclick = () => {
        closeModal(modal);
    }
    
    let modal_header = document.createElement("div");
    modal_header.className = "modal-header";

    let modal_body = document.createElement("div");
    modal_body.className = "modal-body";

    let headererror = document.createElement("h3");
    headererror.innerText = headerstring;

    let errortext = document.createElement("p");
    errortext.innerText = string;

    modal_header.appendChild(close_button);
    modal_header.appendChild(headererror);
    modal_body.appendChild(errortext);

    modal_content.appendChild(modal_header);
    modal_content.appendChild(modal_body);
    
    modal.appendChild(modal_content);
    
    document.body.appendChild(modal);
}

let loginerrorModal = (code) => {

}

let signuperrorModal = (code) => {

}

let displayUpvotesModal = (array) => {

}

let upvoteerrorModal = () => {
    errorModal("Error", "You need to login to upvote a post");
}

export {
    errorModal,
    loginerrorModal,
    signuperrorModal,
    displayUpvotesModal,
    upvoteerrorModal
};