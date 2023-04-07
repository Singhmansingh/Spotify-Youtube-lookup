export function Capitalize(term){
    var words = term.split(" ");
    var capWord = words.map((word) => word[0].toUpperCase() + word.substring(1)).reduce((acc,cv) => acc + " " + cv);

    return capWord;
}

export function ParseSpotifyId(url){
    var spotifyIdRegex = /[a-zA-Z0-9]{22}(?<!\?)/;
        
    var spotifyId = spotifyIdRegex.exec(url);

    return spotifyId;
}