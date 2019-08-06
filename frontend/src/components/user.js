import setNavbar from './sub/navbar.js';
import setSmallPost from './sub/smallpost.js';
import { checkLogged, setLastPage } from "./storage/setlocalstorage.js";
import { getUser } from "./requester/request_user.js";
import { getPost } from './requester/request_post.js';

let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setRightPanel = (res) => {
    // console.log(res);
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

    let follow = document.createElement("div");
    follow.className = "user-largenum";

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

    follow.appendChild(following);
    follow.appendChild(followers);

    mainuser.appendChild(username);
    mainuser.appendChild(name);
    mainuser.appendChild(email);
    mainuser.appendChild(follow);
    mainuser.appendChild(posts);

    let rightpanel = document.getElementById("rightpanel");
    rightpanel.appendChild(mainuser);
}

let generateUser = (apiUrl, res) => {
    let feed = document.getElementById("feed");
    let arr = res.posts;
    arr.sort((a, b) => b - a);
    for (let i = 0; i < arr.length; i++) {
        getPost(apiUrl, arr[i])
            .then(handleError)
            .then((res) => {
                let list = setSmallPost(res);
                feed.appendChild(list);
            })
            .catch(() => {

            });
    }
}

let generateInvalidUsername = () => {
    // Page not found
}

let generateNoAccess = () => {
    // Invalid access
}

let setMainUser = (apiUrl, username) => {
    let main = document.getElementById("main");
    // Cleanup main
    while (main.firstChild){
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
    if (checkLogged()){
        getUser(apiUrl, username)
            .then(handleError)
            .then((res) => {
                generateUser(apiUrl, res);
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

let userPage = (apiUrl, username) => {
    setLastPage("#u/" + username);
    setNavbar(apiUrl);
    setMainUser(apiUrl, username);
}

export default userPage;