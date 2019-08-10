let convertToNow = (timestamp) => {
    let t = new Date(timestamp * 1000);
    let months = ['January', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let y = t.getFullYear();
    let m = months[t.getMonth()];
    let d = t.getDate();
    let h = formatTime(t.getHours());
    let min = formatTime(t.getMinutes());

    let result = d + ' ' + m + ' ' + y + ' (' + h + ':' + min + ')';
    return result;
}

let formatTime = (t) => {
    if (t < 10) {
        t = "0" + t;
    }
    return t;
}

export {
    convertToNow,
    formatTime
}