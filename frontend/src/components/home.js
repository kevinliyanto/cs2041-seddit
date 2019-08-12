import {
    getUserFeed,
    getPublic
} from "../requests.js";
import {
    setPost
} from "./singlepost.js";
import setNavbar from "./navbar.js";
import {
    checkLogged
} from "../localstorage.js";
import {
    right_navigation,
    setBackButton,
    welcome
} from "./rightpanel.js";


let generatePosts = (file) => {
    let feed = document.getElementById("feed");
    for (let i = 0; i < file.posts.length; i++) {
        // console.log(file.posts[i]);
        let list = setPost(file.posts[i]);
        if (feed != null) feed.appendChild(list);
    }
}

let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setMainHome = () => {
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

    let marker = document.createElement("div");
    marker.id = "marker";
    marker.className = "marker";
    marker.innerText = "getting new posts...";
    leftpanel.appendChild(marker);

    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);
    main.appendChild(rightpanel);

    
    // Check if user authed, if authed then generate user post
    // else generate public post
    if (checkLogged()) {
        rightpanel.appendChild(right_navigation());
        getUserFeed(0, 10)
            .then((file) => {
                generatePosts(file);
                getter();
            });
    } else {
        rightpanel.appendChild(welcome());
        getPublic().then(file => {
            generatePosts(file)
            leftpanel.removeChild(marker);
        });
    }
}

let getter = () => {
    let run = () => {
        let t = 0;
        // console.log("run");
        let h = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        // console.log(h);
        // console.log(window.scrollY + window.innerHeight);
        if ((h - 120 < window.scrollY + window.innerHeight)) {
            let marker = document.getElementById("marker");

            if (marker == null) {
                clearTimeout(t);
            }

            let r = document.getElementsByClassName("post-list").length - 1;
            let j = 10;
            getUserFeed(r, j)
                .then((file) => {
                    let done = () => {
                        if (document.getElementsByClassName("post-list").length == 0) {
                            marker.innerText = "There is no result";
                        } else {
                            marker.innerText = "You have reached bottom of the page";
                        }
                        clearTimeout(t);
                    }

                    if (file.posts.length == 0 || file.posts.length < j) {
                        done();
                    }

                    generatePosts(file);
                })
                .catch(() => {
                    clearTimeout(t);
                });
        }
        t = setTimeout(run, 400);
    }

    setTimeout(run, 400);
}

let homePage = () => {
    // setLastVisited("#home");
    setNavbar();
    setMainHome();
    setBackButton();
}

export default homePage;