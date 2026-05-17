import { mostReadArticles } from './data/mostReadArticles.js';
import { topicsArticles } from './data/topicsArticles.js';
import { trendingArticles } from './data/trendingArticles.js';
import { getArticles, saveArticles } from './helpers/articles.js';
import { showToast } from './helpers/toast.js';

function buildCard(article) {
  // cut content to 60 chars for preview
  var rawText = article.content;
  var cut = rawText.slice(0, 60);
  var final = rawText.length > 60 ? cut + '...' : rawText;
  
  var card = document.createElement('div');
    card.className = 'bg-white border flex flex-col gap-2 overflow-hidden min-w-[none] mb-4 px-6 py-5 rounded-md border-solid border-gray-200';
    card.style.cursor = 'pointer';

    var header = document.createElement('div');
    header.className = 'flex items-start justify-between gap-3';

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
    excerptEl.className = 'article-excerpt';
    excerptEl.textContent = final;

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

function renderTrendingArticles() {
  var list = document.getElementById('trending-list');
  if (!list) return;

  trendingArticles.forEach(function(item, index) {
    var li = document.createElement('li');
    li.className = 'flex gap-3 items-start py-3';

    var num = document.createElement('span');
    num.className = 'text-2xl font-bold text-gray-200 w-7 leading-none shrink-0';
    num.textContent = String(index + 1).padStart(2, '0');

    var inner = document.createElement('div');

    var titleEl = document.createElement('div');
    titleEl.className = 'text-sm font-semibold text-gray-800 leading-snug';
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'hover:text-teal-700';
    link.textContent = item.title;
    titleEl.appendChild(link);

    var reads = document.createElement('div');
    reads.className = 'text-xs text-gray-400 mt-1';
    reads.textContent = item.reads + ' reads';

    inner.appendChild(titleEl);
    inner.appendChild(reads);

    li.appendChild(num);
    li.appendChild(inner);
    list.appendChild(li);
  });
}

function renderMostReadArticles() {
  var container = document.getElementById('most-read-list');
  if (!container) return;

  mostReadArticles.forEach(function(item) {
    var article = document.createElement('article');
    article.className = 'flex gap-3 items-start py-3';

    var img = document.createElement('img');
    img.src = item.img;
    img.alt = 'Article image';
    img.className = 'w-16 h-12 object-cover rounded shrink-0';
    img.width = 72;
    img.height = 54;

    var inner = document.createElement('div');

    var titleEl = document.createElement('div');
    titleEl.className = 'text-sm font-semibold text-gray-800 leading-snug';
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'hover:text-teal-700';
    link.textContent = item.title;
    titleEl.appendChild(link);

    var meta = document.createElement('div');
    meta.className = 'text-xs text-gray-400 mt-1';
    meta.textContent = item.meta;

    inner.appendChild(titleEl);
    inner.appendChild(meta);

    article.appendChild(img);
    article.appendChild(inner);
    container.appendChild(article);
  });
}

function renderTopicsArticles() {
  var container = document.getElementById('topics-list');
  if (!container) return;

  topicsArticles.forEach(function(topic) {
    var a = document.createElement('a');
    a.href = '#';
    a.className = 'text-xs font-semibold px-3 py-1 border border-gray-300 rounded-full text-gray-500 hover:border-teal-700 hover:text-teal-700 hover:bg-teal-50';
    a.textContent = topic;
    container.appendChild(a);
  });
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
    renderMostReadArticles();
    renderTopicsArticles();
    renderTrendingArticles();

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