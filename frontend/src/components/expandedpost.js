import setNavbar from "./navbar.js";
import {
    checkUpvote
} from "./singlepost.js";
import {
    checkLogged,
    getUserId,
    getUsername
} from "../localstorage.js";
import {
    modal_upvotecount_load,
    modal_comments_load,
    modalError_GetPost,
    modalError_GetUser,
    modalError_Downvote,
    modalError_Upvote,
    modalError_DeletePost,
    modalError_Comment,
    modalError_RestrictionComment
} from "./modal.js";
import {
    routeUser,
    routeSubseddit,
    routeExpandedPost,
    routeEditPost,
    refresh,
    routeHome
} from "../route.js";
import {
    putVote,
    deleteVote,
    getPost,
    deletePost,
    putComment
} from "../requests.js";
import {
    convertToNow
} from "./timeformat.js";
import { right_navigation, setBackButton } from "./rightpanel.js";


let setVote = (data) => {
    let vote = document.createElement("div");
    vote.className = "exp-vote";

    let button = document.createElement("i");
    button.className = "material-icons md-dark md-inactive";
    button.innerText = "thumb_up";

    let votecount = document.createElement("div");
    votecount.className = "post-votes";
    votecount.id = "post" + data.id;
    votecount.setAttribute("data-id-upvotes", "");
    votecount.innerText = data.meta.upvotes.length;

    let togglebutton = (button) => {
        button.classList.toggle("md-inactive");
    }

    button.style.cursor = "pointer";
    votecount.classList.add("post-votes-logged");
    votecount.onclick = () => {
        getPost(data.id)
            .then((checkpost) => {
                let s = "Upvoted by:";
                votecount.innerText = checkpost.meta.upvotes.length;
                if (checkpost.meta.upvotes.length == 0) s = "Post has no upvote";
                modal_upvotecount_load("Upvotes", s, checkpost.meta.upvotes);
            })
            .catch(() => {
                modalError_GetPost();
            });
    };

    getUserId()
        .then((id) => {
            for (let i = 0; i < data.meta.upvotes.length; i++) {
                if (data.meta.upvotes[i] == id) {
                    button.classList.remove("md-inactive");
                }
            }

            button.onclick = () => {
                checkUpvote(data.id, id)
                    .then((upvoted) => {
                        if (upvoted) {
                            deleteVote(data.id)
                                .then(() => {
                                    togglebutton(button);
                                    let previous = votecount.innerText;
                                    votecount.innerText = Number(previous) - 1;
                                })
                                .catch(() => {
                                    modalError_Downvote();
                                });
                        } else {
                            putVote(data.id)
                                .then(() => {
                                    togglebutton(button);
                                    let previous = votecount.innerText;
                                    votecount.innerText = Number(previous) + 1;
                                })
                                .catch(() => {
                                    modalError_Upvote();
                                });
                        }
                    })
                    .catch(() => {
                        modalError_GetPost();
                    });
            }
        })
        .catch(() => {
            modalError_GetUser();
        });

    let vdiv = document.createElement("div");
    vdiv.appendChild(button);

    vote.appendChild(vdiv);
    vote.appendChild(votecount);

    return vote;
}

let setTitle = (data) => {
    let title = document.createElement("div");
    title.className = "exp-title";

    let a = document.createElement("a");
    a.innerText = data.title;

    title.appendChild(a);

    return title;
}

let setDetail = (data) => {
    let middleSide = document.createElement("div");
    middleSide.className = "exp-detail";

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

    middletext_2.classList.add("post-underline");
    middletext_2.onclick = () => {
        routeUser(data.meta.author);
    }

    middletext_4.classList.add("post-underline");
    middletext_4.onclick = () => {
        routeSubseddit(data.meta.subseddit);
    }

    return middleSide;
}

