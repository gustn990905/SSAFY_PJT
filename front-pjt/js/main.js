window.onload=function(){

let loginUser=localStorage.getItem("loginUser")

let navMenu=document.getElementById("navMenu")

// 더미 사용자 추가
let users = getData("users") || []
if(users.length === 0){
    let dummyUsers = [
        {id:"user1", pw:"123", name:"김철수", height:"170", weight:"70"},
        {id:"user2", pw:"123", name:"이영희", height:"160", weight:"50"},
        {id:"user3", pw:"123", name:"박민수", height:"175", weight:"80"},
        {id:"user4", pw:"123", name:"정수진", height:"165", weight:"55"},
        {id:"user5", pw:"123", name:"홍길동", height:"180", weight:"85"},
        {id:"user6", pw:"123", name:"김영수", height:"172", weight:"75"},
        {id:"user7", pw:"123", name:"박지현", height:"158", weight:"48"},
        {id:"user8", pw:"123", name:"이민준", height:"178", weight:"82"},
        {id:"user9", pw:"123", name:"최서연", height:"162", weight:"52"},
        {id:"user10", pw:"123", name:"장현우", height:"176", weight:"78"},
        {id:"user11", pw:"123", name:"윤지아", height:"159", weight:"49"},
        {id:"user12", pw:"123", name:"강민재", height:"174", weight:"76"},
        {id:"user13", pw:"123", name:"조은비", height:"161", weight:"51"},
        {id:"user14", pw:"123", name:"임준혁", height:"179", weight:"83"},
        {id:"user15", pw:"123", name:"한소희", height:"163", weight:"53"},
        {id:"user16", pw:"123", name:"오태영", height:"177", weight:"79"},
        {id:"user17", pw:"123", name:"서미라", height:"160", weight:"50"},
        {id:"user18", pw:"123", name:"신동훈", height:"173", weight:"74"},
        {id:"user19", pw:"123", name:"문지은", height:"164", weight:"54"},
        {id:"user20", pw:"123", name:"양승민", height:"181", weight:"87"}
    ]
    setData("users", dummyUsers)
}

if(loginUser){

let user=JSON.parse(loginUser)

document.getElementById("heroSection").innerHTML=`

<h1>안녕하세요, ${user.name || user.id}님!</h1>

<p>오늘의 식단을 기록하고 건강을 관리해보세요</p>
<p>식단 기록 · 영양 분석 · 건강 관리 · 커뮤니티</p>
`

navMenu.innerHTML=`

<li class="nav-item"><a class="nav-link active" href="main.html">홈</a></li>
<li class="nav-item"><a class="nav-link" href="diet.html">식단관리</a></li>
<li class="nav-item"><a class="nav-link" href="community.html">커뮤니티</a></li>
<li class="nav-item"><a class="nav-link" href="challenge.html">챌린지</a></li>
<li class="nav-item"><a class="nav-link" href="ai.html">AI 코칭</a></li>
<li class="nav-item"><a class="nav-link" href="profile.html">회원 수정</a></li>
<li class="nav-item"><a class="nav-link" href="user-list.html">사용자 목록</a></li>
<li class="nav-item"><a class="nav-link" href="#" onclick="logout()">로그아웃</a></li>
`

loadUsers()

document.getElementById("userListSection").style.display="block"

}else{

navMenu.innerHTML=`

<li class="nav-item"><a class="nav-link" href="login.html">로그인</a></li>
<li class="nav-item"><a class="nav-link" href="signup.html">회원가입</a></li>
`

}

let posts=JSON.parse(localStorage.getItem("posts"))||[]

let list=document.getElementById("popularPost")

for(let p of posts.slice(0,5)){

let li=document.createElement("li")

li.className="list-group-item"

li.innerText=p.title

list.appendChild(li)

}

}

function toggleUserList(){

let section=document.getElementById("userListSection")

if(section.style.display==="none" || section.style.display===""){

section.style.display="block"

loadUsers()

}else{

section.style.display="none"

}

}

function loadUsers(filter="", showFollowing=false){

let users=getData("users") || []

let loginUser=JSON.parse(localStorage.getItem("loginUser"))

let follows=getData("follows") || []

let userList=document.getElementById("userList")

userList.innerHTML=""

let filteredUsers = users.filter(u => u.id != loginUser.id && u.status !== "inactive")

if(showFollowing){

let followingIds = follows.filter(f=>f.follower==loginUser.id).map(f=>f.following)

filteredUsers = filteredUsers.filter(u => followingIds.includes(u.id))

}

filteredUsers = filteredUsers.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()) || u.id.toLowerCase().includes(filter.toLowerCase()))

for(let u of filteredUsers){

let isFollowing = follows.find(f=>f.follower==loginUser.id && f.following==u.id)

let btnText = isFollowing ? "팔로우중" : "팔로우"

let btnClass = isFollowing ? "btn-danger" : "btn-outline-danger"

let btnOnclick = isFollowing ? `unfollow('${u.id}')` : `follow('${u.id}')`

let li=document.createElement("li")

li.className="list-group-item d-flex justify-content-between align-items-center"

li.innerHTML=`

<span>${u.name} (${u.id})</span>

<button onclick="${btnOnclick}" class="btn ${btnClass} btn-sm" style="background-color: ${isFollowing ? '#ff69b4' : 'transparent'}; border-color: #ff69b4; color: ${isFollowing ? 'white' : '#ff69b4'}">${btnText}</button>

`

userList.appendChild(li)

}

}

function filterUsers(){

let filter = document.getElementById("userSearch").value

if(typeof currentFilter !== 'undefined') currentFilter = filter;

let showFollowing = document.getElementById("showFollowing")?.textContent === "전체 목록"

if(typeof currentShowFollowing !== 'undefined') currentShowFollowing = showFollowing;

loadUsers(filter, showFollowing)

}

function toggleFollowing(){

let btn = document.getElementById("showFollowing")

let showFollowing = btn.textContent === "내 팔로우 리스트"

btn.textContent = showFollowing ? "전체 목록" : "내 팔로우 리스트"

if(typeof currentShowFollowing !== 'undefined') currentShowFollowing = showFollowing;

let filter = document.getElementById("userSearch")?.value || "";

if(typeof currentFilter !== 'undefined') currentFilter = filter;

loadUsers(filter, showFollowing)

}