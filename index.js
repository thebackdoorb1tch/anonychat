document.addEventListener('DOMContentLoaded', function () {
  // Load posts from local storage
  loadPosts();

  // Show post creation modal
  document.getElementById('addPostBtn').addEventListener('click', function () {
    document.getElementById('postModal').style.display = 'flex';
  });

  // Close post creation modal
  document.getElementById('cancelPostBtn').addEventListener('click', function () {
    document.getElementById('postModal').style.display = 'none';
  });

  // Submit post
  document.getElementById('submitPostBtn').addEventListener('click', function () {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();

    if (title && content) {
      const newPost = {
        id: Date.now(),
        title: title,
        content: content,
        upvotes: 0,
        comments: []
      };

      // Save to localStorage
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts.push(newPost);
      localStorage.setItem('posts', JSON.stringify(posts));

      // Close modal and reload posts
      document.getElementById('postModal').style.display = 'none';
      loadPosts();
    }
  });
});

// Load all posts from localStorage
function loadPosts() {
  const postsContainer = document.getElementById('postsContainer');
  postsContainer.innerHTML = '';

  const posts = JSON.parse(localStorage.getItem('posts')) || [];

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.setAttribute('data-id', post.id);

    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <button class="upvoteBtn">Upvote (${post.upvotes})</button>
      <div class="comments">
        <h3>Comments:</h3>
        <div class="commentList" id="comments-${post.id}">
          ${post.comments.map(comment => `<p class="comment">${comment}</p>`).join('')}
        </div>
        <textarea placeholder="Add a comment..." class="commentInput" data-post-id="${post.id}"></textarea>
        <button class="submitCommentBtn" data-post-id="${post.id}">Submit Comment</button>
      </div>
    `;

    postsContainer.appendChild(postElement);

    // Handle upvote
    postElement.querySelector('.upvoteBtn').addEventListener('click', function () {
      post.upvotes++;
      updatePostInLocalStorage(post);
      loadPosts();
    });

    // Handle comment submission
    postElement.querySelector('.submitCommentBtn').addEventListener('click', function () {
      const commentInput = postElement.querySelector('.commentInput');
      const comment = commentInput.value.trim();

      if (comment) {
        post.comments.push(comment);
        updatePostInLocalStorage(post);
        loadPosts();
      }
    });
  });
}

// Update post in localStorage
function updatePostInLocalStorage(updatedPost) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const index = posts.findIndex(post => post.id === updatedPost.id);
