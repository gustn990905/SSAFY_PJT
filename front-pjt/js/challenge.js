function loadChallenge(){

let challenges=getData("challenges")

let html=""

for(let c of challenges){

html+=`

<div class="card p-3">

<img src="${c.image || 'https://picsum.photos/300/200'}" class="card-img-top" alt="챌린지 이미지">

<h4><a href="challenge-detail.html?id=${c.id}">${c.title}</a></h4>
<p>${c.desc}</p>
<p>기간: ${c.period}일</p>

<button onclick="join(${c.id})">참여</button>

</div>

`

}

challengeList.innerHTML=html

}

function addChallenge(){

let challenges=getData("challenges")

challenges.push({

id:Date.now(),
title:title.value,
desc:desc.value,
period:period.value,
image:image.value

})

setData("challenges",challenges)

loadChallenge()

}

function updateProgress(id){

let challenges=getData("challenges")

let loginUser=JSON.parse(localStorage.getItem("loginUser"))

for(let c of challenges){

if(c.id==id){

c.progress[loginUser.id] = progressInput.value

}

}

setData("challenges",challenges)

loadChallengeDetail(id)

}