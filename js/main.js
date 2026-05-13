function getArticles() {
    return JSON.parse(localStorage.getItem('technews_articles') || '[]');
}

function saveArticles(articles) {
    localStorage.setItem('technews_articles', JSON.stringify(articles));
}

function getExcerpt(text, max = 60) {
    return text.length > max ? text.slice(0, max) + '...' : text;
}

function buildCard(article) {
    var card = document.createElement('div');
    card.className = 'dyn-article-card';
    card.style.cursor = 'pointer';

    var header = document.createElement('div');
    header.className = 'dyn-card-header';

    var left = document.createElement('div');

    var category = document.createElement('div');
    category.className = 'text-xs font-bold uppercase text-gray-500 pb-2';
    category.textContent = article.category;

    var title = document.createElement('div');
    title.className = 'text-s font-semibold text-gray-800 leading-snug';
    title.textContent = article.title;

    left.appendChild(category);
    left.appendChild(title);

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      deleteArticle(article.id);
    });

    header.appendChild(left);
    header.appendChild(deleteBtn);

    var excerptEl = document.createElement('p');
    excerptEl.className = 'article-card-excerpt';
    excerptEl.textContent = getExcerpt(article.content);

    var meta = document.createElement('div');
    meta.className = 'text-sm text-gray-400 mt-1';
    meta.textContent = article.date;

    card.appendChild(header);
    card.appendChild(excerptEl);
    card.appendChild(meta);

    // Navigate to article detail page on card click
    card.addEventListener('click', function() {
      window.location.href = 'article.html?id=' + article.id;
    });

    return card;
}

function renderArticles() {
    var articles = getArticles();
    var container = document.getElementById('article-container');
    var emptyState = document.getElementById('empty-state');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    if (articles.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    var reversed = articles.slice().reverse();
    for (var i = 0; i < reversed.length; i++) {
      container.appendChild(buildCard(reversed[i]));
    }
}

function createArticle(title, content, category) {
    var articles = getArticles();
    var article = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      category: category,
      date: new Date().toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })
    };
    articles.push(article);
    saveArticles(articles);
    renderArticles();
    showToast('Article published successfully!', 'success');
}

function deleteArticle(id) {
    var updated = getArticles().filter(function(a) { return a.id !== id; });
    saveArticles(updated);
    renderArticles();
    showToast('Article deleted.', 'info');
}

function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('article-form').reset();
}

document.addEventListener('DOMContentLoaded', function() {
  
    renderArticles();

    document.getElementById('open-modal-btn').addEventListener('click', openModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);

    document.getElementById('modal').addEventListener('click', function(e) {
      if (e.target === document.getElementById('modal')) closeModal();
    });

    document.getElementById('article-form').addEventListener('submit', function(e) {
      e.preventDefault();
      var title = document.getElementById('article-title').value;
      var content = document.getElementById('article-content').value;
      var category = document.getElementById('article-category').value;

      if (!title.trim() || !content.trim()) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      createArticle(title, content, category);
      closeModal();
    });

});