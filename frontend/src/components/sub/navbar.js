import {
    routeLogin,
    routeRegister,
    routeHome,
    routeUser
} from "../../router/route.js";
import {
    checkLogged, getUsername, clearSession
} from "../storage/setlocalstorage.js";


function searchBar() {
    let search = document.createElement("input");
    search.id = "search";
    search.setAttribute("data-id-search", "");
    search.placeholder = "Search Subseddit";
    search.type = "search";
    return search;
}

function loginButton() {
    let login = document.createElement("button");
    login.setAttribute("data-id-login", "");
    login.className = "button button-primary";
    login.innerText = "Log In";
    return login;
}

function signupButton() {
    let signup = document.createElement("button");
    signup.setAttribute("data-id-signup", "");
    signup.className = "button button-secondary";
    signup.innerText = "Sign Up";
    return signup;
}

function logoutButton() {
    let logout = document.createElement("button");
    logout.className = "button button-primary";
    logout.innerText = "Log Out";
    return logout;
}

function sedditLogo() {
    let logo = document.createElement("h1");
    logo.className = "flex-center logo";
    logo.innerText = "Seddit";
    return logo;
}

// If user is not logged in
let generateNavlistPub = (apiUrl) => {
    // console.log("generating navlistpub");
    // Create elements
    let navbar = document.getElementById("navbar");

    let list = document.createElement("ul");
    list.classList.add("nav");
    list.id = "navlist-pub";

    let list_1 = document.createElement("li");
    list_1.className = "nav-item";
    let list_2 = document.createElement("li");
    list_2.className = "nav-item";
    let list_3 = document.createElement("li");
    list_3.className = "nav-item";

    let search = searchBar();
    list_1.appendChild(search);

    let login = loginButton();
    login.onclick = () => {
        routeLogin(apiUrl);
    }
    list_2.appendChild(login);

    let signup = signupButton();
    signup.onclick = () => {
        routeRegister(apiUrl);
    }
    list_3.appendChild(signup);

    list.appendChild(list_1);
    list.appendChild(list_2);
    list.appendChild(list_3);

    let logo = sedditLogo();
    logo.onclick = () => {
        routeHome(apiUrl);
    }

    // Set everything to navbar
    navbar.appendChild(logo);
    navbar.appendChild(list);
    // console.log("navbar set");
}

// If user is logged in
let generateNavlistPrivate = (apiUrl) => {
    // console.log("generating navlistprivate");
    // Create elements
    let navbar = document.getElementById("navbar");

    let list = document.createElement("ul");
    list.classList.add("nav");
    list.id = "navlist-private";

    let list_1 = document.createElement("li");
    list_1.className = "nav-item loggedinas";
    let list_2 = document.createElement("li");
    list_2.className = "nav-item";

    let a1 = document.createElement("a");
    a1.innerText = "Logged in as user ";

    let a2 = document.createElement("a");
    a2.innerText = getUsername();
    a2.className = "logged-username";

    a2.onclick = () => {
        routeUser(apiUrl, a2.innerText);
    }

    list_1.appendChild(a1);
    list_1.appendChild(a2);

    let logout = logoutButton();
    logout.onclick = () => {
        clearSession();
        routeHome(apiUrl);
    }
    list_2.appendChild(logout);

    list.appendChild(list_1);
    list.appendChild(list_2);

    let logo = sedditLogo();
    logo.onclick = () => {
        routeHome(apiUrl);
    }

    // Set everything to navbar
    navbar.appendChild(logo);
    navbar.appendChild(list);
}

let setNavbar = (apiUrl) => {
    // Check if authed
    // If authed, check if the button is correct
    // If not authed, check if the button is correct

    let checkAuthed = checkLogged();
    let navbar = document.getElementById("navbar");

    // If navlist-pub exists, if the user is not authed then return
    if (document.getElementById("navlist-pub")) {
        if (!checkAuthed) return;
        // In case of switching, cleanup childs
        while (navbar.firstChild) {
            navbar.firstChild.remove();
        }
        generateNavlistPrivate(apiUrl);
    } else if (document.getElementById("navlist-private")) {
        // It's navlist private
        if (checkAuthed) return;
        while (navbar.firstChild) {
            navbar.firstChild.remove();
        }
        generateNavlistPub(apiUrl);
    } else {
        if (checkAuthed) {
            // Not authed
            while (navbar.firstChild) {
                navbar.firstChild.remove();
            }
            generateNavlistPrivate(apiUrl);
        } else {
            // Just authed
            while (navbar.firstChild) {
                navbar.firstChild.remove();
            }
            generateNavlistPub(apiUrl);
        }
    }


}


export default setNavbar;