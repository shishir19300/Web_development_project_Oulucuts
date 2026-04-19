const API_BASE_URL = 'https://oulucuts-back-end.onrender.com/api/comments';

async function fetchBarberComments(barberId) {
  const response = await fetch(`${API_BASE_URL}/barber/${barberId}`, {
    credentials: 'include'
  });
  return response.json();
}

async function fetchBarberAverage(barberId) {
  const response = await fetch(`${API_BASE_URL}/barber/${barberId}/average`, {
    credentials: 'include'
  });
  return response.json();
}

async function createComment(payload) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return response.json();
}

async function deleteComment(commentId) {
  const response = await fetch(`${API_BASE_URL}/${commentId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return response.json();
}

window.commentApi = {
  fetchBarberComments,
  fetchBarberAverage,
  createComment,
  deleteComment
};

// START: COMMENT FEATURE LOGIC
function renderStars(rating) {
  const value = Number(rating) || 0;
  const full = '★'.repeat(Math.max(0, Math.min(5, value)));
  const empty = '☆'.repeat(Math.max(0, 5 - value));
  return `${full}${empty}`;
}

function getCurrentBarberId() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('id');
  return raw ? parseInt(raw, 10) : NaN;
}

function showCommentError(message) {
  const errorEl = document.getElementById('comment-error');
  if (!errorEl) return;
  if (!message) {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
    return;
  }
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

function buildCommentItem(comment) {
  const wrap = document.createElement('div');
  wrap.className = 'comment-item list-group-item';

  const title = document.createElement('div');
  title.className = 'comment-head';

  const userSpan = document.createElement('span');
  const username = comment.username || 'Someone';
  userSpan.textContent = `${username}:`;

  const starsSpan = document.createElement('span');
  starsSpan.className = 'comment-stars';
  starsSpan.textContent = renderStars(comment.rating);

  title.appendChild(userSpan);
  title.appendChild(starsSpan);

  const body = document.createElement('p');
  body.className = 'comment-text';
  body.textContent = comment.comment_text || '';

  wrap.appendChild(title);
  wrap.appendChild(body);

  const currentUserId = window.currentUser && window.currentUser.id ? Number(window.currentUser.id) : null;
  if (currentUserId && Number(comment.user_id) === currentUserId) {
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'comment-delete-btn btn btn-sm btn-outline-secondary mt-2';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', async () => {
      const result = await deleteComment(comment.id);
      if (result && result.error) {
        showCommentError(result.error);
        return;
      }
      showCommentError('');
      await loadCommentsForBarber(getCurrentBarberId());
      await loadAverageForBarber(getCurrentBarberId());
    });
    wrap.appendChild(deleteBtn);
  }

  return wrap;
}

async function loadCommentsForBarber(barberId) {
  const listEl = document.getElementById('comments-list');
  if (!listEl || !Number.isInteger(barberId)) return;

  listEl.innerHTML = '';
  const comments = await fetchBarberComments(barberId);

  if (!Array.isArray(comments) || comments.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'comment-empty text-muted mb-0';
    empty.textContent = 'No comments yet.';
    listEl.appendChild(empty);
    return;
  }

  comments.forEach((comment) => {
    listEl.appendChild(buildCommentItem(comment));
  });
}

async function loadAverageForBarber(barberId) {
  const avgEl = document.getElementById('review-average');
  if (!avgEl || !Number.isInteger(barberId)) return;

  const avg = await fetchBarberAverage(barberId);
  if (avg && typeof avg.average_rating !== 'undefined') {
    avgEl.textContent = `Rating: ${avg.average_rating} / 5 (${avg.total_reviews} reviews)`;
    return;
  }
  avgEl.textContent = 'Rating: 0.00 / 5 (0 reviews)';
}

async function handleCommentSubmit(event) {
  event.preventDefault();

  const barberId = getCurrentBarberId();
  if (!Number.isInteger(barberId)) {
    showCommentError('Barber id missing in URL.');
    return;
  }

  const ratingInput = document.querySelector('input[name="rating"]:checked');
  const commentInput = document.getElementById('comment-text');
  const rating = ratingInput ? Number(ratingInput.value) : NaN;
  const commentText = commentInput ? commentInput.value.trim() : '';

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    showCommentError('Please choose a rating from 1 to 5.');
    return;
  }

  if (!commentText) {
    showCommentError('Please write a comment.');
    return;
  }

  const result = await createComment({
    barber_id: barberId,
    rating,
    comment_text: commentText
  });

  if (result && result.error) {
    showCommentError(result.error);
    return;
  }

  showCommentError('');
  event.target.reset();
  await loadCommentsForBarber(barberId);
  await loadAverageForBarber(barberId);
}

function initCommentFeature() {
  const formEl = document.getElementById('comment-form');
  if (!formEl) return;

  formEl.addEventListener('submit', handleCommentSubmit);
  const barberId = getCurrentBarberId();
  if (Number.isInteger(barberId)) {
    loadCommentsForBarber(barberId);
    loadAverageForBarber(barberId);
  }
}

window.addEventListener('DOMContentLoaded', initCommentFeature);
// END: COMMENT FEATURE LOGIC
