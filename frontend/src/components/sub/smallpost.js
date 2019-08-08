import {
    checkLogged
} from "../storage/setlocalstorage.js";
import {
    upvoteerrorModal
} from "./modal.js";
import { routeUser } from "../../router/route.js";

let convertToNow = (timestamp) => {
    let t = new Date(timestamp * 1000);
    let months = ['January', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let y = t.getFullYear();
    let m = months[t.getMonth()];
    let d = t.getDate();
    let h = formatTime(t.getHours());
    let min = formatTime(t.getMinutes());

    let result = d + ' ' + m + ' ' + y + ' (' + h + ':' + min + ')';
    return result;
}

let formatTime = (t) => {
    if (t < 10) {
        t = "0" + t;
    }
    return t;
}

let enlargePost = (post) => {

}

let upvoteButton = () => {
    let upvote = document.createElement("button");
    upvote.className = "small-button post-upvote";
    upvote.innerText = "Λ";
    return upvote;
}

let setSmallPost = (apiUrl, data) => {

    let list = document.createElement("li");
    list.setAttribute("data-id-post", data.id);
    list.className = "post-list";

    let wrapper = document.createElement("div");
    wrapper.className = "post-wrapper";


    let leftCol = document.createElement("div");
    leftCol.className = "post-left";
    let midCol = document.createElement("div");
    midCol.className = "post-middle";
    let rightCol = document.createElement("div");
    rightCol.className = "post-right";
    let upperSide = document.createElement("div");
    upperSide.className = "post-rightchild-upper";
    let middleSide = document.createElement("div");
    middleSide.className = "post-rightchild-middle";
    let bottomSide = document.createElement("div");
    bottomSide.className = "post-rightchild-bottom";

    // Setting up left side
    let upvote = upvoteButton();
    upvote.addEventListener("click", () => {
        if (checkLogged()) {
            upvote.classList.toggle("post-upvote-active");
        } else {
            upvoteerrorModal();
        }
    });


    let votecount = document.createElement("div");
    votecount.className = "post-votes";
    list.setAttribute("data-id-upvotes", "");
    votecount.innerText = data.meta.upvotes.length;
    leftCol.appendChild(upvote);
    leftCol.appendChild(votecount);

    // Setting up middle side
    // Ignore for now, thumbnail not provided
    if (data.image != null) {
        let originalImage = document.createElement("img");
        originalImage.setAttribute('src', "data:image/png;base64," + data.image);

        originalImage.setAttribute("height", 100);
        originalImage.setAttribute("width", 100);

        midCol.appendChild(originalImage);
    }

    // Setting up right side
    upperSide.innerText = data.title;
    upperSide.setAttribute("data-id-title", "");
    
    //middleSide.innerText = `Posted by ` + data.meta.author + ` on /s/` + data.meta.subseddit + `. Published on ` + convertToNow(data.meta.published);

    let middletext_1 = document.createElement("a");
    let middletext_2 = document.createElement("a");
    let middletext_3 = document.createElement("a");
    let middletext_4 = document.createElement("a");
    let middletext_5 = document.createElement("a");
    
    middletext_1.innerText = "Posted by ";
    middletext_2.innerText = data.meta.author;
    middletext_3.innerText = " on ";
    middletext_4.innerText = data.meta.subseddit;
    middletext_5.innerText = ". Published on " + convertToNow(data.meta.published);

    middletext_2.onclick = () => {
        routeUser(apiUrl, data.meta.author);
    }
    
    middleSide.appendChild(middletext_1);
    middleSide.appendChild(middletext_2);
    middleSide.appendChild(middletext_3);
    middleSide.appendChild(middletext_4);
    middleSide.appendChild(middletext_5);

    middleSide.setAttribute("data-id-author", "");

    let contentHidden = document.createElement("div");
    contentHidden.className = "post-content";
    contentHidden.style.display = "none";

    let texts = document.createElement("p");
    texts.innerText = data.text;
    contentHidden.appendChild(texts);

    if (data.image != null) {
        let originalImage = document.createElement("img");
        originalImage.setAttribute('src', "data:image/png;base64," + data.image);
        contentHidden.appendChild(originalImage);
    }

    let expandButton = document.createElement("button");
    expandButton.className = "small-button post-expandbutton";
    expandButton.innerText = ">";
    bottomSide.appendChild(expandButton);
    bottomSide.appendChild(contentHidden);

    expandButton.addEventListener("click", () => {
        contentHidden.classList.toggle("post-expand");
        if (expandButton.innerText == ">") {
            expandButton.innerText = "Λ";
        } else {
            expandButton.innerText = ">";
        }

        if (contentHidden.style.display === "none") {
            contentHidden.style.display = "block";
        } else {
            contentHidden.style.display = "none";
        }
    });

    list.appendChild(wrapper);
    wrapper.appendChild(leftCol);
    wrapper.appendChild(midCol);
    wrapper.appendChild(rightCol);
    rightCol.appendChild(upperSide);
    rightCol.appendChild(middleSide);
    rightCol.appendChild(bottomSide);
    return list;
}

export default setSmallPost;