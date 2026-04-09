const API_BASE_URL = 'http://localhost:3000/api/comments';

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

