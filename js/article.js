import { getComments, saveComments } from './helpers/comments.js';
import { getReactions, saveReactions } from './helpers/reactions.js';
import { getArticles } from './helpers/articles.js';
import { showToast } from './helpers/toast.js';

function getIdFromURL() {
    var params = new URLSearchParams(window.location.search);
    return Number(params.get('id'));
}

function renderReactions(id) {
    var reactions = getReactions(id);
    var bar = document.getElementById('reactions');

    while (bar.firstChild) bar.removeChild(bar.firstChild);

    var likeBtn = document.createElement('button');
    likeBtn.className = 'reaction-btn like-btn';

    var likeIcon = document.createElement('span');
    likeIcon.textContent = '👍';

    var likeCount = document.createElement('span');
    likeCount.id = 'like-count';
    likeCount.textContent = reactions.likes;

    likeBtn.appendChild(likeIcon);
    likeBtn.appendChild(likeCount);

    likeBtn.addEventListener('click', function() {
      var r = getReactions(id);
      r.likes += 1;
      saveReactions(id, r);
      renderReactions(id);
    });

    var dislikeBtn = document.createElement('button');
    dislikeBtn.className = 'reaction-btn dislike-btn';

    var dislikeIcon = document.createElement('span');
    dislikeIcon.textContent = '👎';

    var dislikeCount = document.createElement('span');
    dislikeCount.id = 'dislike-count';
    dislikeCount.textContent = reactions.dislikes;

    dislikeBtn.appendChild(dislikeIcon);
    dislikeBtn.appendChild(dislikeCount);

    dislikeBtn.addEventListener('click', function() {
      var r = getReactions(id);
      r.dislikes += 1;
      saveReactions(id, r);
      renderReactions(id);
    });

    bar.appendChild(likeBtn);
    bar.appendChild(dislikeBtn);
}

function buildComment(comment) {
    var item = document.createElement('div');
    item.className = 'bg-white border mb-3 px-4 py-3.5 rounded-md border-solid border-grey-400';

    var header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-1.5';

    var author = document.createElement('span');
    author.className = 'comment-author';
    author.textContent = comment.author || 'Anonymous';

    var date = document.createElement('span');
    date.className = 'text-xs text-gray-400';
    date.textContent = comment.date;

    header.appendChild(author);
    header.appendChild(date);

    var text = document.createElement('p');
    text.className = 'comment-text';
    text.textContent = comment.text;

    item.appendChild(header);
    item.appendChild(text);

    return item;
}
 
function renderComments(id) {
    var comments = getComments(id);
    var list = document.getElementById('comment-list');
    var noComments = document.getElementById('no-comments');

    while (list.firstChild) list.removeChild(list.firstChild);

    if (comments.length === 0) {
      noComments.style.display = 'block';
      return;
    }

    noComments.style.display = 'none';
    comments.forEach(function(c) {
      list.appendChild(buildComment(c));
    });
}

function addComment(id, author, text) {
    var comments = getComments(id);
    comments.push({
      author: author.trim() || 'Anonymous',
      text: text.trim(),
      date: new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })
    });
    saveComments(id, comments);
    renderComments(id);
    showToast('Comment posted!', 'success');
}
  
// Render full article
function renderArticle(article) {
    var body = document.getElementById('article-body');

    var category = document.createElement('div');
    category.className = 'article-category';
    category.textContent = article.category;

    var title = document.createElement('h1');
    title.className = 'article-full-title';
    title.textContent = article.title;

    var meta = document.createElement('div');
    meta.className = 'article-full-meta';
    meta.textContent = article.date;

    var divider = document.createElement('hr');
    divider.className = 'article-divider';

    var content = document.createElement('div');
    content.className = 'article-full-content';
    content.textContent = article.content;

    body.appendChild(category);
    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(divider);
    body.appendChild(content);

    document.title = article.title + ' – TechNews';
}

// Init
document.addEventListener('DOMContentLoaded', function() {
    var id = getIdFromURL();
    var articles = getArticles();
    var article = articles.find(function(a) { return a.id === id; });

    if (!article) {
      var body = document.getElementById('article-body');
      var msg = document.createElement('p');
      msg.className = 'text-gray-500 text-center py-16';
      msg.textContent = 'Article not found.';
      body.appendChild(msg);
      return;
    }

    renderArticle(article);
    renderReactions(id);
    renderComments(id);

    document.getElementById('comment-form').addEventListener('submit', function(e) {
      e.preventDefault();
      var author = document.getElementById('comment-author').value;
      var text = document.getElementById('comment-text').value;

      if (!text.trim()) {
        showToast('Please write a comment before posting.', 'error');
        return;
      }

      addComment(id, author, text);
      document.getElementById('comment-form').reset();
    });
});