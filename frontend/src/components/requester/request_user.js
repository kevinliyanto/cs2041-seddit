import { getToken } from "../storage/setlocalstorage.js";

async function getUser(apiUrl, username) {
    if (apiUrl == null) return null;

    let token = getToken();

    let settings = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': "Token " + token
        }
    };

    let data = await fetch(apiUrl + "/user/?username=" + username, settings)
        .then(handleError)
        .then(response => {
            return response.json();
        })
        .then(json => {
            // console.log(json);
            return json;
        })
        .catch(e => {
            return null;
        });

    return data;
}

function handleError(res) {
    if (!res.ok) {
        throw res;
    }
    return res;
}

export {
    getUser
};