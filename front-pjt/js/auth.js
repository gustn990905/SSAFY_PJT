function signup(){

let users=getData("users")

let user={
id:id.value,
pw:pw.value,
name:name.value,
height:height.value,
weight:weight.value
}

users.push(user)

setData("users",users)

showToast("회원가입 완료")

setTimeout(()=>{location.href="login.html"},2000)

}

function login(){

let users=getData("users")

for(let u of users){

if(u.id===id.value && u.pw===pw.value && u.status !== "inactive"){

localStorage.setItem("loginUser",JSON.stringify(u))

showToast("로그인 성공")

setTimeout(()=>{location.href="main.html"},2000)

return

}

}

showToast("로그인 실패")

}

function logout(){

localStorage.removeItem("loginUser")

location.href="main.html"

}

function loadProfile(){

let user=JSON.parse(localStorage.getItem("loginUser"))

name.value=user.name
id.value=user.id
height.value=user.height || ""
weight.value=user.weight || ""

}

function updateProfile(){

let users=getData("users")

let loginUser=JSON.parse(localStorage.getItem("loginUser"))

for(let u of users){

if(u.id===loginUser.id){

u.name=name.value
u.height=height.value
u.weight=weight.value

}

}

setData("users",users)

let updatedUser = users.find(u => u.id === loginUser.id)
localStorage.setItem("loginUser", JSON.stringify(updatedUser))

showToast("수정되었습니다")

setTimeout(()=>{location.href="main.html"}, 2000)

}

function deleteUser(){

let users=getData("users")

let loginUser=JSON.parse(localStorage.getItem("loginUser"))

for(let u of users){

if(u.id===loginUser.id){

u.status="inactive"

}

}

setData("users",users)

logout()

}

function deactivateUser(){

let users=getData("users")

let loginUser=JSON.parse(localStorage.getItem("loginUser"))

for(let u of users){

if(u.id===loginUser.id){

u.status="inactive"

}

}

setData("users",users)

showToast("비활성화되었습니다")

setTimeout(() => logout(), 2000)

}

function showToast(message){

document.querySelector("#successToast .toast-body").innerText=message;

let toast=new bootstrap.Toast(document.getElementById("successToast"));

toast.show();

}