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
    right_navigation, setBackButton
} from "./rightpanel.js";
import {
    array_getuniq,
    array_join
} from "./allsubseddit.js";

let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed_sub";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setSubseddit = (subseddit) => {
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
    marker.id = "marker-sub";
    marker.className = "marker-sub";
    marker.innerText = "getting posts...";
    leftpanel.appendChild(marker);

    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);

    let se = document.createElement("div");
    se.className = "subseddit-title";
    se.innerText = "s/" + subseddit;
    rightpanel.appendChild(se);
    rightpanel.appendChild(right_navigation());
    main.appendChild(rightpanel);

    getter(subseddit);
}

let getter = (subseddit) => {
    let flag = true;
    let end = false;
    let lastlen = 0;
    let p = 0;
    let users = [];

    let run = () => {
        if (!flag) return;
        if (end) return;
        flag = false;

        let marker = document.getElementById("marker-sub");

        if (marker == null) {
            end = true;
            return;
        }

        let done = () => {
            if(!flag) setTimeout(done, 250);

            if (document.getElementsByClassName("post-list").length == 0) {
                marker.innerText = "subseddit s/" + subseddit + " is not found";
            } else {
                marker.innerText = "You have reached bottom of the page";
            }
            end = true;
            return;
        }

        getUserFeed(p, 5)
            .then((arr) => {
                if (arr.posts.length == 0) done();

                let ret = [];
                for (let i = 0; i < arr.posts.length; i++) {
                    ret.push(arr.posts[i].meta.author);
                }

                let uniq = array_getuniq(ret, users);
                users = array_join(uniq, users);
                return uniq;
            })
            .then((k) => {
                let promises = [];
                for (let i = 0; i < k.length; i++) {
                    let p = getUserByUsername(k[i]);
                    promises.push(p);
                }
                p += 5;
                Promise.all(promises.map(p => p.catch(() => undefined)))
                    .then((p) => {
                        for (let i = 0; i < p.length; i++) {
                            generatePostsOfUser(p[i].posts, subseddit);
                        }
                    })
            })
            .then(() => {
                flag = true;
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
        console.log(run);
        let h = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        if ((h - 120 < window.scrollY + window.innerHeight)) {
            run();
        }
        let marker = document.getElementById("marker-sub");
        if (marker == null || end) {
            window.removeEventListener("scroll", f);
        }
    };

    window.addEventListener("scroll", f);
}

let generatePostsOfUser = (postsid, subseddit) => {
    if (postsid == null) return;
    let feed = document.getElementById("feed_sub");
    if (feed == null) return;

    for (let i = 0; i < postsid.length; i++) {
        getPost(postsid[i])
            .then((data) => {
                if (feed == null) return;

                let list = setPost(data);

                let re = new RegExp("^" + subseddit + "$", "i");
                // console.log(data.meta.subseddit + " " + subseddit);
                if (!re.test(data.meta.subseddit)) {
                    // console.log("not match");
                    return;
                }
                if (feed != null && !duplicate(data.id)) feed.appendChild(list);
            });
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

let subsedditPage = (subseddit) => {
    setNavbar();
    setSubseddit(subseddit);
    setBackButton();
}

export {
    subsedditPage
}