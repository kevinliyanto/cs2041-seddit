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

let setSearchBar = (string) => {
    let div = document.createElement("div");
    div.className = "form";

    let details = document.createElement("h3");
    details.innerText = "Search";
    div.appendChild(details);

    let div2 = document.createElement("div");
    let text = document.createElement("a");
    text.style.fontWeight = "bold";
    let searchfield = document.createElement("input");
    searchfield.className = "submission-search";
    searchfield.placeholder = "Search for post";
    searchfield.value = string;
    div2.appendChild(text);
    div2.appendChild(searchfield);

    let div3 = document.createElement("div");
    let tickbox = document.createElement("input");
    tickbox.type = "checkbox";
    let text2 = document.createElement("a");
    text2.innerText = "Search specific subseddit (go to subseddit)";
    text2.style.cursor = "default";
    
    tickbox.onclick = () => {
        if (tickbox.checked) {
            text.innerText = "s/ ";
        } else {
            text.innerText = "";
        }
    }
    div3.appendChild(tickbox);
    div3.appendChild(text2);

    let div4 = document.createElement("div");
    let submit = document.createElement("button");
    submit.className = "submit-button-2";
    submit.innerText = "Search";
    div4.appendChild(submit);

    searchfield.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13) {
            if (searchfield.value.length == 0) return;
            if (tickbox.checked) {
                getter("s/" + searchfield.value);
            } else {
                getter(searchfield.value);
            }
        }
    });

    submit.onclick = () => {
        if (searchfield.value.length == 0) return;
        if (tickbox.checked) {
            getter("s/" + searchfield.value);
        } else {
            getter(searchfield.value);
        }
    }

    div.appendChild(div2);
    div.appendChild(div3);
    div.appendChild(div4);

    return div;
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

    let searchBar = setSearchBar(string);
    leftpanel.appendChild(searchBar);

    // Generate feed interface
    let feed = setFeed();
    leftpanel.appendChild(feed);

    let marker = document.createElement("div");
    marker.id = "marker-search";
    marker.className = "marker-search";
    if (string != "") {
        marker.innerText = "getting posts...";
    }
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

    if (string != "") {
        getter(string);
    }
}

let getter = (string) => {
    // Check string matching
    let re = /^\/?s\/\:?(\w+)\/?$/;
    let p = string.match(re);
    if (p != null) {
        switch (p[1]) {
            case "all":
                routeAllSubseddit();
                break;
            default:
                routeSubseddit(p[1]);
                break;
        }
        return;
    }

    // Cleanup all feed child
    let feed = document.getElementById("feed");
    while(feed.firstChild){
        feed.removeChild(feed.firstChild);
    }
    
    let marker = document.getElementById("marker-search");
    if (marker != null) {
        marker.innerText = "getting posts...";
    }

    let flag = true;
    let end = false;
    let i = 0;
    let lastlen = 0;

    let run = () => {
        if (!flag) return;
        if (end) return;
        flag = false;


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
        let marker = document.getElementById("marker-search");
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