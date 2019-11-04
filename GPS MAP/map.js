function initMap() {

	// マップの初期化
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: { lat: 36.38992, lng: 139.06065 }
	});

	// クリックイベントを追加
	map.addListener('click', function (e) {
		getClickLatLng(e.latLng, map);
	});
}

var marker;
let markerArray = [];

function getClickLatLng(lat_lng, map) {

	if (marker) {
		marker.setMap(null);
	}
	// 座標を表示
	document.getElementById('lat').textContent = lat_lng.lat();
	document.getElementById('lng').textContent = lat_lng.lng();

	// マーカーを設置
	marker = new google.maps.Marker({
		position: lat_lng,
		map: map
	});

	// 座標の中心をずらす
	// http://syncer.jp/google-maps-javascript-api-matome/map/method/panTo/
	marker.setMap(map);
}

function Upd8PosList() {
	let target = document.getElementById('posList');
	target.innerHTML = '';
	for (let i = 0; i < markerArray.length; i++) {
		target.innerHTML += '<li>' + 'lat:' + markerArray[i].position.lat() + ' lng:' + markerArray[i].position.lng() + '</li>';
	}
}

document.getElementById('okok').addEventListener("click", () => {
	if (marker) {
		markerArray.push(marker);
		let StackLen = localStorage.getItem('Sabakan.StackLen') * 1;
		if (isNaN(StackLen)) {
			StackLen = 0;
		}
		localStorage.setItem('Sabakan.Stack.' + StackLen + '.lat', marker.position.lat());
		localStorage.setItem('Sabakan.Stack.' + StackLen + '.lng', marker.position.lng());
		localStorage.setItem('Sabakan.StackLen', markerArray.length);
		marker = null;
	}
	Upd8PosList();
});

document.getElementById('ngng').addEventListener("click", () => {
	if (markerArray.length > 0) {
		marker = markerArray.pop();
		marker.setMap(null);
		delete marker;
		let StackLen = localStorage.getItem('Sabakan.StackLen') * 1;
		if (isNaN(StackLen)) {
			StackLen = 0;
		}
		localStorage.removeItem('Sabakan.Stack.' + StackLen + '.lat');
		localStorage.removeItem('Sabakan.Stack.' + StackLen + '.lng');
		localStorage.setItem('Sabakan.StackLen', markerArray.length);
	}
	Upd8PosList();
});

function Welcomeback() {
	let StackLen = localStorage.getItem('Sabakan.StackLen') * 1;
	if (!isNaN(StackLen)) {
		for (let i = 0; i < StackLen; i++) {
			let tempLat = localStorage.getItem('Sabakan.Stack.' + i + '.lat') * 1;
			let tempLng = localStorage.getItem('Sabakan.Stack.' + i + '.lng') * 1;
			let tempLatLng = new google.maps.LatLng({ lat: tempLat, lng: tempLng });
			let tempMarker = new google.maps.Marker({ position: tempLatLng, map: map });
			tempMarker.setMap(map);
			markerArray.push(tempMarker);
		}
	}
	Upd8PosList();
}

document.getElementById('ldld').addEventListener('click', Welcomeback);
