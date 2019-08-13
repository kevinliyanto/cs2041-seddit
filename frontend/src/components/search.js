import {
    right_navigation,
    setBackButton
} from "./rightpanel.js";
import setNavbar from "./navbar.js";
import {
    getUserFeed,
    getPublic,
    getUserByUsername,
    getUserById,
    getPost
} from "../requests.js";
import {
    setPost
} from "./singlepost.js";
import {
    routeSubseddit,
    routeAllSeddit,
    routeAllSubseddit,
    routeInfinite
} from "../route.js";
import {
    array_getuniq,
    array_join
} from "./allSeddit.js";
import { setLastVisited } from "../localstorage.js";

// Just regex everything loool
let simpleSearchEngine = (file, string) => {
    // console.log(file);
    // console.log(string);
    let re = new RegExp(string, "i");
    let exist = re.test(file.text);
    exist = exist || re.test(file.title);
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
    searchfield.placeholder = "Search for post/seddit";
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

    let div3b = document.createElement("div");
    let tickbox2 = document.createElement("input");
    tickbox2.type = "checkbox";
    let text3 = document.createElement("a");
    text3.innerText = "Check public version (&all=true)";
    text3.style.cursor = "default";

    div3b.appendChild(tickbox2);
    div3b.appendChild(text3);

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
                let append = "";
                if (tickbox2.checked) append = "&all=true";
                getter("s/" + searchfield.value + append);
            } else {
                let append = "";
                if (tickbox2.checked) append = "&all=true";
                getter(searchfield.value + append);
            }
        }
    });

    submit.onclick = () => {
        if (searchfield.value.length == 0) return;
        if (tickbox.checked) {
            let append = "";
            if (tickbox2.checked) append = "&all=true";
            getter("s/" + searchfield.value + append);
        } else {
            let append = "";
            if (tickbox2.checked) append = "&all=true";
            getter(searchfield.value + append);
        }
    }

    div.appendChild(div2);
    div.appendChild(div3);
    div.appendChild(div3b);
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
    if (string == null || string == "") {
        text2.innerText = "something inside seddit..."
    } else {
        text2.innerText = string;
    }
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
    history.replaceState(null, null, document.location.pathname + '#search=' + string);
    setLastVisited(location.hash);

    // Check string matching
    let re = /^s\/\:?(\w+)(?:\&all\=(.*))?$/;
    let p = string.match(re);
    if (p != null) {
        switch (p[1]) {
            case "all":
                if (p[2] == null) {
                    routeAllSeddit();
                } else {
                    if (p[2].match(/^true$/)) {
                        routeInfinite();
                    } else {
                        routeAllSeddit();
                    }
                }
                break;
            default:
                if (p[2] == null) {
                    routeSubseddit(p[1]);
                } else {
                    if (p[2].match(/^true$/)) {
                        routeAllSubseddit(p[1]);
                    } else {
                        routeSubseddit(p[1]);
                    }
                }
                break;
        }
        return;
    }

    // Check if the user wants all subseddit
    re = /^(\w+)(\&all\=(.*))?$/;
    p = string.match(re);
    if (p != null) {
        if (p[2] == null) {
            string = p[1];
        } else {
            if (p[2].match(/^\&all=true$/)) {
                getterAll(p[1]);
                return;
            } else {
                string = p[1];
            }
        }
    }

    // Cleanup all feed child
    let feed = document.getElementById("feed");
    while (feed.firstChild) {
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
            if (!flag) setTimeout(done, 250);

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

let getterAll = (string) => {
    // Cleanup all feed child
    let feed = document.getElementById("feed");
    while (feed.firstChild) {
        feed.removeChild(feed.firstChild);
    }

    let marker = document.getElementById("marker-search");
    if (marker != null) {
        marker.innerText = "getting posts...";
    }

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
                    getterAllFunc(userids, empty, string);
                });
        });

    let getterAllFunc = (followed, done, string) => {
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
            // console.log(arr_proc);
            // console.log(arr_done);
            if (!flag) return;
            if (end) return;
            flag = false;

            let marker = document.getElementById("marker-search");

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

            let curr = arr_proc.shift();
            if (curr == null || curr == undefined) {
                done();
            }

            getUserById(curr)
                .then((res) => {
                    generatePostsOfUser(res.posts, string);
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
            let marker = document.getElementById("marker-search");
            if (marker == null || end) {
                window.removeEventListener("scroll", f);
            }
        };

        window.addEventListener("scroll", f);
    }

    let generatePostsOfUser = (postsid, string) => {
        if (postsid == null) return;
        let feed = document.getElementById("feed");
        if (feed == null) return;

        for (let i = 0; i < postsid.length; i++) {
            // console.log("getting post " + postsid[i] + "//"+ i + " of " + postsid.length);
            getPost(postsid[i])
                .then((data) => {
                    if (!simpleSearchEngine(data, string)) return;
                    if (duplicate(data.id)) return;
                    let list = setPost(data);
                    feed.appendChild(list);
                });
        }
    }
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