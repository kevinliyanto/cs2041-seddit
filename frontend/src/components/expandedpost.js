import { getPost } from "../requests.js";

let generatePost = (data) => {

}

let expandedPost = (id) => {

    getPost(id)
        .then((data) => {
            generatePost(data);
        })
        .catch(() => {
            console.error("Error on getting post");
        });
}

export {
    expandedPost
}