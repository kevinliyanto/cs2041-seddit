import loginPage from '../components/login.js';
import homePage from '../components/home.js';
import signupPage from '../components/signup.js';
import invalidPage from '../components/invalid.js';

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
            // Check hash if it has the valid tag (/s/)
            routeInvalid(apiUrl);
            break;
    }

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