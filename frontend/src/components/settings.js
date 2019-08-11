import setNavbar from "./navbar.js";
import { putUser } from "../requests.js";
import { modal_errors_load, modal_success_load, modalError_SetUser } from "./modal.js";
import { routeSettings } from "../route.js";
import { right_navigation } from "./rightpanel.js";

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
    let submit = document.createElement("button");
    submit.className = "submit-button";
    submit.innerText = "Submit";

    return submit;
}

let form = () => {
    let changeForm = document.createElement("div");
    changeForm.id = "login-form";
    changeForm.className = "leftpanel form";

    let signinText = document.createElement("h1");
    signinText.innerText = "Change user setting";

    let details = document.createElement("h3");
    details.innerText = "You need to change at least one details listed below. Field without any details will be ignored";

    let name = document.createElement("p");
    name.innerText = "Name";
    let nameForm = formInput("text", "name", "Change name");

    let passwordText = document.createElement("p");
    passwordText.innerText = "Password";
    let passForm = formInput("password", "password", "Change password");

    let emailText = document.createElement("p");
    emailText.innerText = "Email address";
    let email = formInput("email", "email", "Insert email");

    changeForm.appendChild(signinText);
    changeForm.appendChild(details);
    changeForm.appendChild(name);
    changeForm.appendChild(nameForm);
    changeForm.appendChild(document.createElement("br"));
    changeForm.appendChild(passwordText);
    changeForm.appendChild(passForm);
    changeForm.appendChild(document.createElement("br"));
    changeForm.appendChild(emailText);
    changeForm.appendChild(email);
    changeForm.appendChild(document.createElement("br"));
    changeForm.appendChild(document.createElement("br"));

    // Create button
    let submit = submitButton();
    submit.onclick = () => {
        submitForm();
    };

    changeForm.appendChild(submit);

    return changeForm;
}

let submitForm = () => {
    let name = document.getElementById("name");
    let password = document.getElementById("password");
    let email = document.getElementById("email");

    let payload = {};

    if (name.value != "") {
        payload.name = name.value;
    }
    if (password.value != "") {
        payload.password = password.value;
    }
    if (email.value != "") {
        payload.email = email.value;
    }

    console.log(payload);
    
    if (Object.keys(payload).length == 0) {
        modal_errors_load("Invalid submission", "You can't submit nothing");
        return;
    }


    putUser(payload)
        .then(() => {
            routeSettings();
            modal_success_load("Success", "Successfully modified user credentials");
        })
        .catch(() => {
            modalError_SetUser();
        });
}

let setSetting = () => {
    let main = document.getElementById("main");
    // Cleanup main
    while (main.firstChild) {
        main.firstChild.remove();
    }

    let formdiv = form();
    main.appendChild(formdiv);

    let right = document.createElement("div");
    right.className = "rightpanel";
    right.appendChild(right_navigation());
    main.appendChild(right);
}

let settingPage = () => {
    setNavbar();
    setSetting();
}

export {
    settingPage
}