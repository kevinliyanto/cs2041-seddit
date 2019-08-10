import { modal_errors_load } from "./components/modal.js";
import homePage from "./components/home.js";
import signupPage from "./components/signup.js";
import loginPage from "./components/login.js";
import { userPage, userPageId } from "./components/user.js";
import { checkLogged } from "./localstorage.js";
import { expandedPost } from "./components/expandedpost.js";
import { submitPage } from "./components/submit.js";

// TODO


let routeHome = () => {
    history.replaceState(null, null, document.location.pathname + '#home')
    homePage();
}

let routeSignup = () => {
    // console.log("entering signup");
    if (checkLogged()) {
        homePage();
        modal_errors_load("Error", "You are already logged in");
        return;
    }
    history.replaceState(null, null, document.location.pathname + '#signup')
    signupPage();
}

let routeLogin = () => {
    // console.log("entering login");
    if (checkLogged()) {
        homePage();
        modal_errors_load("Error", "You are already logged in");
        return;
    }
    history.replaceState(null, null, document.location.pathname + '#login')
    loginPage();
}

let routeUser = (user) => {
    history.replaceState(null, null, document.location.pathname + '#u/' + user);
    userPage(user);
}

let routeUserId = (id) => {
    history.replaceState(null, null, document.location.pathname + '#profile=' + id);
    userPageId(id);
}

let routeExpandedPost = (id) => {
    history.replaceState(null, null, document.location.pathname + '#feed=' + id);
    expandedPost(id);
}

let routeSettings = () => {

}

let routeSubmit = () => {
    history.replaceState(null, null, document.location.pathname + '#submit');
    submitPage();
}

let routeSubseddit = (subseddit) => {

}

let routeInvalid = () => {
    
}

let routes = () => {
    switch (location.hash) {
        case '#login':
            routeLogin();
            break;
        case '#signup':
            routeSignup();
            break;
        case '#home':
        case '#feed':
        case '':
            routeHome();
            break;
        case '#setting':
        case '#settings':
            routeSettings();
            break;
        case '#submit':
            routeSubmit();
            break;
        default:
            // Check hash if it has the valid tags: /#s/ or /#u/ 
            // or /#profile=\d+ or /#feed=\d+
            if (checkHashUser(location.hash)) {
                let re = /^#u\/(\w+)$/;
                let p = location.hash.match(re);
                routeUser(p[1]);
            } else if (checkHashUserId(location.hash)) {
                let re = /^#profile\=(\d+)$/;
                let p = location.hash.match(re);
                routeUserId(p[1]);
            } else if (checkHashSubseddit(location.hash)) {
                let re = /^#s\/\:?(\w+)$/;
                let p = location.hash.match(re);
                routeSubseddit(p[1]);
            } else if (checkHashFeed(location.hash)) {
                let re = /^#feed\=(\d+)$/;
                let p = location.hash.match(re);
                routeExpandedPost(p[1]);
            } else {
                routeInvalid();
            }
            break;
    }

}

let firstRoute = () => {
    // Change hash when there is no route provided
    if (location.hash == '')
        history.replaceState(null, null, document.location.pathname + '#');
    
    initHashListener();
    routes();
}

let checkHashUser = (hash) => {
    let re = /^#u\/\w+$/;
    return re.test(hash);
}

let checkHashUserId = (hash) => {
    let re = /^#profile\=\d+$/;
    return re.test(hash);
}

let checkHashSubseddit = (hash) => {
    let re = /^#s\/\:?\w+/;
    return re.test(hash);
}

let checkHashFeed = (hash) => {
    let re = /^#feed\=\d+$/;
    return re.test(hash);
}

let initHashListener = () => {
    window.addEventListener("hashchange", (event) => {
        routes();
    });
}

export {
    routeHome,
    routeSignup,
    routeLogin,
    routeUser,
    routeUserId,
    routeExpandedPost,
    routeSettings,
    routeSubmit,
    routeSubseddit,
    routeInvalid,
    firstRoute
};