import loginPage from "../login.js";
import signupPage from "../signup.js";

async function postLogin (apiUrl, username, password){
    if (apiUrl == null) return null;

    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    };
    
    let data = await fetch(apiUrl + "/auth/login", settings)
        .then(handleError)
        .then(response => response.json())
        .then(json => {
            return json;
        })
        .catch(e => {
            throw e;
        });
    
    return data;
}

async function postSignup (apiUrl, username, password, email, name){
    if (apiUrl == null) return null;

    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password,
            "email": email,
            "name": name
        })
    };
    
    let data = await fetch(apiUrl + "/auth/signup", settings)
        .then(handleError)
        .then(response => response.json())
        .then(json => {
            return json;
        })
        .catch(e => {
            throw e;
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
    postLogin,
    postSignup
};
