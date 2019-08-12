import {
    right_navigation,
    setBackButton
} from "./rightpanel.js";
import setNavbar from "./navbar.js";
import {
    getUserFeed
} from "../requests.js";
import {
    setPost
} from "./singlepost.js";
import {
    routeSubseddit
} from "../route.js";


// Just regex everything loool
let simpleSearchEngine = (file, string) => {
    // console.log(file);
    // console.log(string);
    let re = new RegExp(string, "i");
    let exist = re.test(file.text);
    exist = exist || re.test(file.meta.author);


    let re2 = /(\/?s\/)?(.+)/;
    let re_m = string.match(re2);
    let re3 = new RegExp(re_m[re_m.length - 1], "i");
    exist = exist || re3.test(file.meta.subseddit);

    if (exist) return true;

    for (let i = 0; i < file.comments.length; i++) {
        const c = file.comments[i];
        exist = exist || re.test(c.author);
        exist = exist || re.test(c.comment);

        if (exist) return true;
    }

    return false;
}

let generatePosts = (file, string) => {
    let feed = document.getElementById("feed");
    for (let i = 0; i < file.posts.length; i++) {
        if (!simpleSearchEngine(file.posts[i], string)) continue;

        if (duplicate(file.posts[i].id)) continue;
        let list = setPost(file.posts[i]);
        if (feed != null) feed.appendChild(list);
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

let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setSearch = (string) => {
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
    marker.innerText = "getting posts...";
    leftpanel.appendChild(marker);

    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);


    let detail = document.createElement("div");
    detail.className = "subseddit-welcome";
    let text = document.createElement("h4");
    text.innerText = "Search for";
    let text2 = document.createElement("h5");
    text2.innerText = "string";
    detail.appendChild(text);
    detail.appendChild(text2);
    rightpanel.appendChild(detail);
    rightpanel.appendChild(right_navigation());
    main.appendChild(rightpanel);

    getter(string);
}

let getter = (string) => {
    let flag = true;
    let end = false;
    let i = 0;
    let lastlen = 0;

    let run = () => {
        if (!flag) return;
        if (end) return;
        flag = false;

        let marker = document.getElementById("marker");

        if (marker == null) {
            end = true;
            return;
        }

        let done = () => {
            if (document.getElementsByClassName("post-list").length == 0) {
                marker.innerText = "there doesn't seem to be anything here";
            } else {
                marker.innerText = "You have reached bottom of the page";
            }
            end = true;
            return;
        }

        let j = 5;
        getUserFeed(i, j)
            .then((file) => {
                if (file.posts.length == 0) {
                    done();
                    return;
                }
                generatePosts(file, string);
                i += j;
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
        let marker = document.getElementById("marker");
        if (marker == null || end) {
            window.removeEventListener("scroll", f);
        }
    };

    window.addEventListener("scroll", f);
}

let searchPage = (string) => {
    setNavbar();

    // Restriction is implemented in route
    setSearch(string);
    setBackButton();
}

export {
    simpleSearchEngine,
    searchPage
}