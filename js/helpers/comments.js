export function getComments(id) {
    return JSON.parse(localStorage.getItem('technews_comments_' + id) || '[]');
}

export function saveComments(id, comments) {
    localStorage.setItem('technews_comments_' + id, JSON.stringify(comments));
}