let setSettings = (data) => {
    let settings = document.createElement("div");
    settings.className = "exp-set";


    let postcomments = document.createElement("a");
    postcomments.id = "comment" + data.id;
    postcomments.innerText = data.comments.length + " comments";
    postcomments.className = "post-comments";

    settings.appendChild(postcomments);

    // change settings. to bottomSide. in singlepost
    if (getUsername() == data.meta.author) {
        // User is author
        // Add option to remove / edit post

        let edit = document.createElement("a");
        edit.innerText = "edit";
        edit.className = "post-comments post-underline";
        edit.onclick = () => {
            routeEditPost(data.id);
        }

        settings.appendChild(edit);

        let remove = document.createElement("a");
        remove.innerText = "remove";
        remove.className = "post-remove post-underline";

        remove.onclick = () => {
            if (remove.innerText == "remove") {
                remove.classList.toggle("post-underline");

                remove.innerText = "are you sure?";
                let yes = document.createElement("a");
                yes.innerText = "yes";
                yes.className = "post-option post-underline";

                let space = document.createElement("a");
                space.innerText = "/";
                space.className = "post-option"

                let no = document.createElement("a");
                no.innerText = "no";
                no.className = "post-option post-underline";

                let cancelremove = () => {
                    settings.removeChild(yes);
                    settings.removeChild(space);
                    settings.removeChild(no);
                    remove.classList.toggle("post-underline");
                    remove.innerText = "remove";
                }

                yes.onclick = () => {
                    // Remove post
                    deletePost(data.id)
                        .then(() => {
                            routeHome();
                        })
                        .catch(() => {
                            modalError_DeletePost();
                        })
                }

                no.onclick = () => {
                    cancelremove();
                }

                settings.appendChild(yes);
                settings.appendChild(space);
                settings.appendChild(no);
            } else {
                // It won't be clickable
            }
        }

        settings.appendChild(remove);
    }

    return settings;
}

let setContent = (data) => {
    let content = document.createElement("div");
    content.className = "exp-content";

    let texts = document.createElement("p");
    texts.innerText = data.text;
    content.appendChild(texts);

    if (data.image != null) {
        let originalImage = document.createElement("img");
        originalImage.setAttribute('src', "data:image/png;base64," + data.image);
        originalImage.className = "post-image";
        content.appendChild(originalImage);
    }

    return content;
}

let setCommentbox = (data) => {
    let commentdiv = document.createElement("div");
    commentdiv.className = "exp-commentbox";

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

    commentdiv.appendChild(div1);
    commentdiv.appendChild(div2);

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
                            // Redo the comments on setComments
                            let comments = document.getElementById("exp_comments");
                            while (comments.firstChild) {
                                comments.removeChild(comments.firstChild);
                            }
                            comments.appendChild(parseComments(data));
                        })
                        .catch(() => {
                            modalError_GetPost();
                        });
                })
                .catch(() => {
                    modalError_Comment();
                })
        } else {
            modalError_RestrictionComment();
        }
    }

    submitbutton.onclick = () => {
        submit();
    }
    return commentdiv;
}

let setComments = (data) => {
    let comments = document.createElement("div");
    comments.className = "exp-comments";
    comments.id = "exp_comments";

    let ul = parseComments(data);
    comments.appendChild(ul);
    return comments;
}

let parseComments = (data) => {
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

    return ul;
}

let setFeed = (data) => {
    let leftside = document.createElement("div");
    leftside.className = "exp-container";

    let vote = setVote(data);
    let title = setTitle(data);
    let detail = setDetail(data);
    let settings = setSettings(data);
    let content = setContent(data);
    let commentbox = setCommentbox(data);
    let comments = setComments(data);

    leftside.appendChild(vote);
    leftside.appendChild(title);
    leftside.appendChild(detail);
    leftside.appendChild(settings);
    leftside.appendChild(content);
    leftside.appendChild(commentbox);
    leftside.appendChild(comments);

    return leftside;
}

let generatePost = (data) => {
    let main = document.getElementById("main");
    // Cleanup main
    while (main.firstChild) {
        main.firstChild.remove();
    }

    let leftpanel = document.createElement("div");
    leftpanel.id = "leftpanel";
    leftpanel.className = "leftpanel";
    let rightpanel = document.createElement("div");
    rightpanel.id = "rightpanel";
    rightpanel.className = "rightpanel";

    // Generate feed interface
    let feed = setFeed(data);
    leftpanel.appendChild(feed);

    rightpanel.appendChild(right_navigation());
    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);
    main.appendChild(rightpanel);
}

let generateNone = () => {
    let main = document.getElementById("main");
    // Cleanup main
    while (main.firstChild) {
        main.firstChild.remove();
    }

    let leftpanel = document.createElement("div");
    leftpanel.id = "leftpanel";
    leftpanel.className = "leftpanel";
    let rightpanel = document.createElement("div");
    rightpanel.id = "rightpanel";
    rightpanel.className = "rightpanel";

    // Generate none
    let error = document.createElement("h1");
    error.innerText = "Page is not available";

    leftpanel.appendChild(error);
    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);

    rightpanel.appendChild(right_navigation());
    main.appendChild(rightpanel);
}

let expandedPost = (id) => {
    setNavbar();
    getPost(id)
        .then((data) => {
            generatePost(data);
            setBackButton();
        })
        .catch(() => {
            generateNone();
        });
}

export {
    expandedPost
};