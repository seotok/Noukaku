let map;
let marker;
let markerArray = [];

function UpdatePosList() {
	let target = document.getElementById('posList');
	target.innerHTML = '';
	for (let i = 0; i < markerArray.length; i++) {
		target.innerHTML += '<li>' + localStorage.getItem('Sabakan.Stack.' + i + '.name') + '(' + markerArray[i].position.lat() + ', ' + markerArray[i].position.lng() + ')</li>';
	}
}

// マップの初期化処理?
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: { lat: 39.71618282344384, lng: 141.1364221572876 }
	});
	// クリックイベントを追加
	map.addListener('click', function (e) {
		getClickLatLng(e.latLng, map);
	});


	let StackLen = localStorage.getItem('Sabakan.StackLen') * 1;
	if (!isNaN(StackLen)) {
		for (let i = 0; i < StackLen; i++) {
			let tempLat = localStorage.getItem('Sabakan.Stack.' + i + '.lat') * 1;
			let tempLng = localStorage.getItem('Sabakan.Stack.' + i + '.lng') * 1;
			let tempLatLng = new google.maps.LatLng({ lat: tempLat, lng: tempLng });
			let tempMarker = new google.maps.Marker({
				position: tempLatLng,
				map: map,
				icon: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (i + 1) + "|ff7e73|000000"),
			});
			tempMarker.setMap(map);
			markerArray.push(tempMarker);
		}
	}
	UpdatePosList();
}

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
		map: map,
		icon: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (markerArray.length + 1) + "|ff7e73|000000"),
	});

	// 座標の中心をずらす
	// http://syncer.jp/google-maps-javascript-api-matome/map/method/panTo/
	marker.setMap(map);
}

document.getElementById('kill').addEventListener('click', () => {
	if (document.getElementById('PositionName').value === '') {
		alert('番号入れてちょ');
		return;
	}
	if (isNaN(document.getElementById('PositionName').value * 1)) {
		alert('番号だっつってんの');
		return;
	}
	DeleteIt(document.getElementById('PositionName').value * 1);
});

// 指定番号の旗を消す
function DeleteIt(num) {
	let StackLen = localStorage.getItem('Sabakan.StackLen') * 1;
	let i;
	// 旗の 3 は 2 番目に入ってる
	for (i = num * 1; i < StackLen; i++) {
		localStorage.setItem('Sabakan.Stack.' + (i - 1) + '.lat', localStorage.getItem('Sabakan.Stack.' + i + '.lat') * 1);
		localStorage.setItem('Sabakan.Stack.' + (i - 1) + '.lng', localStorage.getItem('Sabakan.Stack.' + i + '.lng') * 1);
		localStorage.setItem('Sabakan.Stack.' + (i - 1) + '.name', localStorage.getItem('Sabakan.Stack.' + i + '.name'));
	}
	localStorage.removeItem('Sabakan.Stack.' + (i - 1) + '.lat');
	localStorage.removeItem('Sabakan.Stack.' + (i - 1) + '.lng');
	localStorage.removeItem('Sabakan.Stack.' + (i - 1) + '.name');
	localStorage.setItem('Sabakan.StackLen', StackLen - 1);
	location.reload();
}

document.getElementById('okok').addEventListener("click", () => {
	if (document.getElementById('PositionName').value === '') {
		alert('場所の名前を入れてちょ');
		return;
	}
	if (marker) {
		markerArray.push(marker);
		let StackLen = localStorage.getItem('Sabakan.StackLen') * 1;
		if (isNaN(StackLen)) {
			StackLen = 0;
		}
		localStorage.setItem('Sabakan.Stack.' + StackLen + '.lat', marker.position.lat());
		localStorage.setItem('Sabakan.Stack.' + StackLen + '.lng', marker.position.lng());
		localStorage.setItem('Sabakan.Stack.' + StackLen + '.name', document.getElementById('PositionName').value);
		localStorage.setItem('Sabakan.StackLen', markerArray.length);
		marker = null;
	}
	UpdatePosList();
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
		localStorage.removeItem('Sabakan.Stack.' + StackLen + '.name');
		localStorage.setItem('Sabakan.StackLen', markerArray.length);
	}
	UpdatePosList();
});

/***************************
 * ここから 鯖缶 関係処理 *
***************************/

let PositionArray = [];

// 度数法から弧度法への変換
function Deg2Rad(deg) {
	return deg * Math.PI / 180;
}

// 緯度と経度の差から距離を算出
function getDistance(x1, y1, x2, y2) {
	const r = 6378137;	// 赤道半径 [m]
	return (r * Math.acos(Math.sin(Deg2Rad(y1)) * Math.sin(Deg2Rad(y2)) + Math.cos(Deg2Rad(y1)) * Math.cos(Deg2Rad(y2)) * Math.cos(Deg2Rad(x2 - x1))));
}

// ボタンを押したときの処理
function sabakan() {
	if (!navigator.geolocation) {	// お前は位置情報使えるんか!?
		alert('鯖缶はあなたの居場所を突き止められませんでした……');
		return false;
	}

	// 鯖缶のために PositionArray を構成する
	{
		PositionArray = [];
		let StackLen = localStorage.getItem('Sabakan.StackLen') * 1;
		for (let i = 0; i < StackLen; i++) {
			let tempPosition = {};
			tempPosition.lat = localStorage.getItem('Sabakan.Stack.' + i + '.lat') * 1;
			tempPosition.lng = localStorage.getItem('Sabakan.Stack.' + i + '.lng') * 1;
			tempPosition.name = localStorage.getItem('Sabakan.Stack.' + i + '.name');
			tempPosition.d = 0;
			PositionArray.push(tempPosition);
		}
	}
	// 詳細な位置情報頂戴
	navigator.geolocation.enableHighAccuracy = false;

	// 位置情報の取得に成功した時に呼ばれるやつ
	let successCallback = function (position) {
		// 鯖に送られる文字列 {"緯度 経度"}

		let ServerMessage = position.coords.latitude + " " + position.coords.longitude;

		document.getElementById("SabakanOutput").innerHTML = ServerMessage + "<br>";
		for (i = 0; i < PositionArray.length; i++) {
			PositionArray[i].d = getDistance(position.coords.longitude, position.coords.latitude, PositionArray[i].lng, PositionArray[i].lat);
		}

		function CompFunc(a, b) {
			return a.d - b.d;
		}

		PositionArray.sort(CompFunc);
		document.getElementById("SabakanOutput").innerHTML += "<h2>爆破する場所を選んでください<h2>"
		for (i = 0; i < PositionArray.length; i++) {
			document.getElementById("SabakanOutput").innerHTML += "<input value='" + PositionArray[i].name + "' style='height: 5rem; font-size: 2rem;' type='button'><br>";
		}
	}
	let failCallback = function (error) {
		let msgArray = [
			"あなたの居場所を突き止める権限がなかった",
			"何らかの異常が発生した",
			"あなたの居場所を突き止めるのに時間がかかりすぎた"
		];
		alert('鯖缶は' + msgArray[error.code - 1] + 'のであなたの今所を突き止められませんでした……');
		return false;
	}

	navigator.geolocation.getCurrentPosition(successCallback, failCallback);
	return true;
}
