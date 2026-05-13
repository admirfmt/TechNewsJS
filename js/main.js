// Storage helpers
function getArticles() {
    return JSON.parse(localStorage.getItem('technews_articles') || '[]');
  }
  
  function saveArticles(articles) {
    localStorage.setItem('technews_articles', JSON.stringify(articles));
  }
  
  // Toast
  function showToast(message, type) {
    if (!type) type = 'success';
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3000);
  }
  
  // Excerpt
  function getExcerpt(text, max) {
    if (!max) max = 60;
    var clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return clean.slice(0, max).replace(/\s+\S*$/, '') + '...';
  }
  
  // Build one article card
  function buildCard(article) {
    var card = document.createElement('div');
    card.className = 'dynamic-article-card';
  
    var header = document.createElement('div');
    header.className = 'dynamic-card-header';
  
    var left = document.createElement('div');
  
    var category = document.createElement('div');
    category.className = 'article-card-category';
    category.textContent = article.category;
  
    var title = document.createElement('div');
    title.className = 'article-card-title';
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
    meta.className = 'article-card-meta';
    meta.textContent = article.date;
  
    card.appendChild(header);
    card.appendChild(excerptEl);
    card.appendChild(meta);
  
    return card;
  }
  
  // Render articles
  function renderArticles() {
    var articles   = getArticles();
    var container  = document.getElementById('article-container');
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
  
  // Create article
  function createArticle(title, content, category) {
    var articles = getArticles();
    var article = {
      id:       Date.now(),
      title:    title.trim(),
      content:  content.trim(),
      category: category,
      date:     new Date().toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })
    };
    articles.push(article);
    saveArticles(articles);
    renderArticles();
    showToast('Article published successfully!', 'success');
  }
  
  // Delete article
  function deleteArticle(id) {
    var updated = getArticles().filter(function(a) { return a.id !== id; });
    saveArticles(updated);
    renderArticles();
    showToast('Article deleted.', 'info');
  }
  
  // Modal
  function openModal() {
    document.getElementById('modal').classList.remove('hidden');
  }
  
  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('article-form').reset();
  }
  
  // Init
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
      var title    = document.getElementById('article-title').value;
      var content  = document.getElementById('article-content').value;
      var category = document.getElementById('article-category').value;
  
      if (!title.trim() || !content.trim()) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      createArticle(title, content, category);
      closeModal();
    });
  
  });