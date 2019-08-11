
let generatePosts = (file, string) => {

}

let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setSearch = (string) => {
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

    let marker = document.createElement("div");
    marker.id = "marker";
    marker.className = "marker";
    leftpanel.appendChild(marker);

    // Generate right panel interface, similar to reddit

    main.appendChild(leftpanel);

    let right = setRightPanel();
    rightpanel.appendChild(right);
    main.appendChild(right_navigation());

    getUserFeed(r, 10)
        .then((file) => {
            generatePosts(file, string);
            getter();
        });
}

let searchPage = (string) => {
    setNavbar();

    // Restriction is implemented in route
    setSearch(string);
}