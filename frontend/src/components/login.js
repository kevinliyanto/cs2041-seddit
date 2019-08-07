import setNavbar from './sub/navbar.js';
import { postLogin } from './requester/request_auth.js';
import { storeSession, setLastPage, setUserID } from './storage/setlocalstorage.js';
import { routeHome } from '../router/route.js';
import { setUserRequest } from './requester/request_user.js';
import { errorModal } from './sub/modal.js';


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
    if (uname[0].value.length == 0 || passw[0].value.length == 0){
        showModal("Invalid input");
        return false;
    }
    return true;
}

let showModal = (message) => {
    errorModal("Login error", message);
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
        submit(apiUrl);
    };

    userForm.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit(apiUrl);
        }
    });

    passForm.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit(apiUrl);
        }
    });

    loginSection.appendChild(login);

    let main = document.getElementById("main");
    while (main.firstChild){
        main.firstChild.remove();
    }
    main.appendChild(loginSection);
}

let submit = (apiUrl) => {
    let validInput = checkInput();

    if (validInput){
        // Login
        let uname = document.getElementsByName("username");
        let username = uname[0].value;
        let passw = document.getElementsByName("password");
        let password = passw[0].value;
        postLogin(apiUrl, username, password)
            .then((res) => {
                storeSession(username, res.token);
                setUserRequest(apiUrl);
                routeHome(apiUrl);
            })
            .catch((err) => {
                let no = 'Error ' + err.status + ': ';
                console.log(err);
                //alert(no + err.statusText);
                showModal(no + err.statusText);
            });
    }
}

let loginPage = (apiUrl) => {
    setLastPage("#login");
    setNavbar(apiUrl);
    setLogin(apiUrl);
}

export default loginPage;