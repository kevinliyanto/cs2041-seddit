import { getUserFeed, getPublic } from "../requests.js";
import setPost from "./singlepost.js";
import setNavbar from "./navbar.js";
import { checkLogged } from "../localstorage.js";


let generatePosts = (file) => {
    let feed = document.getElementById("feed");
    for (let i = 0; i < file.posts.length; i++) {
        // console.log(file.posts[i]);
        let list = setPost(file.posts[i]);
        feed.appendChild(list);
    }
}

let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setRightPanel = () => {
    // Submit a new post

    
}

let setMainHome = () => {
    let main = document.getElementById("main");
    // Cleanup main
    while (main.firstChild){
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

    // Generate right panel interface, similar to reddit
    
    main.appendChild(leftpanel);
    main.appendChild(rightpanel);

    // Check if user authed, if authed then generate user post
    // else generate public post
    if (checkLogged()){
        getUserFeed(0, 10).then((file) => {
            generatePosts(file);
        });
    } else {
        getPublic().then(file => generatePosts(file));
    }

}

let homePage = () => {
    // setLastVisited("#home");
    setNavbar();
    setMainHome();
}

export default homePage;
