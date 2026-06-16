function dietAI(){

let diets=getData("diets")

if(diets.length<3){

aiResult.innerText="식단 기록을 더 추가하세요 (최소 3개)"

}else{

let totalCal=0, totalProtein=0

for(let d of diets){

totalCal+=Number(d.cal)

totalProtein+=Number(d.protein)

}

let advice="총 칼로리: "+totalCal + "kcal, 단백질: "+totalProtein+"g. "

if(totalProtein < 50){

advice+="단백질 섭취를 늘리세요."

}else{

advice+="균형 잡힌 식단입니다."

}

aiResult.innerText=advice

}

}

function exerciseAI(){

let user=JSON.parse(localStorage.getItem("loginUser"))

let advice=""

if(user && user.height && user.weight){

let bmi = user.weight / ((user.height/100)**2)

if(bmi < 18.5){

advice="체중 증가를 위한 근력 운동 추천: 스쿼트, 벤치프레스"

}else if(bmi > 25){

advice="체중 감소를 위한 유산소 운동 추천: 달리기, 수영"

}else{

advice="균형 유지를 위한 운동: 요가, 필라테스"

}

}else{

advice="프로필에 키와 몸무게를 입력하세요."

}

aiExercise.innerText=advice

}