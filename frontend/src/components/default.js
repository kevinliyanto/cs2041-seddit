let setHeader = () => {
    let header = document.createElement("header");
    header.className = "banner";
    header.id = "navbar";
    return header;
}

let setMain = () => {
    let main = document.createElement("div");
    main.id = "main";
    main.className = "main";
    return main;
}

let setFooter = () => {
    let footer = document.createElement("footer");
    footer.id = "footer";
    return footer;
}

let defaultPage = () => {
    let root = document.getElementById("root");
    if (root != null) root.remove();
    let header = document.getElementById("navbar");
    if (header != null) header.remove();
    let main = document.getElementById("main");
    if (main != null) main.remove();
    let footer = document.getElementById("footer");
    if (footer != null) footer.remove();

    header = setHeader();
    main = setMain();
    footer = setFooter();

    document.body.appendChild(header);
    document.body.appendChild(main);
    document.body.appendChild(footer);

    // REMINDER!!
    /* Header (id: navbar), main (id: main), and footer (id: footer)
     * always exists. Do not remove unless generating a completely new page.
     * defaultPage() should only get called when the app starts.
     */
}

export default defaultPage;
