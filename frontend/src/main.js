import { setApiUrl } from "./localstorage.js";
import { firstRoute, routeHome } from "./route.js";
import loadDefault from "./components/default.js";

/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.


// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
    // your app initialisation goes here   
    setApiUrl(apiUrl);
    loadDefault();
    firstRoute();
}

export default initApp;