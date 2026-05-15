export function getArticles() {
    return JSON.parse(localStorage.getItem('technews_articles') || '[]');
}

export function saveArticles(articles) {
    localStorage.setItem('technews_articles', JSON.stringify(articles));
}