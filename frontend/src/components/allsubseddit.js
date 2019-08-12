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
    right_navigation
} from "./rightpanel.js";
import {
    getUsername
} from "../localstorage.js";
import {
    Lock
} from "./Mutex.js";

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
    marker.id = "marker";
    marker.className = "marker";
    leftpanel.appendChild(marker);

    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);

    let subseddit = document.createElement("h2");
    subseddit.innerText = "s/all";
    rightpanel.appendChild(subseddit);
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
                    getter(userids, empty);
                });
        })
}

let generatePostsOfUser = (postsid) => {
    if (postsid == null) return;
    let feed = document.getElementById("feed");

    for (let i = 0; i < postsid.length; i++) {
        getPost(postsid[i])
            .then((data) => {
                let list = setPost(data);
                feed.appendChild(list);
            })
    }
}

let removeDuplicate = (check, ref) => {
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

let join = (s1, s2) => {
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
    for (let i = 0; i < arr_proc.length; i++){
        let app = true;
        for (let j = 0; j < emp.length; j++) {
            if (emp[j] == arr_proc[i]) app = false;
        }
        if (app) emp.push(arr_proc[i]);
    }
    arr_proc = emp;

    let arr_done = done;

    let lock = new Lock();
    let t = 0;


    // Make three array
    // Two same array and new empty called buffer
    // Process arr_proc one by one
    // current arr_proc will deposit its content into buffer (obv after checking itself and arr_done)
    // When current arr_proc is done, put into arr_done
    // When arr_proc is empty, check buffer
    // If empty, clear timeout
    // If not empty, move buffer into arr_proc

    let run = () => {
        // console.log(arr_proc);
        // console.log(arr_done);

        let h = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        if ((h - 400 < window.scrollY + window.innerHeight)) {
            let marker = document.getElementById("marker");

            if (marker == null) {
                clearTimeout(t);
            }

            marker.innerText = "getting new posts...";

            // Produces unsorted feed
            let curr = arr_proc.shift();

            if (curr == null) {
                marker.innerText = "You have reached bottom of the page\n\n";

                let button = document.createElement("button");
                button.innerText = "Back to top";
                button.className = "button button-secondary";

                button.onclick = () => {
                    window.scrollTo(0, 0);
                }

                marker.appendChild(button);
                lock.release();
                clearTimeout(t);
            }

            getUserById(curr)
                .then((res) => {
                    generatePostsOfUser(res.posts);
                    arr_done.push(curr);
                    
                    lock.hold(() => {
                        let f = removeDuplicate(res.following, arr_done);
                        let r = join(arr_proc, f);
                        arr_proc = r;
                        lock.release();
                    })

                })
                .catch(() => {
                    // Avoid deadlock
                });
        }
        t = setTimeout(run, 100);
    }

    setTimeout(run, 400);
}

let allSubseddit = () => {
    setNavbar();
    setAll();
}

export {
    allSubseddit
}