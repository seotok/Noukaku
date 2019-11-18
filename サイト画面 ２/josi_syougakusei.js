function Coordinate(_number, _y, _x, _d, _suii) {
  this.number = _number;
  this.y = _y;
  this.x = _x;
  this.d = _d;
  this.suii = _suii;
}

var minami = [];
    minami[0] = new Coordinate(11, 35.658581, 139.745433, 0, 8); //東京タワー
    minami[1] = new Coordinate(12, 34.987531, 135.759324, 0, 8); //京都タワー
    minami[2] = new Coordinate(13, 34.395483, 132.453592, 0, 8); //原爆ドーム
    minami[3] = new Coordinate(14, 43.063276, 141.331434, 0, 8); //とけいだい
    minami[4] = new Coordinate(15, 39.715739, 141.137295, 0, 8); //岩手大学


function Deg2Rad(deg){ //度数法から弧度法に
  return deg * Math.PI / 180;
}


function getDistance(x1, y1, x2, y2){  //距離の算出
  const r = 6378137;  //赤道半径(m)
  return (r * Math.acos(Math.sin(Deg2Rad(y1)) * Math.sin(Deg2Rad(y2)) + Math.cos(Deg2Rad(y1)) * Math.cos(Deg2Rad(y2)) * Math.cos(Deg2Rad(x2 - x1))));
}


function josi_syougakusei(){  //ボタンを押したら

  if(!navigator.geolocation){  //位置情報取れます？
    alert("位置情報。。。残念です");
    return false;
  }

  navigator.geolocation.enableHighAccuracy = true;  //位置情報求む

  function successCallBack(position){

     let ServerMessage = position.coords.latitude + " , " + position.coords.longitude;
  // document.getElementById("syougakusei").innerHTML = ServerMessage + "<br>";
     document.getElementById("syougakusei").innerHTML = "<br>";//無限増殖阻止

    for(i = 0; i < minami.length; i++){  //距離の算出関数に数値を渡す
      minami[i].d = getDistance(position.coords.longitude, position.coords.latitude, minami[i].x, minami[i].y);
    }
    function CompFunc(a, b){
    return a.d - b.d;
  }
    minami.sort(CompFunc);
    for(i = 0; i < 5; i++){  //地点の表示
      document.getElementById("syougakusei").innerHTML += "<input value='" + minami[i].number + "' type='button'><br>";
    }
  }

  function failCallback(error){
    alert("miss\nError Code: " + error.code + "\nError Msg: " + error.message);
    return false;
  }
  navigator.geolocation.getCurrentPosition(successCallBack, failCallback);
  return true;
}










//https://www.atmarkit.co.jp/ait/articles/1011/29/news109_2.html　　構造体的なやつ
