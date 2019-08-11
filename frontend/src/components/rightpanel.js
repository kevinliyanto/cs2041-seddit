import {
    checkLogged,
    getUsername
} from "../localstorage.js";
import {
    routeSubmit,
    routeHome,
    routeUser,
    routeLogin,
    routeSignup,
    routeSettings,
    refresh
} from "../route.js";

let right_navigation = () => {
    let all = document.createElement("div");
    all.className = "right-content";

    let title = document.createElement("div");
    title.innerText = "Navigation bar";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "6px";
    all.appendChild(title);

    let button_home = document.createElement("button");
    button_home.className = "nav-button";
    button_home.innerText = "Home";
    button_home.onclick = () => {
        routeHome();
    }
    all.appendChild(button_home);

    let button_refresh = document.createElement("button");
    button_refresh.className = "nav-button";
    button_refresh.innerText = "Refresh page";
    button_refresh.onclick = () => {
        refresh();
    }
    all.appendChild(button_refresh);

    if (checkLogged()) {
        let button_newpost = document.createElement("button");
        button_newpost.className = "nav-button";
        button_newpost.innerText = "Submit new post";
        button_newpost.onclick = () => {
            routeSubmit();
        }

        let button_user = document.createElement("button");
        button_user.className = "nav-button";
        button_user.innerText = "Profile";
        button_user.onclick = () => {
            routeUser(getUsername());
        }

        let button_setting = document.createElement("button");
        button_setting.className = "nav-button";
        button_setting.innerText = "User Setting";
        button_setting.onclick = () => {
            routeSettings();
        }

        all.appendChild(button_newpost);
        all.appendChild(button_user);
        all.appendChild(button_setting);

        let search = document.createElement("input");
        search.placeholder = "Search Seddit";
        search.className = "nav-search";
        search.addEventListener('keypress', event => {
            let key = event.keyCode;
            if (key === 13) {
                searchSeddit(search.value);
            }
        });

        all.appendChild(search);
    } else {
        let login = document.createElement("button");
        login.className = "nav-button button-primary";
        login.innerText = "Login";
        login.setAttribute("data-id-login", "");
        login.onclick = () => {
            routeLogin();
        }

        let signup = document.createElement("button");
        signup.className = "nav-button button-secondary";
        signup.innerText = "Signup";
        signup.setAttribute("data-id-signup", "");
        signup.onclick = () => {
            routeSignup();
        }

        all.appendChild(login);
        all.appendChild(signup);
    }

    

    return all;
}

let right_welcome = () => {

}

let searchSeddit = (string) => {
    console.log(string);
}

export {
    searchSeddit,
    right_navigation
};