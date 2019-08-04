import { getToken } from "../storage/setlocalstorage.js";

async function getPublicPost(apiUrl) {
    if (apiUrl == null) return null;

    let settings = {
        method: 'GET'
    };

    let data = await fetch(apiUrl + "/post/public", settings)
        .then(response => response.json())
        .then(json => {
            return json;
        })
        .catch(e => {
            return e;
        });

    return data;
}

async function getPrivatePost(apiUrl, p, n) {
    if (apiUrl == null) return null;

    let token = getToken();

    let settings = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': "Token " + token
        }
    };

    let data = await fetch(apiUrl + "/user/feed?p=" + p + "&n=" + n, settings)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(json => {
            return json;
        })
        .catch(e => {
            return e;
        });

    return data;
}

export {
    getPublicPost,
    getPrivatePost
};