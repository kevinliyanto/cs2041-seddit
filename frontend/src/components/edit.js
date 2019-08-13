import setNavbar from "./navbar.js";
import { getPost, putPost } from "../requests.js";
import { getUsername } from "../localstorage.js";
import { modal_errors_load, modalError_SetPost, modalError_RestrictionSetPost } from "./modal.js";
import { routeHome, routeExpandedPost } from "../route.js";
import { right_navigation } from "./rightpanel.js";

let form = (data) => {
    let formdiv = document.createElement("div");
    formdiv.className = "leftpanel";

    let div1 = document.createElement("div");
    let submission = document.createElement("h1");
    submission.innerText = "Edit your post";
    div1.appendChild(submission);

    let div2 = document.createElement("div");
    let titleField = document.createElement("textarea");
    titleField.className = "submission-title";
    titleField.placeholder = "Insert post title";
    titleField.innerText = data.title;
    div2.appendChild(titleField);

    let div3 = document.createElement("div");
    let textField = document.createElement("textarea");
    textField.className = "submission-text";
    textField.placeholder = "Insert text here";
    textField.innerText = data.text;
    div3.appendChild(textField);

    let div4 = document.createElement("div");
    let subseddit = document.createElement("h4");
    subseddit.className = "submission-sub-edit";
    subseddit.placeholder = "Subseddit";
    subseddit.value = data.meta.subseddit;
    subseddit.innerText = "Subseddit: " + data.meta.subseddit;
    div4.appendChild(subseddit);

    let div5 = document.createElement("div");
    let image = document.createElement("input");
    image.type = "file";
    image.accept= "image/*";
    image.id = "image";
    div5.appendChild(image);

    let div6 = document.createElement("div");
    let submit = document.createElement("button");
    submit.className = "submit-button-2";
    submit.innerText = "Submit";
    div6.appendChild(submit);

    div1.className = "submission";
    formdiv.appendChild(div1);
    div2.className = "submission";
    formdiv.appendChild(div2);
    div3.className = "submission";
    formdiv.appendChild(div3);
    div4.className = "submission";
    formdiv.appendChild(div4);
    div5.className = "submission";
    formdiv.appendChild(div5);
    div6.className = "submission";
    formdiv.appendChild(div6);
    
    let reset = document.createElement("button");
    reset.className = "submit-button";
    reset.innerText = "Reset all field";
    div6.appendChild(reset);
    // div7.className = "submission";
    // formdiv.appendChild(div7);

    reset.onclick = () => {
        titleField.value = data.title;
        textField.value = data.text;
        image.value = "";
    }

    let div8 = document.createElement("div");
    let cancel = document.createElement("button");
    cancel.className = "button button-home";
    cancel.innerText = "Cancel submission";
    div8.appendChild(cancel);
    div8.className = "submission";
    formdiv.appendChild(div8);

    submit.onclick = () => {
        let title = titleField.value;
        let text = textField.value;
        let sub = subseddit.value;
        let imgPath = image.value;

        if (title.length == 0 || text.length == 0) {
            modal_errors_load("Error", "Your post must have a title and text");
            return;
        }

        let re_sub = /^(\/?s\/)?(\w+)$/;
        if (sub.length != 0 && !re_sub.test(sub)) {
            modal_errors_load("Error", "Invalid subseddit name");
            return;
        }
        
        let sseddit = "";
        if (sub.length != 0) {
            sseddit = sub.match(re_sub)[sub.match(re_sub).length - 1]; 
        }
        
        if (imgPath == "") {
            resubmitPost(data.id, title, text, sseddit, data.image)
                .then(() => {
                    routeExpandedPost(data.id);
                })
                .catch((r) => {
                    modalError_SetPost();
                });
        } else {
            let loadImage = (image) => {
                let fi = image.files[0];
                let reader = new FileReader();
                reader.onloadend = () => {
                    // console.log(reader.result);
                    let re = /^data\:image\/\w+\;base64\,(.*)$/;

                    if (reader.result.match(re) == null) {
                        modal_errors_load("Error", "Invalid file provided.");
                        return;
                    }

                    let imageb64 = reader.result.match(re)[1];
                    resubmitPost(data.id, title, text, sseddit, imageb64)
                        .then(() => {
                            routeExpandedPost(data.id);
                        })
                        .catch((r) => {
                            modalError_SetPost();
                        });
                }
                reader.readAsDataURL(fi);
            }
            loadImage(image);
        }
    }

    cancel.onclick = () => {
        routeExpandedPost(data.id);
    }

    return formdiv;
}

async function resubmitPost (id, title, text, subseddit, image) {
    let payload = {
        "title": title,
        "text": text,
        "subseddit": subseddit
    }
    if (image != "") {
        payload.image = image;
    }

    return putPost(payload, id)
        .then((c) => {
            return c;
        })
        .catch((e) => {
            throw e;
        });
}

let setEditPage = (data) => {
    let main = document.getElementById("main");
    // Cleanup main
    while (main.firstChild) {
        main.firstChild.remove();
    }

    let formdiv = form(data);
    main.appendChild(formdiv);

    let rightpanel = document.createElement("div");
    rightpanel.id = "rightpanel";
    rightpanel.className = "rightpanel";
    rightpanel.appendChild(right_navigation());
    main.appendChild(rightpanel);
}

let editPost = (id) => {
    setNavbar();
    getPost(id)
        .then((data) => {
            if (data.meta.author != getUsername()) {
                throw "User is not allowed to modify others post";
            }
            setEditPage(data);
        })
        .catch(() => {
            routeHome();
            modalError_RestrictionSetPost();
        })
}

export {
    editPost
}