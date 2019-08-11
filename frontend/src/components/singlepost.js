import {
    checkLogged,
    getUserId
} from "../localstorage.js";
import {
    modal_errors_load, modal_upvotecount_load, modal_comments_load
} from "./modal.js";
import {
    routeUser,
    routeSubseddit,
    routeExpandedPost
} from "../route.js";
import { putVote, deleteVote, getPost } from "../requests.js";
import { convertToNow } from "./timeformat.js";


let upvoteButton = (data) => {
    // <i class="material-icons" id="item-1">expand_less</i>

    let button = document.createElement("i");
    button.className = "material-icons md-dark md-inactive";
    button.innerText = "thumb_up";
    
    let togglebutton = (button) => {
        button.classList.toggle("md-inactive");
    }

    if (checkLogged()){
        button.style.cursor = "pointer";
        getUserId()
            .then((id) => {
                checkUpvote(data.id, id)
                    .then((res) => {
                        if (res) {
                            togglebutton(button);
                        }
                    })
                    .catch(() => {
                        console.error("Can't use vote");
                    });
    
                button.onclick = () => {
                    checkUpvote(data.id, id)
                        .then((upvoted) => {
                            if (upvoted) {
                                deleteVote(data.id)
                                    .then(() => {
                                        togglebutton(button);
                                        let votecount = document.getElementById("post" + data.id);
                                        let previous = votecount.innerText;
                                        votecount.innerText = Number(previous) - 1;
                                    })
                                    .catch(() => {
                                        console.error("Can't use vote");
                                    });
                            } else {
                                putVote(data.id)
                                    .then(() => {
                                        togglebutton(button);
                                        let votecount = document.getElementById("post" + data.id);
                                        let previous = votecount.innerText;
                                        votecount.innerText = Number(previous) + 1;
                                    })
                                    .catch(() => {
                                        console.error("Can't use vote");
                                    });
                            }
                        })
                        .catch(() => {
                            console.error("Can't use vote");
                        });
                }
            })
            .catch(() => {
                console.error("Can't use vote");
            });
    } else {
        button.onclick = () => {
            modal_errors_load("Error", "You are not logged in yet");
        }
    }

    return button;
}

let upvoteButton_old = (data) => {
    // <i class="material-icons" id="item-1">expand_less</i>
    
    let button = document.createElement("button");
    button.className = "small-button post-upvote";
    button.innerText = "⇧";

    if (checkLogged()){
        getUserId()
            .then((id) => {
                checkUpvote(data.id, id)
                    .then((res) => {
                        if (res) button.classList.toggle("post-upvote-active");
                    })
                    .catch(() => {
                        console.error("Can't use vote");
                    });
    
                button.onclick = () => {
                    checkUpvote(data.id, id)
                        .then((upvoted) => {
                            if (upvoted) {
                                deleteVote(data.id)
                                    .then(() => {
                                        button.classList.toggle("post-upvote-active");
                                        let votecount = document.getElementById("post" + data.id);
                                        let previous = votecount.innerText;
                                        votecount.innerText = Number(previous) - 1;
                                    })
                                    .catch(() => {
                                        console.error("Can't use vote");
                                    });
                            } else {
                                putVote(data.id)
                                    .then(() => {
                                        button.classList.toggle("post-upvote-active");
                                        let votecount = document.getElementById("post" + data.id);
                                        let previous = votecount.innerText;
                                        votecount.innerText = Number(previous) + 1;
                                    })
                                    .catch(() => {
                                        console.error("Can't use vote");
                                    });
                            }
                        })
                        .catch(() => {
                            console.error("Can't use vote");
                        });
                }
            })
            .catch(() => {
                console.error("Can't use vote");
            });
    } else {
        button.onclick = () => {
            modal_errors_load("Error", "You are not logged in yet");
        }
    }

    return button;
}


async function checkUpvote (dataid, userid) {
    return getPost(dataid)
        .then((data) => {
            for (let i = 0; i < data.meta.upvotes.length; i++) {
                if (data.meta.upvotes[i] == userid) {
                    return true;
                }
            }
            return false;
        })
        .catch((err) => {
            throw err;
        });
}


let upvoteCount = (data) => {
    let votecount = document.createElement("div");
    votecount.className = "post-votes";
    votecount.id = "post" + data.id;
    votecount.setAttribute("data-id-upvotes", "");
    votecount.innerText = data.meta.upvotes.length;

    if (checkLogged()) {
        votecount.classList.add("post-votes-logged");
        votecount.onclick = () => {
            getPost(data.id)
                .then((checkpost) => {
                    let s = "Upvoted by:";
                    if (checkpost.meta.upvotes.length == 0) s = "Post has no upvote";
                    modal_upvotecount_load("Upvotes", s, checkpost.meta.upvotes);
                })
                .catch(() => {
                    console.error("Can't get upvote");
                });
        };
    }

    return votecount;
}


let leftColumn = (data) => {
    let leftCol = document.createElement("div");
    leftCol.className = "post-left";

    // Setting up left side
    let upvote = upvoteButton(data);

    let votecount = upvoteCount(data);

    leftCol.appendChild(upvote);
    leftCol.appendChild(votecount);

    return leftCol;
}

