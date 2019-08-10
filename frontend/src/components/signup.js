import setNavbar from "./navbar.js";
import { postSignup } from "../requests.js";
import { storeSession, fetchUserId, checkLogged } from "../localstorage.js";
import { routeHome } from "../route.js";
import { modal_errors_load } from "./modal.js";


let formInput = (type, name, placeholder) => {
    let form = document.createElement("input");
    form.type = type;
    form.className = "credentials-form";
    form.setAttribute("name", name);
    form.placeholder = placeholder;

    return form;
}

let submitButton = () => {
    let signup = document.createElement("button");
    signup.className = "submit-button";
    signup.innerText = "Submit";

    return signup;
}

let checkInput = () => {
    let valid = true;
    // Check email validity from re
    // Taken from https://emailregex.com/
    let message = "";

    let email = document.getElementsByName("email");
    if (email[0].value.length < 4) {
        message += "Invalid email address\n";
        valid = false;
    }

    let uname = document.getElementsByName("username");
    if (uname[0].value.length == 0) {
        message += "Invalid username length\n";
        valid = false;
    }

    let passw = document.getElementsByName("password");
    if (passw[0].value.length == 0) {
        message += "Invalid password length\n";
        valid = false;
    }
    if (passw[0].value !== passw[1].value) {
        message += "Password did not match up\n";
        valid = false;
    }

    let namec = document.getElementsByName("name");
    if (namec[0].value.length == 0) {
        message += "Invalid name length\n";
        valid = false;
    }

    if (!valid) {
        showModal(message);
    }
    return valid;
}

let showModal = (message) => {
    modal_errors_load("Signup error", message);
}

let setSignup = () => {
    let signupSection = document.createElement("div");
    signupSection.id = "login-form";
    signupSection.className = "form";

    let signinText = document.createElement("h1");
    signinText.innerText = "Sign up";

    // Form format: type, id
    let usernameText = document.createElement("p");
    usernameText.innerText = "Username";
    let userForm = formInput("text", "username", "Insert username");
    let passwordText = document.createElement("p");
    passwordText.innerText = "Password";
    let passForm = formInput("password", "password", "Insert password");
    let passwordText2 = document.createElement("p");
    passwordText2.innerText = "Repeat password";
    let passForm2 = formInput("password", "password", "Insert password again");
    let emailText = document.createElement("p");
    emailText.innerText = "Email address";
    let email = formInput("email", "email", "Insert email");
    let nameText = document.createElement("p");
    nameText.innerText = "Name";
    let name = formInput("text", "name", "Insert your name");


    signupSection.appendChild(signinText);
    signupSection.appendChild(usernameText);
    signupSection.appendChild(userForm);
    signupSection.appendChild(document.createElement("br"));
    signupSection.appendChild(passwordText);
    signupSection.appendChild(passForm);
    signupSection.appendChild(document.createElement("br"));
    signupSection.appendChild(passwordText2);
    signupSection.appendChild(passForm2);
    signupSection.appendChild(document.createElement("br"));
    signupSection.appendChild(emailText);
    signupSection.appendChild(email);
    signupSection.appendChild(document.createElement("br"));
    signupSection.appendChild(nameText);
    signupSection.appendChild(name);
    signupSection.appendChild(document.createElement("br"));

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

    passForm2.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit();
        }
    });

    email.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit();
        }
    });

    name.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit();
        }
    });

    // Create button
    let signup = submitButton();
    signup.onclick = () => {
        submit();
    };
    signupSection.appendChild(signup);


    let main = document.getElementById("main");
    while (main.firstChild) {
        main.firstChild.remove();
    }
    main.appendChild(signupSection);
}

let submit = () => {
    let validInput = checkInput();

    let uname = document.getElementsByName("username");
    let passw = document.getElementsByName("password");
    let emailArray = document.getElementsByName("email");
    let namec = document.getElementsByName("name");

    if (validInput) {
        // Sign up

        let username = uname[0].value;
        let password = passw[0].value;
        let email = emailArray[0].value;
        let name = namec[0].value;

        let payload = {
            "username": username,
            "password": password,
            "email": email,
            "name": name
        }

        console.log(payload);

        postSignup(payload)
            .then((res) => {
                storeSession(username, res.token);
                fetchUserId();
                routeHome();
            })
            .catch((err) => {
                showModal(err);
            });
    }
}

let signupPage = () => {

    if (checkLogged()) {
        routeHome();
    }

    setNavbar();
    setSignup();
}

export default signupPage;