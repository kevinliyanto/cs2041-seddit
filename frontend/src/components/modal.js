import { getUserById, getUserByUsername, putComment, getPost } from "../requests.js";
import { routeUser } from "../route.js";
import { convertToNow } from "./timeformat.js";

let modal_errors = () => {
    let content = document.createElement("div");
    content.className = "modal-content";

    let modal_header = document.createElement("div");
    modal_header.className = "modal-header";
    modal_header.id = "modal_header";

    let modal_body = document.createElement("div");
    modal_body.className = "modal-body";
    modal_body.id = "modal_body";

    let close_button = document.createElement("span");
    close_button.className = "close-button";
    close_button.id = "modal_close_button";
    close_button.innerText = "✕";
    
    let modal_header_text = document.createElement("h3");
    modal_header_text.id = "modal_header_text";

    let modal_body_text = document.createElement("p");
    modal_body_text.id = "modal_body_text";

    modal_header.appendChild(close_button);
    modal_header.appendChild(modal_header_text);
    modal_body.appendChild(modal_body_text);

    content.appendChild(modal_header);
    content.appendChild(modal_body);

    return content;
}

let modal_errors_load = (header, text) => {
    let modal_header_text = document.getElementById("modal_header_text");
    let modal_body_text = document.getElementById("modal_body_text");

    if (modal_header_text == null || modal_body_text == null) {
        console.error("Can't find modal. This should not happen.");
    }

    modal_header_text.innerText = header;
    modal_body_text.innerText = text;

    // show modal
    let modal = document.getElementById("modal_1");
    modal.style.display = "block";

    let close_button = document.getElementById("modal_close_button");
    close_button.onclick = () => {
        modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

let modal_upvotecount = () => {
    let content = document.createElement("div");
    content.className = "modal-content";

    let modal_header = document.createElement("div");
    modal_header.className = "modal-header-style2";
    modal_header.id = "modal_header_2";

    let modal_body = document.createElement("div");
    modal_body.className = "modal-body";
    modal_body.id = "modal_body_2";

    let close_button = document.createElement("span");
    close_button.className = "close-button";
    close_button.id = "modal_close_button_2";
    close_button.innerText = "✕";
    
    let modal_header_text = document.createElement("h3");
    modal_header_text.id = "modal_header_text_2";

    let modal_body_text = document.createElement("ul");
    modal_body_text.id = "modal_body_text_2";

    modal_header.appendChild(close_button);
    modal_header.appendChild(modal_header_text);
    modal_body.appendChild(modal_body_text);

    content.appendChild(modal_header);
    content.appendChild(modal_body);

    return content;
}

let modal_upvotecount_load = (header, data) => {
    let modal_header_text = document.getElementById("modal_header_text_2");
    let modal_body_text = document.getElementById("modal_body_text_2");
    modal_body_text.style.fontWeight = "bold";
    
    if (modal_header_text == null || modal_body_text == null) {
        console.error("Can't find modal. This should not happen.");
    }

    modal_header_text.innerText = header;

    while (modal_body_text.firstChild) {
        modal_body_text.removeChild(modal_body_text.firstChild);
    }
    
    let upvotecount = data.meta.upvotes.length;

    if (!upvotecount) {
        modal_body_text.innerText = "Post has no upvote";
    } else {
        modal_body_text.innerText = "Upvoted by:";
    }

    for (let i = 0; i < upvotecount; i++) {
        let userid = data.meta.upvotes[i];
        let list = document.createElement("li");
        
        getUserById(userid)
            .then((userdata) => {
                let word = document.createElement("a");
                word.innerText = userdata.username + " (userID:" + userdata.id + ")";
                word.className = "upvotes-user";
                word.onclick = () => {
                    routeUser(userdata.username);
                    modal.style.display = "none";
                }
                list.appendChild(word);
            })
            .catch(() => {
                console.error("Failed to fetch a user");
            });

        modal_body_text.appendChild(list);
    }

    // show modal
    let modal = document.getElementById("modal_2");
    modal.style.display = "block";

    let close_button = document.getElementById("modal_close_button_2");
    close_button.onclick = () => {
        modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

let modal_comments = () => {
    let content = document.createElement("div");
    content.className = "modal-comment";

    let modal_header = document.createElement("div");
    modal_header.className = "modal-header-style2";
    modal_header.id = "modal_header_3";

    let modal_body = document.createElement("div");
    modal_body.className = "modal-body";
    modal_body.id = "modal_body_3";

    let close_button = document.createElement("span");
    close_button.className = "close-button";
    close_button.id = "modal_close_button_3";
    close_button.innerText = "✕";
    
    let modal_header_text = document.createElement("h3");
    modal_header_text.id = "modal_header_text_3";

    let modal_body_text = document.createElement("div");
    modal_body_text.id = "modal_body_text_3";

    modal_header.appendChild(close_button);
    modal_header.appendChild(modal_header_text);
    modal_body.appendChild(modal_body_text);

    content.appendChild(modal_header);
    content.appendChild(modal_body);

    return content;
}

let modal_comments_load = (header, data) => {
    let modal = document.getElementById("modal_3");

    let modal_header_text = document.getElementById("modal_header_text_3");
    let modal_body_text = document.getElementById("modal_body_text_3");

    if (modal_header_text == null || modal_body_text == null) {
        console.error("Can't find modal. This should not happen.");
    }

    modal_header_text.innerText = header;

    while (modal_body_text.firstChild) {
        modal_body_text.removeChild(modal_body_text.firstChild);
    }
    
    // Comment box part
    let commentsubmission = document.createElement("div");
    let div1 = document.createElement("div");
    let div2 = document.createElement("div");

    let submitbox = document.createElement("textarea");
    submitbox.id = "submit_comment";
    submitbox.className = "comment-input";
    submitbox.placeholder = "Put your comment here";
    div1.appendChild(submitbox);

    let submitbutton = document.createElement("button");
    submitbutton.className = "submit-button";
    submitbutton.innerText = "Submit";
    div2.appendChild(submitbutton);

    submitbox.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit();
        }
    });

    submitbutton.onclick = () => {
        submit();
    }
    
    let submit = () => {
        if (submitbox.value.length != 0) {
            let payload = {
                "comment": submitbox.value
            }
    
            putComment(payload, data.id)
                .then(() => {
                    let number = '' + data.id;
                    let commentnumber = document.getElementById("comment" + number);
                    let num = commentnumber.innerText.match(/(\d+)/);
                    let res = Number(num[1]) + 1;
                    commentnumber.innerText = res + " comments";

                    getPost(data.id)
                        .then((data) => {
                            modal_comments_load(header, data);
                            return;
                        })
                        .catch(() => {
                            console.error("Can't get post");
                        });
                })
                .catch(() => {
                    console.error("Can't post comment");
                })
        } else {
            modal_errors_load("Error", "Comment length should be at least 1");
        }
    
    }

    commentsubmission.appendChild(div1);
    commentsubmission.appendChild(div2);
    // Comments part

    let commentcount = data.comments.length;
    let ul = document.createElement("ul");
    ul.className = "comments-container";
    ul.style.fontWeight = "bold";
    ul.style.marginBottom = "5px";
    if (!commentcount) {
        ul.innerText = "Post has no comment";
    } else {
        ul.innerText = "Comments:";
    }

    for (let i = 0; i < commentcount; i++) {
        let comment = data.comments[i];
        let list = document.createElement("li");
        list.className = "comment-container";
        
        let container = document.createElement("div");
        container.className = "comment-div-container";

        let user = document.createElement("a");
        user.className = "comment-username";
        user.innerText = comment.author;
        user.onclick = () => {
            routeUser(comment.author);
            modal.style.display = "none"
        }

        let posted = document.createElement("a");
        posted.className = "comment-detail";
        posted.innerText = " (Posted on " + convertToNow(comment.published) + ")";

        let content = document.createElement("div");
        content.innerText = comment.comment;
        content.className = "comment-content";

        container.appendChild(user);
        container.appendChild(posted);
        container.appendChild(content);
        list.appendChild(container);
        ul.appendChild(list);
    }

    // Append both
    modal_body_text.appendChild(commentsubmission);
    modal_body_text.appendChild(ul);

    // show modal
    modal.style.display = "block";

    let close_button = document.getElementById("modal_close_button_3");
    close_button.onclick = () => {
        modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

export {
    modal_errors,
    modal_errors_load,
    modal_upvotecount,
    modal_upvotecount_load,
    modal_comments,
    modal_comments_load
}