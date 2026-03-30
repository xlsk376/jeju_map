let currentFilter="전체"

function loadData(){
return JSON.parse(localStorage.getItem("jejuData"))||{}
}

function saveData(data){
localStorage.setItem("jejuData",JSON.stringify(data))
}

function renderList(){

const list=document.getElementById("list")
list.innerHTML=""

const userData=loadData()

const filtered=currentFilter==="전체"
? places
: places.filter(p=>p.category===currentFilter)

filtered.forEach(place=>{

const data=userData[place.id]||{}

const div=document.createElement("div")
div.className="card"

div.innerHTML=`

<h3>${place.name}</h3>
<p>${place.location}</p>

<a href="${place.naver}" target="_blank">네이버 지도</a>

<br><br>

⭐ 평점

<select onchange="saveRating(${place.id},this.value)">

<option value="">선택</option>
<option ${data.rating==1?"selected":""}>1</option>
<option ${data.rating==2?"selected":""}>2</option>
<option ${data.rating==3?"selected":""}>3</option>
<option ${data.rating==4?"selected":""}>4</option>
<option ${data.rating==5?"selected":""}>5</option>

</select>

<br><br>

✔ 방문

<input type="checkbox"
${data.visited?"checked":""}
onchange="toggleVisit(${place.id},this.checked)">

<br><br>

📝 메모

<textarea onchange="saveMemo(${place.id},this.value)">
${data.memo||""}
</textarea>

`

list.appendChild(div)

})

}

function filterPlaces(c){

currentFilter=c
renderList()

}

function saveRating(id,value){

const data=loadData()
data[id]=data[id]||{}
data[id].rating=value

saveData(data)

}

function toggleVisit(id,v){

const data=loadData()
data[id]=data[id]||{}
data[id].visited=v

saveData(data)

}

function saveMemo(id,v){

const data=loadData()
data[id]=data[id]||{}
data[id].memo=v

saveData(data)

}

function getLocation(){

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(pos=>{

alert("현재 위치 확인 완료")

})

}

}

renderList()