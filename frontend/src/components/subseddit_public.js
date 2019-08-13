import {
    getPost,
    getUserByUsername,
    getUserById,
    getPublic
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
} from "./allSeddit.js";
import { routeInfinite } from "../route.js";

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
    se.className = "subseddit-title-nobigfont";
    let det = document.createElement("p");
    det.innerText = "All Seddit";
    let p = document.createElement("h3");
    p.innerText = "s/" + subseddit;
    se.appendChild(det);
    se.appendChild(p);
    rightpanel.appendChild(se);
    rightpanel.appendChild(right_navigation());
    main.appendChild(rightpanel);

    getPublic()
        .then(file => file.posts)
        .then((arr) => {
            // console.log(arr);
            let users = [];
            for (let i = 0; i < arr.length; i++) {
                users.push(arr[i].meta.author);
            }
            return users;
        })
        .then((arr) => {
            let promises = [];
            for (let i = 0; i < arr.length; i++) {
                let p = getUserByUsername(arr[i])
                    .then((res) => {
                        return res;
                    })
                promises.push(p);
            }
            Promise.all(promises.map(p => p.catch(() => undefined)))
                .then((users) => {
                    let arr = [];
                    for (let i = 0; i < users.length; i++) {

                        arr.push(users[i].id);
                    }
                    return arr;
                })
                .then((userids) => {
                    let empty = [];
                    getter(userids, empty, subseddit);
                });
        })
}

let getter = (followed, done, subseddit) => {
    let arr_proc = followed;
    arr_proc.sort((a, b) => b - a);
    // Make sure that arr_proc is unique
    let emp = [];
    for (let i = 0; i < arr_proc.length; i++) {
        let app = true;
        for (let j = 0; j < emp.length; j++) {
            if (emp[j] == arr_proc[i]) app = false;
        }
        if (app) emp.push(arr_proc[i]);
    }
    arr_proc = emp;

    let arr_done = done;

    let flag = true;
    let end = false;
    let lastlen = 0;

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
            if (document.getElementsByClassName("post-list").length == 0) {
                marker.innerText = "subseddit s/" + subseddit + " is not found";
            } else {
                marker.innerText = "You have reached bottom of the page";
            }
            end = true;
            return;
        }

        let curr = arr_proc.shift();
        if (curr == null || curr == undefined) {
            done();
        }

        getUserById(curr)
            .then((res) => {
                generatePostsOfUser(res.posts, subseddit);
                return res.following;
            })
            .then((following_arr) => {
                arr_done.push(curr);
                let f = array_getuniq(following_arr, arr_done);
                let r = array_join(arr_proc, f);
                arr_proc = r;
                flag = true;
            })
            .then(() => {
                let diff = document.getElementsByClassName("post-list").length - lastlen;
                lastlen = document.getElementsByClassName("post-list").length;
                if (document.getElementsByClassName("post-list").length < 10 || diff < 1) {
                    // Keep firing until it's done
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
                if (feed != null) feed.appendChild(list);
            });
    }
}

let allSubsedditPage = (subseddit) => {
    if (subseddit.match(/^all$/)) {
        routeInfinite();
        return;
    }

    setNavbar();
    setSubseddit(subseddit);
    setBackButton();
}

export {
    allSubsedditPage
}