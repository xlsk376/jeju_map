const API_URL = "https://script.google.com/macros/s/AKfycbxW-A_zQLFoXiNbjGKy_0_qFDNZ_Q6hdfFJjdZiRAjcSRwBrbeSaNkwkB7sKJev-CIXDA/exec"

const container = document.getElementById("map")

const map = new kakao.maps.Map(container, {
  center: new kakao.maps.LatLng(33.3617, 126.5292),
  level: 9
})

// 클러스터
const clusterer = new kakao.maps.MarkerClusterer({
  map: map,
  averageCenter: true,
  minLevel: 7
})

const markers = []

// 현재 열린 인포윈도우 저장
let currentInfowindow = null
let closeTimer = null

// 데이터 불러오기
fetch(API_URL)
.then(res => res.json())
.then(data => {

  data.forEach(place => {

    let imageSrc

    if (place.category === "맛집") {
      imageSrc = "images/marker-red.png"
    } else if (place.category === "관광지") {
      imageSrc = "images/marker-blue.png"
    } else if (place.category === "카페") {
      imageSrc = "images/marker-green.png"
    } else {
      imageSrc = "images/marker-blue.png"
    }

    const imageSize = new kakao.maps.Size(32, 35)

    const markerImage =
      new kakao.maps.MarkerImage(imageSrc, imageSize)

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(place.lat, place.lng),
      image: markerImage
    })

    // 네이버 지도 검색 링크
    const naverUrl =
      "https://map.naver.com/v5/search/" +
      encodeURIComponent(place.name)

    // 인포윈도우
    /*<button onclick="openKakao(${place.lat},${place.lng})">
          카카오 지도
    </button>*/
    const infowindow = new kakao.maps.InfoWindow({
      content: `
      <div style="padding:10px;font-size:13px">
        <b>${place.name}</b><br>
        ${place.category}<br><br>


        <button onclick="openNaver('${naverUrl}')">
          네이버 지도
        </button>
      </div>
      `
    })

    kakao.maps.event.addListener(marker, "click", function () {

      // 기존 인포윈도우 닫기
      if (currentInfowindow) {
        currentInfowindow.close()
      }

      // 기존 타이머 제거
      if (closeTimer) {
        clearTimeout(closeTimer)
      }

      // 새 인포윈도우 열기
      infowindow.open(map, marker)
      currentInfowindow = infowindow

      // 3초 후 자동 닫기
      closeTimer = setTimeout(() => {
        infowindow.close()
      }, 3000)

    })

    markers.push(marker)
  })

  clusterer.addMarkers(markers)
})

// 카카오 지도 열기
function openKakao(lat, lng) {
  window.open(`https://map.kakao.com/link/map/${lat},${lng}`)
}

// 네이버 지도 열기
function openNaver(url) {
  window.open(url)
}

// 현재 위치 표시
navigator.geolocation.getCurrentPosition(function (pos) {

  const lat = pos.coords.latitude
  const lng = pos.coords.longitude

  const marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(lat, lng)
  })

  map.setCenter(new kakao.maps.LatLng(lat, lng))

})