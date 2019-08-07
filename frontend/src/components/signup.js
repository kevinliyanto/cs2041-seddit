import setNavbar from './sub/navbar.js';
import {
    postSignup
} from './requester/request_auth.js';
import {
    storeSession,
    setLastPage
} from './storage/setlocalstorage.js';
import {
    routeHome
} from '../router/route.js';
import { errorModal } from './sub/modal.js';

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
    errorModal("Signup error", message);
}

let setSignup = (apiUrl) => {
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
            submit(apiUrl);
        }
    });

    passForm.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit(apiUrl);
        }
    });

    passForm2.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit(apiUrl);
        }
    });

    email.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit(apiUrl);
        }
    });

    name.addEventListener('keypress', event => {
        let key = event.keyCode;
        if (key === 13){
            submit(apiUrl);
        }
    });

    // Create button
    let signup = submitButton();
    signup.onclick = () => {
        submit(apiUrl);
    };
    signupSection.appendChild(signup);


    let main = document.getElementById("main");
    while (main.firstChild) {
        main.firstChild.remove();
    }
    main.appendChild(signupSection);
}

let submit = (apiUrl) => {
    let validInput = checkInput();

    let uname = document.getElementsByName("username");
    let passw = document.getElementsByName("password");
    let email = document.getElementsByName("email");
    let namec = document.getElementsByName("name");
    if (validInput) {
        // Sign up
        postSignup(apiUrl, uname[0].value, passw[0].value, email[0].value, namec[0].value)
            .then((res) => {
                storeSession(userForm.value, res.token);
                setUserRequest(apiUrl);
                routeHome(apiUrl);
            })
            .catch((err) => {
                let no = 'Error ' + err.status + ': ';
                console.log(err);
                // alert(no + err.statusText);
                showModal(no + err.statusText);
            });
    }
}

let signupPage = (apiUrl) => {
    setLastPage("#signup");
    setNavbar(apiUrl);
    setSignup(apiUrl);
}

export default signupPage;