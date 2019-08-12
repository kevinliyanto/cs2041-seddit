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
    marker.id = "marker-all";
    marker.className = "marker-all";
    marker.innerText = "getting new posts...";
    leftpanel.appendChild(marker);
    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);

    let se = document.createElement("div");
    se.className = "subseddit-title";

    // It's/all good man
    se.innerText = "Whole seddit";
    rightpanel.appendChild(se);
    rightpanel.appendChild(right_navigation());
    main.appendChild(rightpanel);

    getPublic()
        .then((arr) => {
            // console.log(arr);
            generateInitPosts(arr);
            let users = [];
            for (let i = 0; i < arr.posts.length; i++) {
                users.push(arr.posts[i].meta.author);
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
                    getter(userids, empty);
                });
        })
}

let generateInitPosts = (file) => {
    let feed = document.getElementById("feed");
    for (let i = 0; i < file.posts.length; i++) {
        let list = setPost(file.posts[i]);
        if (feed != null) feed.appendChild(list);
    }
}

let generatePostsOfUser = (postsid) => {
    if (postsid == null) return;
    let feed = document.getElementById("feed");
    if (feed == null) return;

    for (let i = 0; i < postsid.length; i++) {
        getPost(postsid[i])
            .then((data) => {
                if (feed == null) return;
                let list = setPost(data);
                if (!duplicate(data.id)) feed.appendChild(list);
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

let getter = (followed, done) => {
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

    // Instead of mutex, use flag. Safety is ensured if the flag is put in the beginning of function.
    let flag = true;
    let end = false;
    let lastlen = 0;

    let run = () => {
        if (!flag) return;
        if (end) return;
        flag = false;

        let marker = document.getElementById("marker-all");

        if (marker == null) {
            end = true;
            return;
        }

        let done = () => {
            marker.innerText = "You have reached bottom of the page";
            end = true;
            return;
        }

        let curr = arr_proc.shift();

        if (curr == null || curr == undefined) {
            done();
        }

        getUserById(curr)
            .then((res) => {
                generatePostsOfUser(res.posts);
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
                    run();
                }
            })
            .catch(() => {
                flag = true;
            });
    }
    
    let f = () => {
        let h = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        if ((h - 120 < window.scrollY + window.innerHeight)) {
            run();
        }
        let marker = document.getElementById("marker-all");
        if (marker == null || end) {
            window.removeEventListener("scroll", f);
        }
    };

    window.addEventListener("scroll", f);
}

let infiniteSubseddit = () => {
    setNavbar();
    setAll();
    setBackButton();
}

export {
    infiniteSubseddit
}