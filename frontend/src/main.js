/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import { initRoute, routeRegister, firstRoute } from './router/route.js';
import defaultPage from './components/default.js';
import { getLastPage } from './components/storage/setlocalstorage.js';
import { errorModal } from './components/sub/modal.js';


// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
    // your app initialisation goes here   

    // generate default page
    initRoute(apiUrl);
    defaultPage();

    firstRoute(apiUrl);

    // errorModal("This is from main.js\nPlease remove when you're done.");
}

export default initApp;