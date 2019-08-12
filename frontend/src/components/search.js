import {
    right_navigation
} from "./rightpanel.js";
import setNavbar from "./navbar.js";
import {
    getUserFeed
} from "../requests.js";
import {
    setPost
} from "./singlepost.js";


// Just regex everything loool
let simpleSearchEngine = (file, string) => {
    // console.log(file);
    // console.log(string);
    let re = new RegExp(string, "i");
    let exist = re.test(file.text);
    exist = exist || re.test(file.meta.author);
    exist = exist || re.test(file.meta.subseddit);

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
        feed.appendChild(list);
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
    leftpanel.appendChild(marker);

    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);

    let detail = document.createElement("h2");
    detail.innerText = "Search for \"" + string + "\"";
    rightpanel.appendChild(detail);
    rightpanel.appendChild(right_navigation());
    main.appendChild(rightpanel);

    getUserFeed(0, 10)
        .then((file) => {
            generatePosts(file, string);
            getter(string);
        });
}

let getter = (string) => {
    let lastlen = 0;

    let f = 10;
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

            marker.innerText = "getting new posts...";

            
            let done = () => {
                if (document.getElementsByClassName("post-list").length == 0) {
                    marker.innerText = "There is no result";
                } else {
                    marker.innerText = "You have reached bottom of the page\n\n";
                
                    let button = document.createElement("button");
                    button.innerText = "Back to top";
                    button.className = "button button-secondary";
                    button.onclick = () => {
                        window.scrollTo(0, 0);
                    } 
                    marker.appendChild(button);
                }
                clearTimeout(t);
            }
            
            
            let j = 10;
            getUserFeed(f, j)
                .then((file) => {
                    if (file.posts.length == 0 || lastlen == f) {
                        done();
                        return;
                    }
                    generatePosts(file, string);
                    f += j;
                    lastlen = document.getElementsByClassName("post-list").length;
                })
                .catch(() => {
                    clearTimeout(t);
                });
        }
        t = setTimeout(run, 400);
    }

    setTimeout(run, 400);
}

let searchPage = (string) => {
    setNavbar();

    // Restriction is implemented in route
    setSearch(string);
}

export {
    searchPage
}