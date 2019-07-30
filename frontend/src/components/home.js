import setNavbar from './sub/navbar.js';
import { getPublicPost } from './requester/request_post.js';

let enlargePost = (post) => {

}

let convertToNow = (timestamp) => {
    let t = new Date(timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let y = t.getFullYear();
    let m = months[t.getMonth()];
    let d = t.getDate();
    let h = t.getHours();
    let min = t.getMinutes();

    let result = m + ' ' + y + ', ' + d + ' (' + h + ':' + min + ')';
    return result;
}

let setSmallPost = (data) => {

    let list = document.createElement("li");
    list.setAttribute("data-id-post", data.id);
    list.className = "post-list";
    
    // Show upvote on leftmost div
    // Show media type on next div
    // Next div:
    // Show title
    // by user on subseddit /s/?
    // comments onaction link

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

    // Setting up right side
    upperSide.innerText = data.title + '...';

    middleSide.innerText = `Posted by ` + data.meta.author + ` on ` + data.meta.subseddit + `. Published on ` + convertToNow(data.meta.published);

    let expandButton = document.createElement("button");
    expandButton.className = "post-expandbutton";
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
    getPublicPost(apiUrl).then(file => generatePosts(file));

}

let homePage = (apiUrl) => {
    setNavbar(apiUrl);
    setMainHome(apiUrl);
}

export default homePage;
