import {
    getApiUrl,
    getToken
} from "./localstorage.js";

// In any failed response, catch will give a reject of status number
function checkresponse(res) {
    if (res.status !== 200) {
        throw res.status;
    }

    return res;
}

function getPost(id) {
    let apiUrl = getApiUrl();
    let token = getToken();

    let settings = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': "Token " + token
        }
    };

    let result = fetch(apiUrl + "/post/?id=" + id, settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

// Payload must be in a non-stringified JSON
function putPost(payload, id) {
    let apiUrl = getApiUrl();
    let token = getToken();

    let settings = {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + token
        },
        body: JSON.stringify(payload)
    };

    let result = fetch(apiUrl + "/post/?id=" + id, settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function deletePost(id) {
    let apiUrl = getApiUrl();
    let token = getToken();

    let settings = {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'Authorization': "Token " + token
        }
    };

    let result = fetch(apiUrl + "/post/?id=" + id, settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function postPost(payload) {
    let apiUrl = getApiUrl();
    let token = getToken();

    let settings = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + token
        },
        body: JSON.stringify(payload)
    };

    let result = fetch(apiUrl + "/post/", settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            console.error(e);
            throw e;
        });

    return result;
}

function putComment(payload, id) {
    let apiUrl = getApiUrl();
    let token = getToken();

    let settings = {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + token
        },
        body: JSON.stringify(payload)
    };

    let result = fetch(apiUrl + "/post/comment?id=" + id, settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function getPublic() {
    let apiUrl = getApiUrl();

    let settings = {
        method: 'GET'
    };

    let result = fetch(apiUrl + "/post/public", settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function deleteVote(id) {
    let apiUrl = getApiUrl();
    let token = getToken();

    let settings = {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'Authorization': "Token " + token
        }
    };

    let result = fetch(apiUrl + "/post/vote?id=" + id, settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function putVote(id) {
    let apiUrl = getApiUrl();
    let token = getToken();

    let settings = {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Authorization': "Token " + token
        }
    };

    let result = fetch(apiUrl + "/post/vote?id=" + id, settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function postLogin(payload) {
    let apiUrl = getApiUrl();

    let settings = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    let result = fetch(apiUrl + "/auth/login", settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function postSignup(payload) {
    let apiUrl = getApiUrl();

    let settings = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    let result = fetch(apiUrl + "/auth/signup", settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function getUser(username, id) {
    let apiUrl = getApiUrl() + "/user/";
    let token = getToken();

    let settings = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': "Token " + token
        }
    };

    if (username != "") {
        apiUrl += "?username=" + username;
        if (id != "") {
            apiUrl += "&id=" + id;
        }
    } else if (id != "") {
        apiUrl += "?id=" + id;
    }

    let result = fetch(apiUrl, settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function getUserByUsername(username) {
    return getUser(username, "");
}

function getUserById(id) {
    return getUser("", id);
}

function getCurrentUser() {
    return getUser("", "");
}

function putUser(payload) {
    let apiUrl = getApiUrl();
    let token = getToken();

    let settings = {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Token " + token
        },
        body: JSON.stringify(payload)
    };

    let result = fetch(apiUrl + "/user/", settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function getUserFeed(p, n) {
    let apiUrl = getApiUrl() + "/user/feed";
    let token = getToken();

    let settings = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': "Token " + token
        }
    };

    if (p != "") {
        apiUrl += "?p=" + p;
        if (n != "") {
            apiUrl += "&n=" + n;
        }
    } else if (n != "") {
        apiUrl += "?n=" + n;
    }

    let result = fetch(apiUrl, settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function putFollow(username) {
    let apiUrl = getApiUrl();
    let token = getToken();

    let settings = {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Authorization': "Token " + token
        }
    };

    let result = fetch(apiUrl + "/user/follow?username=" + username, settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

function putUnfollow(username) {
    let apiUrl = getApiUrl();
    let token = getToken();

    let settings = {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Authorization': "Token " + token
        }
    };

    let result = fetch(apiUrl + "/user/unfollow?username=" + username, settings)
        .then(checkresponse)
        .then(res => {
            return res.json();
        })
        .catch(e => {
            throw e;
        });

    return result;
}

export {
    getPost,
    putPost,
    deletePost,
    postPost,
    putComment,
    getPublic,
    deleteVote,
    putVote,
    postLogin,
    postSignup,
    getUserByUsername,
    getUserById,
    getCurrentUser,
    putUser,
    getUserFeed,
    putFollow,
    putUnfollow
}