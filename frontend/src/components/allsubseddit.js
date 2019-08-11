import {
    getPost,
    getUserByUsername,
    getUserById
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


    rightpanel.appendChild(right_navigation());
    main.appendChild(rightpanel);

    getUserByUsername(getUsername())
        .then((file) => {
            generatePostsOfUser(file.posts)
            let arr = [];
            arr.push(file.id);
            getter(file.following, arr);
        });
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
    let arr_done = done;
    let t = 0;

    let run = () => {
        console.log(arr_proc);
        console.log(arr_done);

        let h = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        if ((h - 120 < window.scrollY + window.innerHeight)) {
            let marker = document.getElementById("marker");
            marker.innerText = "getting new posts...";

            let promises = [];
            for (let i = 0; i < arr_proc.length; i++) {
                // console.log(arr_proc[i]);
                let r = getUserById(arr_proc[i])
                    .then((res) => {
                        return res
                    });
                promises.push(r);
            }

            let s = join(arr_done, arr_proc);
            arr_done = s;
            arr_proc = [];

            Promise.all(promises.map(p => p.catch(() => undefined)))
                .then((res) => {
                    for (let i = 0; i < res.length; i++) {
                        generatePostsOfUser(res[i].posts);
                        let f = removeDuplicate(res[i].following, arr_done);
                        let r = join(arr_proc, f);
                        arr_proc = r;

                        if (arr_proc.length == 0) {
                            marker.innerText = "You have reached bottom of the page\n\n";
            
                            let button = document.createElement("button");
                            button.innerText = "Back to top";
                            button.className = "button button-secondary";
            
                            button.onclick = () => {
                                window.scrollTo(0, 0);
                            }
            
                            marker.appendChild(button);
                            clearTimeout(t);
                        }
                    }
                });
        }
        t = setTimeout(run, 2000);
    }

    setTimeout(run, 1000);
}

let allSubseddit = () => {
    setNavbar();
    setAll();
}

export {
    allSubseddit
}