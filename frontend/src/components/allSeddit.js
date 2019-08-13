import {
    getPost,
    getUserByUsername,
    getUserById,
    getPublic,
    getUserFeed
} from "../requests.js";
import {
    setPost
} from "./singlepost.js";
import setNavbar from "./navbar.js";
import {
    right_navigation,
    setBackButton
} from "./rightpanel.js";


let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setAll = () => {
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
    marker.id = "marker-home";
    marker.className = "marker-home";
    marker.innerText = "getting new posts...";
    leftpanel.appendChild(marker);
    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);

    let se = document.createElement("div");
    se.className = "subseddit-title";

    // It's/all good man
    se.innerText = "Seddit (s/all)";
    rightpanel.appendChild(se);
    rightpanel.appendChild(right_navigation());
    main.appendChild(rightpanel);

    getter();
}

let generatePosts = (file) => {
    let feed = document.getElementById("feed");
    for (let i = 0; i < file.posts.length; i++) {
        // console.log(file.posts[i]);
        let list = setPost(file.posts[i]);
        if (feed != null && !duplicate(file.posts[i].id)) feed.appendChild(list);
    }
}


let duplicate = (id) => {
    let arr = document.getElementsByClassName("post-list");
    for (let i = 0; i < arr.length; i++) {
        let attr = arr[i].getAttribute("data-id-post");
        if (attr == id) return true;
    }
    return false;
}

let array_getuniq = (check, ref) => {
    let ret = [];

    if (check == null) return ret;

    for (let i = 0; i < check.length; i++) {
        let app = true;
        for (let j = 0; j < ref.length; j++) {
            if (ref[j] == check[i]) app = false;
        }
        if (app) ret.push(check[i]);
    }

    return ret;
}

let array_join = (s1, s2) => {
    let ret = [];

    for (let i = 0; i < s1.length; i++) {
        ret.push(s1[i]);
    }

    for (let i = 0; i < s2.length; i++) {
        let app = true;
        for (let j = 0; j < s1.length; j++) {
            if (s1[j] == s2[i]) app = false;
        }
        if (app) ret.push(s2[i]);
    }

    return ret;
}

let getter = () => {
    let flag = true;
    let end = false;
    let lastlen = 0;

    let run = () => {
        if (!flag) return;
        if (end) return;
        flag = false;

        let marker = document.getElementById("marker-home");

        if (marker == null) {
            end = true;
            return;
        }

        let r = document.getElementsByClassName("post-list").length;
        let j = 5;

        let done = () => {
            if(!flag) setTimeout(done, 250);
            
            if (document.getElementsByClassName("post-list").length == 0) {
                marker.innerText = "There is no result";
            } else {
                marker.innerText = "You have reached bottom of the page";
            }
            end = true;
            return;
        }

        getUserFeed(r, j)
            .then((file) => {
                generatePosts(file);
                if (file.posts.length == 0 || file.posts.length < j) {
                    done();
                }
                flag = true;
            })
            .then(() => {
                let diff = document.getElementsByClassName("post-list").length - lastlen;
                lastlen = document.getElementsByClassName("post-list").length;
                if (document.getElementsByClassName("post-list").length < 10 || diff < 1) {
                    run();
                }
            })
            .catch(() => {
                flag = true;
            });

    }

    run();
    let f = () => {
        let h = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        if ((h - 120 < window.scrollY + window.innerHeight)) {
            run();
        }
        let marker = document.getElementById("marker-home");
        if (marker == null || end) {
            window.removeEventListener("scroll", f);
        }
    };

    window.addEventListener("scroll", f);
}

let allSeddit = () => {
    setNavbar();
    setAll();
    setBackButton();
}

export {
    array_getuniq,
    array_join,
    allSeddit
}