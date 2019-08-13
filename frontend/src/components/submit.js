import setNavbar from "./navbar.js";
import {
    routeHome, routeExpandedPost
} from "../route.js";
import {
    modal_errors_load, modalError_PushPost
} from "./modal.js";
import {
    postPost
} from "../requests.js";
import { right_navigation } from "./rightpanel.js";

let form = () => {
    let formdiv = document.createElement("div");
    formdiv.className = "leftpanel";

    let div1 = document.createElement("div");
    let submission = document.createElement("h1");
    submission.innerText = "Submit to Seddit";
    div1.appendChild(submission);

    let div2 = document.createElement("div");
    let titleField = document.createElement("input");
    titleField.className = "submission-title";
    titleField.placeholder = "Insert post title";
    div2.appendChild(titleField);

    let div3 = document.createElement("div");
    let textField = document.createElement("textarea");
    textField.className = "submission-text";
    textField.placeholder = "Insert text here";
    div3.appendChild(textField);

    let div4 = document.createElement("div");
    let subseddit = document.createElement("input");
    subseddit.className = "submission-sub";
    subseddit.placeholder = "Subseddit";
    div4.appendChild(subseddit);

    let div5 = document.createElement("div");
    let image = document.createElement("input");
    image.type = "file";
    image.accept= "image/*";
    image.id = "image";
    div5.appendChild(image);

    let div6 = document.createElement("div");
    let submit = document.createElement("submit");
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
            submitPost(title, text, sseddit, "")
                .then(() => {
                    routeHome();
                })
                .catch(() => {
                    modalError_PushPost();
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
                    submitPost(title, text, sseddit, imageb64)
                        .then((res) => {
                            routeExpandedPost(res.post_id);
                        })
                        .catch(() => {
                            modalError_PushPost();
                        });
                }
                reader.readAsDataURL(fi);
            }
            loadImage(image);
        }
    }

    return formdiv;
}

async function submitPost(title, text, subseddit, image) {
    let payload = {
        "title": title,
        "text": text,
        "subseddit": subseddit,
        "image": image
    }

    return postPost(payload)
        .then((c) => {
            return c;
        })
        .catch((e) => {
            throw e;
        });
}

let setSubmitPage = () => {
    let main = document.getElementById("main");
    // Cleanup main
    while (main.firstChild) {
        main.firstChild.remove();
    }

    let formdiv = form();
    main.appendChild(formdiv);

    let right = document.createElement("div");
    right.className = "rightpanel";
    right.appendChild(right_navigation());
    main.appendChild(right);
}

let submitPage = () => {
    setNavbar();
    setSubmitPage();
}


export {
    submitPage
}