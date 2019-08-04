import loginPage from '../components/login.js';
import homePage from '../components/home.js';
import signupPage from '../components/signup.js';
import invalidPage from '../components/invalid.js';
import userPage from '../components/user.js';

let routeHome = (apiUrl) => {
    // console.log("entering home");
    history.replaceState(null, null, document.location.pathname + '#home')
    homePage(apiUrl);
}

let routeRegister = (apiUrl) => {
    // console.log("entering signup");
    history.replaceState(null, null, document.location.pathname + '#signup')
    signupPage(apiUrl);
}

let routeLogin = (apiUrl) => {
    // console.log("entering login");
    history.replaceState(null, null, document.location.pathname + '#login')
    loginPage(apiUrl);
}

let routeUser = (apiUrl, user) => {
    history.replaceState(null, null, document.location.pathname + '#u/' + user);
    userPage(apiUrl, user);
}

let routeInvalid = (apiUrl) => {
    // console.log("entering invalid");
    invalidPage(apiUrl);
}

let routes = (event, apiUrl) => {
    switch (location.hash) {
        case '#login':
            routeLogin(apiUrl);
            break;
        case '#signup':
            routeRegister(apiUrl);
            break;
        case '#home':
        case '':
            routeHome(apiUrl);
            break;
        default:
            // Check hash if it has the valid tag (/s/ or /u/)
            if (checkHashUser(location.hash)) {
                let re = /^#u\/(.+)$/;
                let p = location.hash.match(re);
                routeUser(apiUrl, p[1]);
            } else {
                routeInvalid(apiUrl);
            }
            break;
    }

}

let checkHashUser = (hash) => {
    let re = /^#u\/.+/;
    return re.test(hash);
}

let initRoute = (apiUrl) => {

    window.addEventListener("hashchange", (event) => {
        routes(event, apiUrl);
    });
}

export {
    routeHome,
    routeRegister,
    routeLogin,
    initRoute
};