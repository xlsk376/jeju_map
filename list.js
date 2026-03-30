const API_URL = "https://script.google.com/macros/s/AKfycbxW-A_zQLFoXiNbjGKy_0_qFDNZ_Q6hdfFJjdZiRAjcSRwBrbeSaNkwkB7sKJev-CIXDA/exec"

let places = []
let selectedCardName = null
let currentFilter = "전체"
let isFirstLoad = true

// URL에서 선택값 가져오기
function getSelectedName(){
  const url = new URL(window.location.href)
  return url.searchParams.get("name")
}

const selectedName = getSelectedName()

// 데이터 불러오기
fetch(API_URL)
.then(res=>res.json())
.then(data=>{
  places = data

  // 네이버 링크 생성
  places.forEach(p=>{
    p.naver =
      "https://map.naver.com/v5/search/" +
      encodeURIComponent(p.name)
  })

  renderList()
})

// 로컬 데이터
function loadData(){
  return JSON.parse(localStorage.getItem("jejuData"))||{}
}

function saveData(data){
  localStorage.setItem("jejuData",JSON.stringify(data))
}

// 리스트 렌더링
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

    // ⭐ 최초 1회만 URL 값 적용
    if(isFirstLoad && place.name == selectedName){
      selectedCardName = place.name
    }

    // ⭐ 선택 상태 적용
    if(place.name == selectedCardName){
      div.classList.add("active")

      setTimeout(()=>{
        div.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }

    // ⭐ 카드 클릭 → 선택 토글
    div.onclick = () => {

      if(selectedCardName == place.name){
        selectedCardName = null
      } else {
        selectedCardName = place.name
      }

      renderList()
    }

    // ⭐ 카드 내용
    div.innerHTML=`

    <h3 class="place-name">${place.name}</h3>

    <p>설명: ${place.desc}</p>
    <p>주소: ${place.location}</p>

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

    // ⭐ 제목 클릭 → 지도 이동
    const title = div.querySelector(".place-name")

    title.style.cursor = "pointer"

    title.onclick = (e) => {
      e.stopPropagation()
      window.location.href =
      `map.html?name=${place.name}&lat=${place.lat}&lng=${place.lng}`
    }

    title.onmouseover = () => {
      title.style.color = "blue"
    }

    title.onmouseout = () => {
      title.style.color = ""
    }

    // ⭐ 내부 클릭 시 카드 선택 방지
    div.querySelectorAll("select, input, textarea, a")
    .forEach(el=>{
      el.addEventListener("click", e=>e.stopPropagation())
    })

    list.appendChild(div)

  })

  // ⭐ 최초 로드 이후 비활성화
  isFirstLoad = false
}

// 필터
function filterPlaces(c, el){

  currentFilter = c

  document.querySelectorAll(".filters button")
  .forEach(btn => btn.classList.remove("active"))

  if(el){
    el.classList.add("active")
  }

  renderList()
}

// 저장 기능
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

// 현재 위치
function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(()=>{
      alert("현재 위치 확인 완료")
    })
  }
}