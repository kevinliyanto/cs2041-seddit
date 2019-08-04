import setNavbar from './sub/navbar.js';
import { getPublicPost, getPrivatePost } from './requester/request_post.js';
import { checkLogged } from './storage/setlocalstorage.js';

let enlargePost = (post) => {

}

let convertToNow = (timestamp) => {
    let t = new Date(timestamp * 1000);
    let months = ['January','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let y = t.getFullYear();
    let m = months[t.getMonth()];
    let d = t.getDate();
    let h = formatTime(t.getHours());
    let min = formatTime(t.getMinutes());

    let result = d + ' ' + m + ' ' + y +  ' (' + h + ':' + min + ')';
    return result;
}

let formatTime = (t) => {
    if (t < 10) {
        t = "0" + t;
    }
    return t;
}

let setSmallPost = (data) => {

    let list = document.createElement("li");
    list.setAttribute("data-id-post", data.id);
    list.className = "post-list";
    
    let wrapper = document.createElement("div");
    wrapper.className = "post-wrapper";


    let leftCol = document.createElement("div");
    leftCol.className = "post-left";
    let midCol = document.createElement("div");
    midCol.className = "post-middle";
    let rightCol = document.createElement("div");
    rightCol.className = "post-right";
    let upperSide = document.createElement("div");
    upperSide.className = "post-rightchild-upper";
    let middleSide = document.createElement("div");
    middleSide.className = "post-rightchild-middle";
    let bottomSide = document.createElement("div");
    bottomSide.className = "post-rightchild-bottom";

    // Setting up left side
    let upvote = document.createElement("div");
    upvote.className = "post-upvote";
    let votecount = document.createElement("div");
    votecount.className = "post-votes";
    votecount.innerText = data.meta.upvotes.length;
    leftCol.appendChild(upvote);
    leftCol.appendChild(votecount);

    // Setting up middle side
    // Ignore for now, thumbnail not provided
    if (data.image != null){
        let originalImage = document.createElement("img");
        originalImage.setAttribute('src', "data:image/png;base64," + data.image);
    
        originalImage.setAttribute("height", 100);
        originalImage.setAttribute("width", 100);
    
        midCol.appendChild(originalImage);
    }

    // Setting up right side
    upperSide.innerText = data.text;

    middleSide.innerText = `Posted by ` + data.meta.author + ` on /s/` + data.meta.subseddit + `. Published on ` + convertToNow(data.meta.published);

    let expandButton = document.createElement("button");
    expandButton.className = "post-expandbutton";
    expandButton.innerText = ">";
    bottomSide.appendChild(expandButton);
    
    list.appendChild(wrapper);
    wrapper.appendChild(leftCol);
    wrapper.appendChild(midCol);
    wrapper.appendChild(rightCol);
    rightCol.appendChild(upperSide);
    rightCol.appendChild(middleSide);
    rightCol.appendChild(bottomSide);
    return list;
}

let generatePosts = (file) => {
    let feed = document.getElementById("feed");
    for (let i = 0; i < file.posts.length; i++) {
        // console.log(file.posts[i]);
        let list = setSmallPost(file.posts[i]);
        feed.appendChild(list);
    }
}

let setFeed = () => {
    let feed = document.createElement("ul");
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");
    return feed;
}

let setRightPanel = () => {

}

let setMainHome = (apiUrl) => {
    let main = document.getElementById("main");
    // Cleanup main
    while (main.firstChild){
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

    // Check if user authed, if authed then generate user post
    // else generate public post
    if (checkLogged()){
        getPrivatePost(apiUrl, 0, 10).then((file) => {
            console.log(file);
            generatePosts(file);
        });
    } else {
        getPublicPost(apiUrl).then(file => generatePosts(file));
    }

}

let homePage = (apiUrl) => {
    setNavbar(apiUrl);
    setMainHome(apiUrl);
}

export default homePage;
