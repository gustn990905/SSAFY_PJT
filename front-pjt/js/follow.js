function follow(userId){

let follows=getData("follows") || []

let loginUser=JSON.parse(localStorage.getItem("loginUser"))

if(!follows.find(f=>f.follower==loginUser.id && f.following==userId)){

follows.push({follower:loginUser.id, following:userId})

setData("follows",follows)

showToast("팔로우 완료")

if(typeof refreshUsers === 'function') refreshUsers();
else if(typeof loadUsers === 'function') loadUsers();

}

}

function unfollow(userId){

let follows=getData("follows") || []

let loginUser=JSON.parse(localStorage.getItem("loginUser"))

follows=follows.filter(f=>!(f.follower==loginUser.id && f.following==userId))

setData("follows",follows)

showToast("언팔로우 완료")

if(typeof refreshUsers === 'function') refreshUsers();
else if(typeof loadUsers === 'function') loadUsers();

}

function loadFollows(){

let follows=getData("follows") || []

let users=getData("users") || []

let loginUser=JSON.parse(localStorage.getItem("loginUser"))

let following=follows.filter(f=>f.follower==loginUser.id).map(f=>f.following)

let followers=follows.filter(f=>f.following==loginUser.id).map(f=>f.follower)

let followingNames=following.map(id=>users.find(u=>u.id==id)?.name || id)

let followersNames=followers.map(id=>users.find(u=>u.id==id)?.name || id)

followList.innerHTML=`

<div class="mt-4">
<h4 class="mb-3">팔로잉 (${following.length})</h4>
<ul class="list-group">${followingNames.map(name=>`<li class="list-group-item">${name}</li>`).join('')}</ul>
</div>
<div class="mt-4">
<h4 class="mb-3">팔로워 (${followers.length})</h4>
<ul class="list-group">${followersNames.map(name=>`<li class="list-group-item">${name}</li>`).join('')}</ul>
</div>
`

}