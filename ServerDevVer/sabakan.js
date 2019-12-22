PositionArray = [
	{ name: "東京タワー", y: 35.658581, x: 139.745433, d: 0 },
	{ name: "京都タワー", y: 34.987531, x: 135.759324, d: 0 },
	{ name: "原爆ドーム", y: 34.395483, x: 132.453592, d: 0 },
	{ name: "とけいだい", y: 43.063276, x: 141.331434, d: 0 },
	{ name: "いわて大学", y: 39.715739, x: 141.137295, d: 0 },
];

// 度数法から弧度法への変換
function Deg2Rad(deg) {
	return deg * Math.PI / 180;
}

// 緯度と経度の差から距離を算出
function getDistance(x1, y1, x2, y2) {
	const r = 6378137;	// 赤道半径 [m]
	return (r * Math.acos(Math.sin(Deg2Rad(y1)) * Math.sin(Deg2Rad(y2)) + Math.cos(Deg2Rad(y1)) * Math.cos(Deg2Rad(y2)) * Math.cos(Deg2Rad(x2 - x1))));
}

// 送信ボタンを押したときの処理
function sabakan() {
	if (!navigator.geolocation) {	// お前は位置情報使えるんか!?
		alert("お前位置情報使えないじゃん！\nうんち！");
		return false;
	}

	// 詳細な位置情報頂戴
	navigator.geolocation.enableHighAccuracy = true;


	// 位置情報の取得に成功した時に呼ばれるやつ
	function successCallback(position) {
		// 鯖に送られる文字列 {"緯度 経度"}

		let ServerMessage = position.coords.latitude + " " + position.coords.longitude;

		document.getElementById("SabakanOutput").innerHTML = "<br>";
		for (i = 0; i < PositionArray.length; i++) {
			PositionArray[i].d = getDistance(position.coords.longitude, position.coords.latitude, PositionArray[i].x, PositionArray[i].y);
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
	function failCallback(error) {
		alert("じゃんねん\nうんち！\nError Code: " + error.code + "\nError Msg: " + error.message);
		return false;
	}

	navigator.geolocation.getCurrentPosition(successCallback, failCallback);

	return true;
}
