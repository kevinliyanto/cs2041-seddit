

let setSearch = (username) => {
    let main = document.getElementById("main");
    // Cleanup main
    while (main.firstChild) {
        main.firstChild.remove();
    }

    let leftpanel = document.createElement("div");
    leftpanel.id = "leftpanel";
    leftpanel.className = "leftpanel";
    let rightpanel = document.createElement("div");
    rightpanel.id = "rightpanel";
    rightpanel.className = "rightpanel";

    // Generate feed interface
    let feed = setFeed();
    leftpanel.appendChild(feed);

    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);
    main.appendChild(rightpanel);

    // Generate posts for user user
    getUserByUsername(username)
        .then(handleError)
        .then((res) => {
            generateUser(res);
            setRightPanel(res);
        })
        .catch((err) => {
            generateInvalidUsername();
        });

}

let searchPage = (string) => {
    setNavbar();

    // Restriction is implemented in route
    setMainUser(string);
}