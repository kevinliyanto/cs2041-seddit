import setNavbar from './sub/navbar.js';
import { checkLogged } from "./storage/setlocalstorage.js";
import { getUser } from "./requester/request_user.js";

let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setRightPanel = (res) => {
    console.log(res);
    let mainuser = document.createElement("div");
    mainuser.id = "mainuser";
    mainuser.className = "user-layout";

    let username = document.createElement("div");
    username.innerText = res.name;
    username.id = "username";
    username.className = "user-uname";

    mainuser.appendChild(username);

    let rightpanel = document.getElementById("rightpanel");
    rightpanel.appendChild(mainuser);
}

let generateUser = (apiUrl, res) => {
    
}

let generateInvalidUsername = () => {
    // Page not found
}

let generateNoAccess = () => {
    // Invalid access
}

let setMainUser = (apiUrl, username) => {
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

    // Generate posts for user user
    if (checkLogged()){
        getUser(apiUrl, username)
            .then((res) => {
                generateUser(apiUrl, res);
                setRightPanel(res);
            })
            .catch((err) => {
                let no = 'Error ' + err.status + ': ';
                console.log(err);
                alert(no + err.statusText);

                // Direct the page to user does not exist
                generateInvalidUsername();
            });
    } else {
        // Generate can't access page
        generateNoAccess();
    }
}

let userPage = (apiUrl, username) => {
    setNavbar(apiUrl);
    setMainUser(apiUrl, username);
}

export default userPage;