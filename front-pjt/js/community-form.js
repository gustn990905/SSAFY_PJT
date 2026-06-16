const STORAGE_KEY = "communityPosts";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const id = Number(params.get("id"));

  // 수정 모드
  if (mode === "edit" && id) {
    loadPostForEdit(id);
    const titleEl = document.getElementById("formTitle");
    const submitEl = document.getElementById("submitBtn");
    if (titleEl) titleEl.textContent = "게시글 수정";
    if (submitEl) submitEl.textContent = "수정하기";
  }

  document.getElementById("postForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (mode === "edit" && id) updatePost(id);
    else createPost();
  });
});

function getPosts() {
  // ✅ storage.js 기반
  return getData(STORAGE_KEY) || [];
}

function savePosts(posts) {
  setData(STORAGE_KEY, posts);
}

function loadPostForEdit(id) {
  const posts = getPosts();
  const post = posts.find((item) => Number(item.id) === Number(id));
  if (!post) {
    alert("게시글을 찾을 수 없습니다.");
    window.location.href = "community.html";
    return;
  }

  document.getElementById("postId").value = post.id ?? "";
  document.getElementById("author").value = post.author ?? "";
  document.getElementById("category").value = post.category ?? "질문";
  document.getElementById("title").value = post.title ?? "";
  document.getElementById("content").value = post.content ?? "";
}

function createPost() {
  const posts = getPosts();

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const author = document.getElementById("author").value.trim();
  const category = document.getElementById("category").value;

  if (!title || !content || !author || !category) {
    alert("모든 항목을 입력하세요.");
    return;
  }

  const nextId = posts.length ? Math.max(...posts.map((p) => Number(p.id))) + 1 : 1;

  const newPost = {
    id: nextId,
    title,
    content,
    author,
    date: new Date().toISOString().substring(0, 10),
    category,
    likes: 0,
    comments: [],
  };

  // 최신글이 위로 오게 unshift
  savePosts([newPost, ...posts]);

  alert("게시글이 등록되었습니다.");
  window.location.href = "community.html";
}

function updatePost(id) {
  const posts = getPosts();
  const index = posts.findIndex((p) => Number(p.id) === Number(id));
  if (index === -1) {
    alert("게시글을 찾을 수 없습니다.");
    window.location.href = "community.html";
    return;
  }

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const author = document.getElementById("author").value.trim();
  const category = document.getElementById("category").value;

  if (!title || !content || !author || !category) {
    alert("모든 항목을 입력하세요.");
    return;
  }

  posts[index].title = title;
  posts[index].content = content;
  posts[index].author = author;
  posts[index].category = category;

  savePosts(posts);

  alert("게시글이 수정되었습니다.");
  window.location.href = `community-detail.html?id=${id}`;
}