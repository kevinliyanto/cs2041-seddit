import {
    setPost
} from "./singlepost.js";
import {
    getUserByUsername,
    getUserById,
    getPost,
    getCurrentUser,
    putUnfollow,
    putFollow
} from "../requests.js";
import setNavbar from "./navbar.js";
import {
    checkLogged,
    getUserId,
    getUsername
} from "../localstorage.js";
import {
    modal_upvotecount_load,
    modalError_Unfollow,
    modalError_Follow,
    modalError_GetUser
} from "./modal.js";
import {
    routeSettings
} from "../route.js";
import {
    right_navigation, setBackButton
} from "./rightpanel.js";


let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed_user";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setRightUserPanel = (res) => {
    let mainuser = document.createElement("div");
    mainuser.id = "mainuser";
    mainuser.className = "user-layout";

    let username = document.createElement("div");
    username.innerText = res.username;
    username.className = "user-uname";

    let name = document.createElement("div");
    name.innerText = res.name;
    name.className = "user-longdetail";

    let email = document.createElement("div");
    email.innerText = res.email;
    email.className = "user-longdetail";

    let following = document.createElement("div");
    following.className = "user-numeric";

    let following_top = document.createElement("div");
    following_top.className = "user-numeric-top";
    following_top.innerText = "Following";
    let following_bottom = document.createElement("div");
    following_bottom.className = "user-numeric-bottom";
    following_bottom.innerText = res.following.length;
    following.appendChild(following_top);
    following.appendChild(following_bottom);

    let followers = document.createElement("div");
    followers.className = "user-numeric";

    let followers_top = document.createElement("div");
    followers_top.className = "user-numeric-top";
    followers_top.innerText = "Followers";
    let followers_bottom = document.createElement("div");
    followers_bottom.className = "user-numeric-bottom";
    followers_bottom.innerText = res.followed_num;
    followers.appendChild(followers_top);
    followers.appendChild(followers_bottom);

    let posts = document.createElement("div");
    posts.className = "user-numeric";

    let posts_top = document.createElement("div");
    posts_top.className = "user-numeric-top";
    posts_top.innerText = "Posts";
    let posts_bottom = document.createElement("div");
    posts_bottom.className = "user-numeric-bottom";
    posts_bottom.innerText = res.posts.length;
    posts.appendChild(posts_top);
    posts.appendChild(posts_bottom);

    mainuser.appendChild(username);
    mainuser.appendChild(name);
    mainuser.appendChild(email);
    mainuser.appendChild(following);
    mainuser.appendChild(followers);
    mainuser.appendChild(posts);

    getCurrentUser()
        .then((current) => {
            if (current.id == res.id) {
                following.classList.add("user-numeric-clickable");
                following.title = "Click to show list of users followed";
                following.onclick = () => {
                    let text = "";
                    if (res.following.length == 0) {
                        text = "User is not following any user";
                    } else {
                        text = "Following:";
                    }
                    modal_upvotecount_load("Following", text, res.following);
                }
            }
        });

    return mainuser;
}

let followButton = (res) => {
    let follow = document.createElement("button");
    follow.innerText = "Follow user";
    follow.className = "follow-button";
    follow.id = "followbutton";

    // Modified follow button to make less request
    if (getUsername() == res.username) {
        follow.disabled = true;
        follow.innerText = "Follow disabled";
        follow.classList.toggle("follow-button-disabled");
        follow.title = "You can't follow yourself";
    } else {
        // res is other user
        getCurrentUser()
            .then((current) => {
                if (checkFollowed(current, res.id)) {
                    follow.classList.toggle("follow-button-active");
                    follow.innerText = "Unfollow user";
                }

                follow.onclick = () => {
                    getCurrentUser()
                        .then((current) => {
                            if (checkFollowed(current, res.id)) {
                                putUnfollow(res.username)
                                    .then(() => {
                                        follow.classList.toggle("follow-button-active");
                                        follow.innerText = "Follow user";
                                    })
                                    .catch((err) => {
                                        modalError_Unfollow(err);
                                    });
                            } else {
                                putFollow(res.username)
                                    .then(() => {
                                        follow.classList.toggle("follow-button-active");
                                        follow.innerText = "Unfollow user";
                                    })
                                    .catch((err) => {
                                        modalError_Follow(err);
                                    });
                            }
                        });
                }
            });
    }

    return follow;
}

let checkFollowed = (origin, targetId) => {
    for (let i = 0; i < origin.following.length; i++) {
        if (origin.following[i] == targetId) {
            return true;
        }
    }
    return false;
}

let setRightPanel = (res) => {

    let mainuser = setRightUserPanel(res);
    let follow = followButton(res);

    let rightpanel = document.getElementById("rightpanel");

    rightpanel.appendChild(mainuser);

    rightpanel.appendChild(follow);

    if (getUsername() == res.username) {
        // Add an option to redirect to user settings
        let settings = document.createElement("button");
        settings.innerText = "User settings";
        settings.className = "follow-button";
        settings.onclick = () => {
            routeSettings();
        }
        rightpanel.appendChild(settings);
    }

    rightpanel.appendChild(right_navigation());
}

let generateUser = (res) => {
    let feed = document.getElementById("feed_user");
    let arr = res.posts;
    arr.sort((a, b) => b - a);

    let promises = [];

    for (let i = 0; i < arr.length; i++) {
        let r = getPost(arr[i])
            .then(handleError)
            .then((res) => {
                return res;
            })
            .catch(() => {
                console.error("Can't get user post");
            });
        promises.push(r);
    }

    // Allowing all posts to be fetched first before inserting into feed
    // This promise ignores any unfulfilled promise, in case of any
    // This snippet was taken from https://davidwalsh.name/promises-results
    Promise.all(promises.map(p => p.catch(() => undefined)))
        .then((res) => {
            for (let i = 0; i < res.length; i++) {
                let list = setPost(res[i]);
                feed.appendChild(list);
            }
        });
}

let generateInvalidUsername = () => {
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

let setMainUser = (username) => {
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
    let feed = setFeed();
    leftpanel.appendChild(feed);

    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);
    main.appendChild(rightpanel);

    // Generate posts for user user
    getUserByUsername(username)
        .then(handleError)
        .then((res) => {
            generateUser(res);
            setRightPanel(res);
        })
        .catch((err) => {
            generateInvalidUsername();
        });

}

let setMainUserId = (id) => {
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
    let feed = setFeed();
    leftpanel.appendChild(feed);

    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);
    main.appendChild(rightpanel);

    // Generate posts for user user
    getUserById(id)
        .then(handleError)
        .then((res) => {
            generateUser(res);
            setRightPanel(res);
        })
        .catch((err) => {
            generateInvalidUsername();
        });
}

function handleError(res) {
    if (!res) {
        throw res;
    }
    return res;
}

let userPage = (username) => {
    setNavbar();

    // Restriction is implemented in route
    setMainUser(username);
}

let userPageId = (id) => {
    setNavbar();

    // Restriction is implemented in route
    setMainUserId(id);
    setBackButton();
}

export {
    userPage,
    userPageId
};