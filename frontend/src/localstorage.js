import { getUserByUsername } from "./requests.js";
import { modalError_GetUser } from "./components/modal.js";

function setApiUrl(apiUrl) {
    localStorage.setItem('apiUrl', apiUrl);
}

function getApiUrl() {
    let apiUrl = localStorage.getItem('apiUrl');
    if (apiUrl == null) {
        console.error("Can't get apiUrl from localstorage. This should not happen.");
        return "";
    }
    return apiUrl;
}

function storeSession(username, token) {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
}

function fetchUserId() {
    getUserByUsername(localStorage.getItem('username'))
        .then((res) => {
            // console.log(res);
            localStorage.setItem('id', res.id);
        })
        .catch((e) => {
            modalError_GetUser();
        });
}

function getUserId() {
    return new Promise(function (resolve) {
        (function waitId(){
            if (localStorage.getItem('id')) return resolve(localStorage.getItem('id'));
            setTimeout(waitId, 100);
        })();
    });
}

function getUsername() {
    let username = localStorage.getItem('username');
    if (username == null) {
        return "";
    }
    return username;
}

function getToken() {
    let token = localStorage.getItem('token');
    if (token == null) {
        return null;
    }
    return token;
}

function checkLogged() {
    let token = localStorage.getItem('token');
    if (token == null) {
        return false;
    }
    return true;
}

function setLastVisited(hash) {
    let last = localStorage.getItem('lastVisited');
    if (last != null) {
        localStorage.setItem('previousVisited', last);
    }
    localStorage.setItem('lastVisited', hash);
}

function getPreviousVisited() {
    let prev = localStorage.getItem('previousVisited');
    if (prev == null) {
        return "";
    }
    return prev;
}

function getLastVisited() {
    let last = localStorage.getItem('lastVisited');
    if (last == null) {
        return "";
    }
    return last;
}

function clearCreds() {
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    localStorage.removeItem('token');
}

export {
    setApiUrl,
    getApiUrl,
    storeSession,
    fetchUserId,
    getUserId,
    getUsername,
    getToken,
    checkLogged,
    setLastVisited,
    getPreviousVisited,
    getLastVisited,
    clearCreds
};