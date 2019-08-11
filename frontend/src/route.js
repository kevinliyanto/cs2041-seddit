import {
    modal_errors_load
} from "./components/modal.js";
import homePage from "./components/home.js";
import signupPage from "./components/signup.js";
import loginPage from "./components/login.js";
import {
    userPage,
    userPageId
} from "./components/user.js";
import {
    checkLogged,
    getLastVisited,
    setLastVisited
} from "./localstorage.js";
import {
    expandedPost
} from "./components/expandedpost.js";
import {
    submitPage
} from "./components/submit.js";
import {
    editPost
} from "./components/edit.js";
import {
    settingPage
} from "./components/settings.js";

// TODO


let routeHome = () => {
    // console.log("home visited");
    history.replaceState(null, null, document.location.pathname + '#home')
    homePage();
    storeLastVisited();
}

let routeSignup = () => {
    // console.log("entering signup");
    if (checkLogged()) {
        routeLastVisited();
        modal_errors_load("Error", "You are already logged in");
        return;
    }
    history.replaceState(null, null, document.location.pathname + '#signup')
    signupPage();
    storeLastVisited();
}

let routeLogin = () => {
    // console.log("entering login");
    if (checkLogged()) {
        routeLastVisited();
        modal_errors_load("Error", "You are already logged in");
        return;
    }
    history.replaceState(null, null, document.location.pathname + '#login')
    loginPage();
    storeLastVisited();
}

let routeUser = (user) => {
    // console.log("user visited");
    if (!checkLogged()) {
        routeLastVisited();
        modal_errors_load("Error", "You are not logged in yet");
        return;
    }
    history.replaceState(null, null, document.location.pathname + '#u/' + user);
    userPage(user);
    storeLastVisited();
}

let routeUserId = (id) => {
    if (!checkLogged()) {
        routeLastVisited();
        modal_errors_load("Error", "You are not logged in yet");
        return;
    }
    history.replaceState(null, null, document.location.pathname + '#profile=' + id);
    userPageId(id);
    storeLastVisited();
}

let routeExpandedPost = (id) => {
    if (!checkLogged()) {
        routeLastVisited();
        modal_errors_load("Error", "You are not logged in yet");
        return;
    }
    history.replaceState(null, null, document.location.pathname + '#feed=' + id);
    expandedPost(id);
    storeLastVisited();
}

let routeEditPost = (id) => {
    if (!checkLogged()) {
        routeLastVisited();
        modal_errors_load("Error", "You are not logged in yet");
        return;
    }
    history.replaceState(null, null, document.location.pathname + '#feed=' + id + "/edit");
    editPost(id);
    storeLastVisited();
}

let routeSettings = () => {
    if (!checkLogged()) {
        routeLastVisited();
        modal_errors_load("Error", "You are not logged in yet");
        return;
    }
    history.replaceState(null, null, document.location.pathname + '#settings');
    settingPage();
    storeLastVisited();
}

let routeSubmit = () => {
    if (!checkLogged()) {
        routeLastVisited();
        modal_errors_load("Error", "You are not logged in yet");
        return;
    }
    history.replaceState(null, null, document.location.pathname + '#submit');
    submitPage();
    storeLastVisited();
}

let routeSubseddit = (subseddit) => {

}

let routeInvalid = () => {
    routeLastVisited();
    modal_errors_load("Error", "Invalid page");
}

let routes = () => {
    if (!checkLogged()) {
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
            default:
                routeLastVisited();
                modal_errors_load("Error", "You are not logged in yet");
                break;
        }
    } else {
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
                    let re = /^#u\/(\w+)\/?$/;
                    let p = location.hash.match(re);
                    routeUser(p[1]);
                } else if (checkHashUserId(location.hash)) {
                    let re = /^#profile\=(\d+)\/?$/;
                    let p = location.hash.match(re);
                    routeUserId(p[1]);
                } else if (checkHashSubseddit(location.hash)) {
                    let re = /^#s\/\:?(\w+)\/?$/;
                    let p = location.hash.match(re);
                    routeSubseddit(p[1]);
                } else if (checkHashFeed(location.hash)) {
                    let re = /^#feed\=(\d+)\/?$/;
                    let p = location.hash.match(re);
                    routeExpandedPost(p[1]);
                } else if (checkHashFeedEdit(location.hash)) {
                    let re = /^#feed\=(\d+)\/edit\/?$/;
                    let p = location.hash.match(re);
                    routeEditPost(p[1]);
                } else {
                    routeInvalid();
                }
                break;
        }
    }

}

let storeLastVisited = () => {
    setLastVisited(location.hash);
}

let routeLastVisited = () => {
    history.replaceState(null, null, document.location.pathname + getLastVisited());
    routes();
}

let firstRoute = () => {
    // Change hash when there is no route provided
    if (location.hash == '')
        history.replaceState(null, null, document.location.pathname + '#');

    initHashListener();
    routes();
}

let checkHashUser = (hash) => {
    let re = /^#u\/\w+\/?$/;
    return re.test(hash);
}

let checkHashUserId = (hash) => {
    let re = /^#profile\=\d+\/?$/;
    return re.test(hash);
}

let checkHashSubseddit = (hash) => {
    let re = /^#s\/\:?\w+\/?$/;
    return re.test(hash);
}

let checkHashFeed = (hash) => {
    let re = /^#feed\=\d+\/?$/;
    return re.test(hash);
}

let checkHashFeedEdit = (hash) => {
    let re = /^#feed\=\d+\/edit\/?$/;
    return re.test(hash);
}

let initHashListener = () => {
    window.addEventListener("hashchange", (event) => {
        routes();
    });
}

let refresh = () => {
    routes();
}

export {
    routeHome,
    routeSignup,
    routeLogin,
    routeUser,
    routeUserId,
    routeExpandedPost,
    routeEditPost,
    routeSettings,
    routeSubmit,
    routeSubseddit,
    routeInvalid,
    refresh,
    routeLastVisited,
    firstRoute
};