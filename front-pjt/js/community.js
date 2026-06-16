// challenge.js와 동일하게 storage.js(getData/setData) 사용 전제

function normalizeCategory(category) {
  if (category === "질문" || category === "정보" || category === "식단") return category;

  const map = {
    review: "질문",
    expert: "정보",
    free: "식단",
    "식단 리뷰": "질문",
    전문가: "정보",
    자유: "식단",
  };

  return map[category] || "질문";
}

function normalizePosts(posts) {
  return (posts || []).map((post) => ({
    id: Number(post.id),
    title: post.title || "",
    content: post.content || "",
    author: post.author || "",
    date: post.date || new Date().toISOString().substring(0, 10),
    category: normalizeCategory(post.category),
    likes: Number(post.likes || 0),
    comments: Array.isArray(post.comments) ? post.comments : [],
  }));
}

async function initializeCommunityPostsIfEmpty() {
  let posts = getData("communityPosts") || [];

  if (Array.isArray(posts) && posts.length > 0) return;

  try {
    const response = await fetch("diet/community.json");
    const data = await response.json();

    if (Array.isArray(data)) posts = normalizePosts(data);
    else if (Array.isArray(data.posts)) posts = normalizePosts(data.posts);
    else posts = [];

    setData("communityPosts", posts);
  } catch (e) {
    console.error("community.json 로드 실패:", e);
    setData("communityPosts", []);
  }
}

async function loadCommunity() {
  await initializeCommunityPostsIfEmpty();
  fetchAllPosts();
}

/* -----------------------------
  렌더링 (✅ 상세 링크를 community-detail.html로!)
------------------------------ */
function renderPostsTable(posts) {
  const tbody = document.getElementById("postTableBody");
  const countText = document.getElementById("postCountText");
  if (!tbody || !countText) return;

  countText.textContent = `총 ${posts.length}건`;

  if (posts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted py-4">게시글이 없습니다.</td>
      </tr>
    `;
    return;
  }

  const sorted = [...posts].sort((a, b) => Number(b.id) - Number(a.id));

  tbody.innerHTML = sorted.map((p) => {
    const commentCount = Array.isArray(p.comments) ? p.comments.length : 0;

    return `
      <tr>
        <td>${p.id}</td>
        <td>${escapeHtml(p.category)}</td>
        <td>
          <!-- ✅ 원래 파일로 연결 -->
          <a href="community-detail.html?id=${p.id}" class="text-decoration-none">
            ${escapeHtml(p.title)}
          </a>
        </td>
        <td>${escapeHtml(p.author)}</td>
        <td>${Number(p.likes || 0)}</td>
        <td>${commentCount}</td>
        <td>${escapeHtml(p.date)}</td>
        <td>
          <div class="d-flex gap-1 flex-wrap">
            <button class="btn btn-sm btn-outline-warning" onclick="likePost(${p.id})">좋아요</button>

            <!-- ✅ 조회도 community-detail.html -->
            <a class="btn btn-sm btn-outline-success" href="community-detail.html?id=${p.id}">조회</a>

            <!-- ✅ 수정은 community-form.html?mode=edit&id=... 로 -->
            <a class="btn btn-sm btn-outline-primary" href="community-form.html?mode=edit&id=${p.id}">수정</a>

            <button class="btn btn-sm btn-outline-danger" onclick="deletePost(${p.id})">삭제</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

/* -----------------------------
  조회/검색
------------------------------ */
function fetchAllPosts() {
  const posts = normalizePosts(getData("communityPosts") || []);
  renderPostsTable(posts);
}

function searchByPostId() {
  const input = document.getElementById("searchPostId");
  const id = Number(input?.value);
  if (!id) {
    alert("게시글 ID를 입력하세요.");
    return;
  }

  const posts = normalizePosts(getData("communityPosts") || []);
  renderPostsTable(posts.filter((p) => Number(p.id) === id));
}

function searchByAuthor() {
  const input = document.getElementById("searchAuthor");
  const keyword = (input?.value || "").trim().toLowerCase();
  if (!keyword) {
    alert("작성자 ID를 입력하세요.");
    return;
  }

  const posts = normalizePosts(getData("communityPosts") || []);
  renderPostsTable(posts.filter((p) => String(p.author || "").toLowerCase().includes(keyword)));
}

function searchByCategory() {
  const select = document.getElementById("searchCategory");
  const cat = select?.value || "";

  const posts = normalizePosts(getData("communityPosts") || []);
  if (!cat) {
    renderPostsTable(posts);
    return;
  }

  renderPostsTable(posts.filter((p) => p.category === cat));
}

/* -----------------------------
  관리 기능
------------------------------ */
function likePost(postId) {
  const posts = normalizePosts(getData("communityPosts") || []);
  const post = posts.find((p) => Number(p.id) === Number(postId));
  if (!post) return;

  post.likes = Number(post.likes || 0) + 1;
  setData("communityPosts", posts);
  fetchAllPosts();
}

function deletePost(postId) {
  if (!confirm("이 게시글을 삭제할까요?")) return;

  const posts = normalizePosts(getData("communityPosts") || []);
  const updated = posts.filter((p) => Number(p.id) !== Number(postId));

  setData("communityPosts", updated);
  alert("게시글이 삭제되었습니다.");
  fetchAllPosts();
}

/* -----------------------------
  이벤트 연결
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnFetchAllPosts")?.addEventListener("click", fetchAllPosts);
  document.getElementById("btnSearchPostId")?.addEventListener("click", searchByPostId);
  document.getElementById("btnSearchAuthor")?.addEventListener("click", searchByAuthor);
  document.getElementById("btnSearchCategory")?.addEventListener("click", searchByCategory);
});

/* -----------------------------
  유틸
------------------------------ */
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}