let midColumn = (data) => {
    let midCol = document.createElement("div");
    midCol.className = "post-middle";

    // Setting up middle side
    // Ignore for now, thumbnail not provided
    if (data.image != null) {
        let originalImage = document.createElement("img");
        originalImage.setAttribute('src', "data:image/png;base64," + data.image);

        originalImage.setAttribute("height", 100);
        originalImage.setAttribute("width", 100);

        midCol.appendChild(originalImage);
    }

    return midCol;
}


let rightColumn = (data) => {
    let rightCol = document.createElement("div");
    rightCol.className = "post-right";
    let upperSide = document.createElement("div");
    upperSide.className = "post-rightchild-upper";
    let middleSide = document.createElement("div");
    middleSide.className = "post-rightchild-middle";
    let bottomSide = document.createElement("div");
    bottomSide.className = "post-rightchild-bottom";

    // Setting up right side

    let title = document.createElement("a");
    title.className = "post-title";
    title.innerText = data.title;
    title.setAttribute("data-id-title", "");

    upperSide.appendChild(title);

    //middleSide.innerText = `Posted by ` + data.meta.author + ` on /s/` + data.meta.subseddit + `. Published on ` + convertToNow(data.meta.published);

    let middletext_1 = document.createElement("a");
    let middletext_2 = document.createElement("a");
    let middletext_3 = document.createElement("a");
    let middletext_4 = document.createElement("a");
    let middletext_5 = document.createElement("a");
    let middletext_6 = document.createElement("a");

    middletext_1.innerText = "Posted by ";
    middletext_2.innerText = data.meta.author;
    middletext_2.setAttribute("data-id-author", "");

    middletext_3.innerText = " on ";
    middletext_4.innerText = "/s/" + data.meta.subseddit;
    middletext_5.innerText = ". Published on ";
    middletext_6.innerText = convertToNow(data.meta.published);

    middleSide.appendChild(middletext_1);
    middleSide.appendChild(middletext_2);
    middleSide.appendChild(middletext_3);
    middleSide.appendChild(middletext_4);
    middleSide.appendChild(middletext_5);
    middleSide.appendChild(middletext_6);

    let contentHidden = document.createElement("div");
    contentHidden.className = "post-content";
    contentHidden.style.display = "none";

    let texts = document.createElement("p");
    texts.innerText = data.text;
    contentHidden.appendChild(texts);

    if (data.image != null) {
        let originalImage = document.createElement("img");
        originalImage.setAttribute('src', "data:image/png;base64," + data.image);
        originalImage.className = "post-image";
        contentHidden.appendChild(originalImage);
    }

    let expandButton = document.createElement("i");
    expandButton.className = "material-icons md-light";
    expandButton.innerText = "comment";
    expandButton.style.cursor = "pointer";
    
    let postcomments = document.createElement("a");
    postcomments.id = "comment" + data.id;
    postcomments.innerText = data.comments.length + " comments";
    postcomments.className = "post-comments";
    
    bottomSide.appendChild(expandButton);
    bottomSide.appendChild(postcomments);
    bottomSide.appendChild(contentHidden);

    expandButton.addEventListener("click", () => {

        if (expandButton.innerText == "comment") {
            expandButton.innerText = "highlight_off";
        } else {
            expandButton.innerText = "comment";
        }
        if (contentHidden.style.display === "none") {
            contentHidden.style.display = "block";
        } else {
            contentHidden.style.display = "none";
        }
    });

    rightCol.appendChild(upperSide);
    rightCol.appendChild(middleSide);
    rightCol.appendChild(bottomSide);

    if (checkLogged()) {
        title.classList.add("post-underline");
        title.onclick = () => {
            routeExpandedPost(data.id);
        }

        postcomments.classList.add("post-underline");
        postcomments.onclick = () => {
            getPost(data.id)
                .then((checkpost) => {
                    modal_comments_load("Comments", checkpost);
                })
                .catch(() => {
                    console.error("Error fetching post");
                });
        };

        middletext_2.classList.add("post-underline");
        middletext_2.onclick = () => {
            routeUser(data.meta.author);
        }

        middletext_4.classList.add("post-underline");
        middletext_4.onclick = () => {
            routeSubseddit(data.meta.subseddit);
        }

        middletext_6.classList.add("post-underline");
        middletext_6.onclick = () => {
            routeExpandedPost(data.id);
        }
    }

    return rightCol;
}

let setPost = (data) => {
    let list = document.createElement("li");
    list.setAttribute("data-id-post", data.id);
    list.className = "post-list";

    let wrapper = document.createElement("div");
    wrapper.className = "post-wrapper-nopicture";

    let leftCol = leftColumn(data);

    
    let rightCol = rightColumn(data);
    
    list.appendChild(wrapper);
    wrapper.appendChild(leftCol);
    if (data.thumbnail != null){
        wrapper.className = "post-wrapper";
        let midCol = midColumn(data);
        wrapper.appendChild(midCol);
    }

    wrapper.appendChild(rightCol);


    return list;
}

export default setPost;