const STORAGE_KEY = "communityPosts";
let currentPostId = null;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  currentPostId = Number(params.get("id"));

  if (!currentPostId) {
    alert("잘못된 접근입니다.");
    window.location.href = "community.html";
    return;
  }

  // 버튼/폼 이벤트
  document.getElementById("editPostBtn").href = `community-form.html?mode=edit&id=${currentPostId}`;
  document.getElementById("deletePostBtn").addEventListener("click", deleteCurrentPost);
  document.getElementById("likePostBtn").addEventListener("click", likeCurrentPost);
  document.getElementById("commentForm").addEventListener("submit", submitComment);
  document.getElementById("cancelEditCommentBtn").addEventListener("click", resetCommentForm);

  // 렌더
  renderAll();
});

function getPosts() {
  // ✅ storage.js 기반으로 통일
  return getData(STORAGE_KEY) || [];
}

function savePosts(posts) {
  setData(STORAGE_KEY, posts);
}

function getCurrentPost(posts = null) {
  const list = posts || getPosts();
  return list.find((post) => Number(post.id) === Number(currentPostId));
}

function renderAll() {
  const posts = getPosts();
  const post = getCurrentPost(posts);

  if (!post) {
    alert("게시글을 찾을 수 없습니다.");
    window.location.href = "community.html";
    return;
  }

  renderPostDetail(post);
  renderComments(post);
}

function renderPostDetail(post) {
  const likes = post.likes ?? 0;
  document.getElementById("postMeta").textContent =
    `글 ID ${post.id} | ${post.category} | 작성자 ${post.author} | ${post.date} | 좋아요 ${likes}`;

  document.getElementById("postTitle").textContent = post.title || "";
  document.getElementById("postContent").textContent = post.content || "";

  // 좋아요 버튼 텍스트도 최신화
  document.getElementById("likePostBtn").textContent = `좋아요 (${likes})`;
}

function renderComments(post) {
  const commentList = document.getElementById("commentList");
  const countText = document.getElementById("commentCountText");

  const comments = Array.isArray(post.comments) ? post.comments : [];
  countText.textContent = `총 ${comments.length}건`;

  if (comments.length === 0) {
    commentList.innerHTML = `<p class="text-muted mb-0">등록된 댓글이 없습니다.</p>`;
    return;
  }

  commentList.innerHTML = comments
    .map(
      (comment) => `
      <div class="border-bottom py-3">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <div class="fw-bold">${escapeHtml(comment.author)}</div>
            <div class="text-muted small">${escapeHtml(comment.date)}</div>
            <div class="mt-2">${escapeHtml(comment.content)}</div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary" onclick="startEditComment(${comment.id})">수정</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteComment(${comment.id})">삭제</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function likeCurrentPost() {
  const posts = getPosts();
  const post = posts.find((item) => Number(item.id) === Number(currentPostId));
  if (!post) return;

  post.likes = (post.likes || 0) + 1;
  savePosts(posts);

  // 상세만 다시 그리기
  renderPostDetail(post);
}

function submitComment(e) {
  e.preventDefault();

  const authorEl = document.getElementById("commentAuthor");
  const contentEl = document.getElementById("commentContent");
  const editingIdEl = document.getElementById("editingCommentId");

  const author = authorEl.value.trim();
  const content = contentEl.value.trim();
  const editingId = editingIdEl.value;

  if (!author || !content) {
    alert("댓글 작성자와 내용을 입력하세요.");
    return;
  }

  const posts = getPosts();
  const post = posts.find((item) => Number(item.id) === Number(currentPostId));
  if (!post) return;

  if (!Array.isArray(post.comments)) post.comments = [];

  if (editingId) {
    const comment = post.comments.find((item) => Number(item.id) === Number(editingId));
    if (comment) {
      comment.author = author;
      comment.content = content;
    }
    alert("댓글이 수정되었습니다.");
  } else {
    const nextId = post.comments.length
      ? Math.max(...post.comments.map((item) => Number(item.id))) + 1
      : 1;

    post.comments.push({
      id: nextId,
      author,
      content,
      date: new Date().toISOString().substring(0, 10),
    });

    alert("댓글이 등록되었습니다.");
  }

  savePosts(posts);
  resetCommentForm();
  renderComments(post);
}

window.startEditComment = function (commentId) {
  const post = getCurrentPost();
  if (!post) return;

  const comment = (post.comments || []).find((item) => Number(item.id) === Number(commentId));
  if (!comment) return;

  document.getElementById("editingCommentId").value = comment.id;
  document.getElementById("commentAuthor").value = comment.author;
  document.getElementById("commentContent").value = comment.content;
  document.getElementById("commentSubmitBtn").textContent = "댓글 수정";
};

window.deleteComment = function (commentId) {
  if (!confirm("댓글을 삭제할까요?")) return;

  const posts = getPosts();
  const post = posts.find((item) => Number(item.id) === Number(currentPostId));
  if (!post) return;

  post.comments = (post.comments || []).filter((item) => Number(item.id) !== Number(commentId));

  savePosts(posts);
  renderComments(post);
};

function resetCommentForm() {
  document.getElementById("editingCommentId").value = "";
  document.getElementById("commentAuthor").value = "";
  document.getElementById("commentContent").value = "";
  document.getElementById("commentSubmitBtn").textContent = "댓글 등록";
}

function deleteCurrentPost() {
  if (!confirm("이 게시글을 삭제할까요?")) return;

  const posts = getPosts();
  const updated = posts.filter((post) => Number(post.id) !== Number(currentPostId));

  savePosts(updated);
  alert("게시글이 삭제되었습니다.");
  window.location.href = "community.html";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}