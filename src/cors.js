const cors = (url) => {
    return 'https://mysterious-cove-59901.herokuapp.com/' + url + new Date().time;
}
const cors_noDate = (url) => {
    return 'https://mysterious-cove-59901.herokuapp.com/' + url;
}

export {cors,cors_noDate} ;