import { getUserById, getUserByUsername, putComment, getPost } from "../requests.js";
import { routeUser } from "../route.js";
import { convertToNow } from "./timeformat.js";

let modal_errors = () => {
    let content = document.createElement("div");
    content.className = "modal-general modal-content";

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

    let modal_body_text_smaller = document.createElement("p");
    modal_body_text_smaller.id = "modal_body_text_smaller";

    modal_header.appendChild(close_button);
    modal_header.appendChild(modal_header_text);
    modal_body.appendChild(modal_body_text);
    modal_body.appendChild(modal_body_text_smaller);

    content.appendChild(modal_header);
    content.appendChild(modal_body);

    return content;
}

let modal_errors_load = (header, text, err) => {
    let modal_header_text = document.getElementById("modal_header_text");
    let modal_body_text = document.getElementById("modal_body_text");

    if (modal_header_text == null || modal_body_text == null) {
        console.error("Can't find modal. This should not happen.");
    }

    modal_header_text.innerText = header;
    modal_body_text.innerText = text;

    if (err != null) {
        modal_body_text_smaller.innerText = err;
    } else {
        modal_body_text_smaller.innerText = "";
    }

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

let modal_success = () => {
    let content = document.createElement("div");
    content.className = "modal-general modal-content";

    let modal_header = document.createElement("div");
    modal_header.className = "modal-header-style2";
    modal_header.id = "modal_header_succ";

    let modal_body = document.createElement("div");
    modal_body.className = "modal-body";
    modal_body.id = "modal_body_succ";

    let close_button = document.createElement("span");
    close_button.className = "close-button";
    close_button.id = "modal_close_button_succ";
    close_button.innerText = "✕";
    
    let modal_header_text = document.createElement("h3");
    modal_header_text.id = "modal_header_text_succ";

    let modal_body_text = document.createElement("p");
    modal_body_text.id = "modal_body_text_succ";

    modal_header.appendChild(close_button);
    modal_header.appendChild(modal_header_text);
    modal_body.appendChild(modal_body_text);

    content.appendChild(modal_header);
    content.appendChild(modal_body);

    return content;
}

let modal_success_load = (header, text) => {
    let modal_header_text = document.getElementById("modal_header_text_succ");
    let modal_body_text = document.getElementById("modal_body_text_succ");

    if (modal_header_text == null || modal_body_text == null) {
        console.error("Can't find modal. This should not happen.");
    }

    modal_header_text.innerText = header;
    modal_body_text.innerText = text;

    // show modal
    let modal = document.getElementById("modal_4");
    modal.style.display = "block";

    let close_button = document.getElementById("modal_close_button_succ");
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
    content.className = "modal-general modal-content";

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

let modal_upvotecount_load = (header, cont, arrayofuserid) => {
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
    
    let upvotecount = arrayofuserid.length;

    modal_body_text.innerText = cont;

    for (let i = 0; i < upvotecount; i++) {
        let userid = arrayofuserid[i];
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
                modalError_GetUser();
                let word = document.createElement("a");
                word.innerText = "userID: " + userid;
                word.className = "upvotes-user-offline";
                list.appendChild(word);
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
    content.className = "modal-general modal-comment";

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
                    submitbox.value = "";

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
                            modalError_GetPost();
                        });
                })
                .catch((err) => {
                    modalError_Comment(err);
                })
        } else {
            modalError_RestrictionComment();
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

    data.comments.sort((a, b) => b.published - a.published);

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

let modalError_Upvote = () => {
    modal_errors_load("Error", "Can't upvote the post");
}

let modalError_Downvote = () => {
    modal_errors_load("Error", "Can't remove upvote from the post");
}

let modalError_Vote = () => {
    modal_errors_load("Error", "Can't vote the post");
}

let modalError_Comment = (err) => {
    modal_errors_load("Error", "Can't put comment", err);
}

let modalError_Login = (err) => {
    modal_errors_load("Error", "Can't login", err);
}

let modalError_Signup = (err) => {
    modal_errors_load("Error", "Can't sign up", err);
}

let modalError_Follow = (err) => {
    modal_errors_load("Error", "Can't follow user", err);
}

let modalError_Unfollow = (err) => {
    modal_errors_load("Error", "Can't unfollow user", err);
}

let modalError_GetPost = () => {
    modal_errors_load("Error", "Can't fetch post. Try refreshing this page.");
}

let modalError_SetPost = () => {
    modal_errors_load("Error", "Can't edit post");
}

let modalError_DeletePost = () => {
    modal_errors_load("Error", "Can't delete post");
}

let modalError_PushPost = () => {
    modal_errors_load("Error", "Can't submit post");
}

let modalError_RestrictionSetPost = () => {
    modal_errors_load("Error", "You are not allowed to modify others post");
}

let modalError_RestrictionComment = () => {
    modal_errors_load("Error", "Comment length should be at least 1");
}

let modalError_GetUser = () =>{
    modal_errors_load("Error", "Error on getting user details. Loaded information might be invalid. Try refreshing this page or check your internet connection.");
}

let modalError_SetUser = () =>{
    modal_errors_load("Error", "Can't modify user settings. Make sure that all forms are valid.");
}

let modalError_RestrictionVote = () => {
    modal_errors_load("Error", "You are not logged in yet", "You need to log in to vote on posts");
}

let modalError_InvalidUser = () => {
    modal_errors_load("Error", "Invalid username");
}

export {
    modal_errors,
    modal_errors_load,
    modal_success,
    modal_success_load,
    modal_upvotecount,
    modal_upvotecount_load,
    modal_comments,
    modal_comments_load,

    modalError_Comment,
    modalError_DeletePost,
    modalError_Follow,
    modalError_GetPost,
    modalError_Login,
    modalError_PushPost,
    modalError_SetPost,
    modalError_Signup,
    modalError_Unfollow,
    modalError_Upvote,
    modalError_Vote,
    modalError_RestrictionSetPost,
    modalError_GetUser,
    modalError_Downvote,
    modalError_RestrictionComment,
    modalError_SetUser,
    modalError_RestrictionVote
}