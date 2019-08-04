import setNavbar from "./sub/navbar.js";
import { setLastPage } from "./storage/setlocalstorage.js";

let setInvalidPage = (apiUrl) => {
    let main = document.getElementById("main");
    // Cleanup main
    while (main.firstChild){
        main.firstChild.remove();
    }

    let mainsetup = document.createElement("div");
    let text = document.createElement("h1");
    text.innerText = "Page does not exist";

    mainsetup.appendChild(text);
    main.appendChild(mainsetup);
}


let invalidPage = (apiUrl) => {
    setLastPage("#home");
    setNavbar(apiUrl);
    setInvalidPage(apiUrl);
}

export default invalidPage;