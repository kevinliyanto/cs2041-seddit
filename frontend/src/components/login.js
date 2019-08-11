import { postLogin } from "../requests.js";
import { storeSession, fetchUserId, checkLogged } from "../localstorage.js";
import setNavbar from "./navbar.js";
import { routeHome } from "../route.js";
import { right_navigation } from "./rightpanel.js";
import { modalError_Login } from "./modal.js";

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

let submit = () => {
    let validInput = checkInput();

    if (validInput){
        // Login
        let uname = document.getElementsByName("username");
        let username = uname[0].value;
        let passw = document.getElementsByName("password");
        let password = passw[0].value;

        let payload = {
            "username": username,
            "password": password
        }

        postLogin(payload)
            .then((res) => {
                storeSession(username, res.token);
                fetchUserId();
                routeHome();
            })
            .catch((err) => {
                modalError_Login();
            });
    }
}

let setLogin = () => {
    let loginSection = document.createElement("div");
    loginSection.id = "login-form";
    loginSection.className = "leftpanel form";

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
    loginSection.appendChild(document.createElement("br"));

    // Create button
    let login = submitButton();
    login.onclick = () => {
        submit();
    };

    userForm.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit();
        }
    });

    passForm.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit();
        }
    });

    loginSection.appendChild(login);

    let main = document.getElementById("main");
    while (main.firstChild){
        main.firstChild.remove();
    }
    main.appendChild(loginSection);

    let rightpanel = document.createElement("div");
    rightpanel.id = "rightpanel";
    rightpanel.className = "rightpanel";
    let right = right_navigation();
    rightpanel.appendChild(right);
    main.appendChild(rightpanel);
}

let loginPage = () => {
    setNavbar();
    setLogin();
}

export default loginPage;