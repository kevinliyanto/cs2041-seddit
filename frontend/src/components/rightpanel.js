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
    refresh,
    routeSearch,
    routeInfinite,
    routePrevious
} from "../route.js";

let right_navigation = () => {
    let all = document.createElement("div");
    all.className = "right-content";

    let title = document.createElement("div");
    title.innerText = "Navigation bar";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "6px";
    all.appendChild(title);

    let search = document.createElement("input");
    search.placeholder = "Quick search";
    search.className = "nav-search";
    all.appendChild(search);

    let s = checkLogged();
    if (s) {
        search.addEventListener('keypress', event => {
            let key = event.keyCode;
            if (key === 13) {
                if (search.value.length != 0)
                    routeSearch(search.value);
            }
        });
    }
    
    let button_home = document.createElement("button");
    button_home.className = "nav-button";
    button_home.innerText = "Home";
    button_home.onclick = () => {
        routeHome();
    }
    all.appendChild(button_home);

    if (s) {
        let button_search = document.createElement("button");
        button_search.className = "nav-button";
        button_search.innerText = "Search";
        button_search.onclick = () => {
            routeSearch("");
        }

        let button_all = document.createElement("button");
        button_all.className = "nav-button";
        button_all.innerText = "Infinite wall";
        button_all.onclick = () => {
            routeInfinite();
        }

        let button_newpost = document.createElement("button");
        button_newpost.className = "nav-button";
        button_newpost.innerText = "Submit new post";
        button_newpost.onclick = () => {
            routeSubmit();
        }

        let button_user = document.createElement("button");
        button_user.className = "nav-button nav-button-3";
        button_user.innerText = "Profile";
        button_user.onclick = () => {
            routeUser(getUsername());
        }

        let button_setting = document.createElement("button");
        button_setting.className = "nav-button nav-button-3";
        button_setting.innerText = "User Setting";
        button_setting.onclick = () => {
            routeSettings();
        }

        all.appendChild(button_search);
        all.appendChild(button_all);
        all.appendChild(button_newpost);
        all.appendChild(button_user);
        all.appendChild(button_setting);

        let button_back = document.createElement("button");
        button_back.className = "nav-button nav-button-2";
        button_back.innerText = "Go back";
        button_back.onclick = () => {
            routePrevious();
        }
        all.appendChild(button_back);

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

    let button_refresh = document.createElement("button");
    button_refresh.className = "nav-button nav-button-2";
    button_refresh.innerText = "Refresh page";
    button_refresh.onclick = () => {
        refresh();
    }
    all.appendChild(button_refresh);

    return all;
}

let right_button = () => {
    let button = document.createElement("button");
    button.innerText = "Back to top";
    button.id = "backtotopbutton";
    button.className = "button-back";
    button.onclick = () => {
        window.scrollTo(0, 0);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    });
    return button;
}

let setBackButton = () => {
    let s = document.getElementById("backtotopbutton");
    if (s == null)
        document.body.appendChild(right_button());
}

let welcome = () => {
    let all = document.createElement("div");
    all.className = "subseddit-welcome";

    let h3 = document.createElement("h3");
    h3.innerText = "Welcome to Seddit";
    h3.className = "subseddit-inner-welcome";
    all.appendChild(h3);

    let p = document.createElement("p");
    p.className = "subseddit-inner-welcome-2";
    p.innerText = "Where you can post whatever you want";
    all.appendChild(p);

    let signup = document.createElement("button");
    signup.className = "nav-button button-secondary subseddit-button-welcome";
    signup.innerText = "Be a seddittor";
    signup.setAttribute("data-id-signup", "");
    signup.onclick = () => {
        routeSignup();
    }
    all.appendChild(signup);

    return all;
}

export {
    right_navigation,
    setBackButton,
    welcome
};