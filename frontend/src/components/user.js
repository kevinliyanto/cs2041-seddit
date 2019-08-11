import setPost from "./singlepost.js";
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
    getUserId
} from "../localstorage.js";
import { modal_upvotecount_load } from "./modal.js";


let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setRightUserPanel = (res) => {
    let mainuser = document.createElement("div");
    mainuser.id = "mainuser";
    mainuser.className = "user-layout";

    let username = document.createElement("div");
    username.innerText = res.name;
    username.className = "user-uname";

    let name = document.createElement("div");
    name.innerText = res.name;
    name.className = "user-longdetail";

    let email = document.createElement("div");
    email.innerText = res.email;
    email.className = "user-longdetail";

    let following = document.createElement("div");
    following.className = "user-numeric user-numeric-clickable";

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
    
    following.onclick = () => {
        modal_upvotecount_load("Following", "", res.following);
    }

    return mainuser;
}

let followButton = (res) => {
    let follow = document.createElement("button");
    follow.innerText = "Follow user";
    follow.className = "follow-button";
    follow.id = "followbutton";

    getCurrentUser()
        .then((current) => {
            if (current.id == res.id) {
                follow.disabled = true;
                follow.innerText = "Follow disabled";
                follow.classList.toggle("follow-button-disabled");
                follow.title = "You can't follow yourself";
            } else {
                // res is other user
                if (checkFollowed(current, res.id)) {
                    follow.classList.toggle("follow-button-active");
                    follow.innerText = "Unfollow user";
                }

                follow.onclick = () => {
                    getCurrentUser().then((current) => {
                        if (checkFollowed(current, res.id)) {
                            putUnfollow(res.username)
                                .then(() => {
                                    follow.classList.toggle("follow-button-active");
                                    follow.innerText = "Follow user";
                                })
                                .catch(() => {
                                    console.error("Can't unfollow user");
                                });
                        } else {
                            putFollow(res.username)
                                .then(() => {
                                    follow.classList.toggle("follow-button-active");
                                    follow.innerText = "Unfollow user";
                                })
                                .catch(() => {
                                    console.error("Can't unfollow user");
                                });
                        }
                    });
                }
            }
        });
    
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


let viewFollowing = () => {
    
}

let setEditProfile = () => {

}

let setRightPanel = (res) => {

    let mainuser = setRightUserPanel(res);
    let follow = followButton(res);
    
    let rightpanel = document.getElementById("rightpanel");

    rightpanel.appendChild(mainuser);

    rightpanel.appendChild(follow);
}

let generateUser = (res) => {
    let feed = document.getElementById("feed");
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
                console.error("Can't generate user posts");
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
    // Page not found
}

let generateNoAccess = () => {
    // routeHome();
    // errorModal("Error", "You are not allowed to access user page without any login");
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
    if (checkLogged()) {
        getUserByUsername(username)
            .then(handleError)
            .then((res) => {
                generateUser(res);
                setRightPanel(res);
            })
            .catch((err) => {
                generateInvalidUsername();
            });
    } else {
        // Generate can't access page
        generateNoAccess();
    }
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
    if (checkLogged()) {
        getUserById(id)
            .then(handleError)
            .then((res) => {
                generateUser(res);
                setRightPanel(res);
            })
            .catch((err) => {
                generateInvalidUsername();
            });
    } else {
        // Generate can't access page
        generateNoAccess();
    }
}

function handleError(res) {
    if (!res) {
        throw res;
    }
    return res;
}

let userPage = (username) => {
    setNavbar();

    // Restriction is implemented inside set function
    setMainUser(username);
}

let userPageId = (id) => {
    setNavbar();

    // Restriction is implemented inside set function
    setMainUserId(id);
}

export {
    userPage,
    userPageId
};