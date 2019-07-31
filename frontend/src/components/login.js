import setNavbar from './sub/navbar.js';
import { postLogin } from './requester/request_auth.js';
import { storeSession } from './storage/setlocalstorage.js';
import { routeHome } from '../router/route.js';


let formInput = (type, name, placeholder) => {
    let form = document.createElement("input");
    form.type = type;
    form.className = "credentials-form";
    form.id = name;
    form.setAttribute("name", name);
    form.placeholder = placeholder;

    return form;
}

let submitButton = () => {
    let login = document.createElement("button");
    login.className = "submit-button";
    login.innerText = "Submit";
    return login;
}

let checkInput = () => {
    let uname = document.getElementsByName("username");
    let passw = document.getElementsByName("password");
    if (uname[0].value.length == 0 && passw[0].value.length == 0){
        showModal("Invalid input");
        return false;
    }
    return true;
}

let showModal = (message) => {
    console.log("show modal: " + message);
    // Check how many modals are there
    let existing = document.getElementsByClassName("modal");
    let id = existing.length;

    let modal = document.createElement("div");
    modal.className = "modal";
    modal.id = id;
    
}

let setLogin = (apiUrl) => {
    let loginSection = document.createElement("div");
    loginSection.id = "login-form";
    loginSection.className = "form";

    let signinText = document.createElement("h1");
    signinText.innerText = "Sign in";
    let usernameText = document.createElement("p");
    usernameText.innerText = "Username";
    let userForm = formInput("text", "username", "Insert username");
    let passwordText = document.createElement("p");
    passwordText.innerText = "Password";
    let passForm = formInput("password", "password", "Insert password");

    loginSection.appendChild(signinText);
    loginSection.appendChild(usernameText);
    loginSection.appendChild(userForm);
    loginSection.appendChild(document.createElement("br"));
    loginSection.appendChild(passwordText);
    loginSection.appendChild(passForm);
    loginSection.appendChild(document.createElement("br"));

    // Create button
    let login = submitButton();
    login.onclick = () => {
        let validInput = checkInput();
        if (validInput){
            // Login
            postLogin(apiUrl, userForm.value, passForm.value)
                .then(res => console.log(res))
                .then((token) => {
                    storeSession(userForm.value, token);
                    routeHome(apiUrl);
                })
                .catch((err) => {
                    let no = 'Error ' + err.status + ': ';
                    console.log(err);
                    alert(no + err.statusText);
                });
        }
    }
    loginSection.appendChild(login);

    let main = document.getElementById("main");
    while (main.firstChild){
        main.firstChild.remove();
    }
    main.appendChild(loginSection);
}


let loginPage = (apiUrl) => {
    // console.log("loginpage");

    // Check if authed
    // If authed, go back to home page
    // If not authed, generate navbar and set up the main

    setNavbar(apiUrl);
    setLogin(apiUrl);
}

export default loginPage;