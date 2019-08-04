let storeSession = (username, token) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
}

let getUsername = () => {
    return localStorage.getItem('username');
}

let getToken = () => {
    return localStorage.getItem('token');
}

let setLastPage = (url) => {
    localStorage.setItem('last', url);
}

let getLastPage = () => {
    let last = localStorage.getItem('last');
    if (last == null) last = "#home";
    return last;
}

let clearSession = () => {
    localStorage.clear();
}

let checkLogged = () => {
    if (localStorage.getItem('username')) return true;
    return false;
}


let updateUserLocale = () => {
    // Needed to get users data
    // Needs to be updated on every action involving the user
}

let getUserLocale = () => {
    // returns user locale which will be parsed by each commands
}

export {
    storeSession,
    getUsername,
    getToken,
    setLastPage,
    getLastPage,
    clearSession,
    checkLogged,
    updateUserLocale,
    getUserLocale
};