
function randomStateStr(lenght = 42,caseSensitive = true) {
    const validChars = (caseSensitive === true ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':'') + 'abcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(lenght);
    window.crypto.getRandomValues(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));
    return String.fromCharCode.apply(null, array);
}

const randomUtils = {
    'randomStateStr': randomStateStr
}

export default randomUtils;
