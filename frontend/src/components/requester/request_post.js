async function getPublicPost(apiUrl) {
    if (apiUrl == null) return null;

    let settings = {
        method: 'GET'
    };

    let data = await fetch(apiUrl + "/post/public", settings)
        .then(response => response.json())
        .then(json => {
            return json;
        })
        .catch(e => {
            return e;
        });

    return data;
}

export {
    getPublicPost
};