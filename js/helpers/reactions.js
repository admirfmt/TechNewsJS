export function getReactions(id) {
    var key = 'technews_reactions_' + id;
    return JSON.parse(localStorage.getItem(key) || '{"likes":0,"dislikes":0}');
}

export function saveReactions(id, data) {
    localStorage.setItem('technews_reactions_' + id, JSON.stringify(data));
}