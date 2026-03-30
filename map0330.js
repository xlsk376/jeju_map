const container = document.getElementById("map")

const map = new kakao.maps.Map(container,{

center:new kakao.maps.LatLng(33.3617,126.5292),
level:9

})

const clusterer = new kakao.maps.MarkerClusterer({

map:map,
averageCenter:true,
minLevel:7

})

const markers=[]

const API_URL =
"https://script.google.com/macros/s/AKfycbxW-A_zQLFoXiNbjGKy_0_qFDNZ_Q6hdfFJjdZiRAjcSRwBrbeSaNkwkB7sKJev-CIXDA/exec"

fetch(API_URL)
.then(res=>res.json())
.then(data=>{

data.forEach(place=>{

const marker = new kakao.maps.Marker({
position:new kakao.maps.LatLng(place.lat,place.lng)
})

marker.setMap(map)

})

})

.then(res=>res.json())
.then(data=>{

data.forEach(place=>{

let imageSrc

if(place.category==="맛집"){

imageSrc="images/marker-red.png"

}

else if(place.category==="관광지"){

imageSrc="images/marker-blue.png"

}

else if(place.category==="카페"){

imageSrc="images/marker-green.png"

}

else{

imageSrc="images/marker-blue.png"

}

const imageSize=new kakao.maps.Size(32,35)

const markerImage=
new kakao.maps.MarkerImage(imageSrc,imageSize)

const marker=new kakao.maps.Marker({

position:new kakao.maps.LatLng(place.lat,place.lng),
image:markerImage

})

const infowindow=new kakao.maps.InfoWindow({

content:`

<div style="padding:8px;font-size:13px">

<b>${place.name}</b><br>

${place.category}<br>

<button onclick="openPlace(${place.lat},${place.lng})">
지도 열기
</button>

</div>

`

})

kakao.maps.event.addListener(marker,"click",function(){

infowindow.open(map,marker)

})

markers.push(marker)

})

clusterer.addMarkers(markers)

})

function openPlace(lat,lng){

window.open(
`https://map.kakao.com/link/map/${lat},${lng}`
)

}

navigator.geolocation.getCurrentPosition(function(pos){

const lat=pos.coords.latitude
const lng=pos.coords.longitude

const marker=new kakao.maps.Marker({

map:map,
position:new kakao.maps.LatLng(lat,lng)

})

map.setCenter(new kakao.maps.LatLng(lat,lng))

})

const infowindow = new kakao.maps.InfoWindow({

content:`

<div style="padding:10px;font-size:13px">

<b>${place.name}</b><br>
${place.category}<br><br>

<button onclick="openKakao(${place.lat},${place.lng})">
카카오 지도
</button>

<button onclick="openNaver('${place.naver}')">
네이버 지도
</button>

</div>

`

})

function openNaver(url){

window.open(url)

}

function openKakao(lat,lng){

window.open(
`https://map.kakao.com/link/map/${lat},${lng}`
)

}