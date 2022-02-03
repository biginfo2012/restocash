function langs(key) {
    var arr = key.split(".");
    if (arr.length > 1) {
        return lang[arr[0]][arr[1]] ? lang[arr[0]][arr[1]] : key;
    }
    return '';
}
