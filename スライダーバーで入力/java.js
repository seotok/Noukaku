
//javaからボタンの文字を変更
document.getElementById('nyann').innerHTML = 'にゃんにゃん先生';
document.getElementById('neko').innerHTML = 'にゃんこ先生';
document.getElementById('cat').innerHTML = 'にゃんこ戦士';


/*
//javaでHTML要素を作成
var p = document.createElement('p');
p.innerHTML = 'ねこあつめ';
document.body.appendChild(p);
*/



//配列的なものでボタンの中身を送りたい
var nyanko = ['ミケ', 'ハル', 'ハチ', 'エリー'];

document.getElementById('h0').innerHTML = nyanko[0];
document.getElementById('h1').innerHTML = nyanko[1];
document.getElementById('h2').innerHTML = nyanko[2];
document.getElementById('h3').innerHTML = nyanko[3];


//構造体的な物でボタンの中身を作りたい
//スライダーバー　https://itsakura.com/html5-range
function nekoneko55(_mike, _tyobi){
  this.mike = _mike;
  this.tyobi = _tyobi;
}

var nekoneko = [];
    nekoneko[0] = new nekoneko55(1, 0);
    nekoneko[1] = new nekoneko55(2, 0);
    nekoneko[2] = new nekoneko55(3, 0);
    nekoneko[3] = new nekoneko55(4, 0);
    nekoneko[4] = new nekoneko55(5, 0);

    if(!localStorage.getItem('srider0')) {
      srider0 = "データがありません";
    } else {
      srider0 = localStorage.getItem('srider0');
      nekoneko[0].tyobi = srider0;
    }

    if(!localStorage.getItem('srider1')) {
      srider1 = "データがありません";
    } else {
      srider1 = localStorage.getItem('srider1');
      nekoneko[1].tyobi = srider1;
    }

    if(!localStorage.getItem('srider2')) {
      srider2 = "データがありません";
    } else {
      srider2 = localStorage.getItem('srider2');
      nekoneko[2].tyobi = srider2;
    }

    if(!localStorage.getItem('srider3')) {
      srider3 = "データがありません";
    } else {
      srider3 = localStorage.getItem('srider3');
      nekoneko[3].tyobi = srider3;
    }

    if(!localStorage.getItem('srider4')) {
      srider4 = "データがありません";
    } else {
      srider4 = localStorage.getItem('srider4');
      nekoneko[4].tyobi = srider4;
    }

document.getElementById('k0').innerHTML = nekoneko[0].mike;
document.getElementById('k1').innerHTML = nekoneko[1].mike;
document.getElementById('k2').innerHTML = nekoneko[2].mike;
document.getElementById('k3').innerHTML = nekoneko[3].mike;
document.getElementById('k4').innerHTML = nekoneko[4].mike;

document.getElementById('kk0').innerHTML = nekoneko[0].tyobi;
document.getElementById('kk1').innerHTML = nekoneko[1].tyobi;
document.getElementById('kk2').innerHTML = nekoneko[2].tyobi;
document.getElementById('kk3').innerHTML = nekoneko[3].tyobi;
document.getElementById('kk4').innerHTML = nekoneko[4].tyobi;

function load0() {
    var srider0 = "";
    if(!localStorage.getItem('srider0')) {
      srider0 = "データがありません";
    } else {
      srider0 = localStorage.getItem('srider0');
    }
    console.log(`srider0= ${srider0}`);
    document.getElementById("srider0_out").innerHTML = srider0;
}

function save0() {    //保存
    var srider0 = document.getElementById("srider0_in").value;
    console.log(`srider0_in = ${srider0_in}`);
    localStorage.setItem('srider0', srider0);
}


function load1() {
    var srider1 = "";
    if(!localStorage.getItem('srider1')) {
      srider1 = "データがありません";
    } else {
      srider1 = localStorage.getItem('srider1');
    }
    console.log(`srider1= ${srider}`);
    document.getElementById("srider1_out").innerHTML = srider1;
}

function save1() {    //保存
    var srider1 = document.getElementById("srider1_in").value;
    console.log(`srider1_in = ${srider1_in}`);
    localStorage.setItem('srider1', srider1);
}


function load2() {
    var srider2 = "";
    if(!localStorage.getItem('srider2')) {
      srider2 = "データがありません";
    } else {
      srider2 = localStorage.getItem('srider2');
    }
    console.log(`srider2= ${srider2}`);
    document.getElementById("srider2_out").innerHTML = srider2;
}

function save2() {    //保存
    var srider2 = document.getElementById("srider2_in").value;
    console.log(`srider2_in = ${srider2_in}`);
    localStorage.setItem('srider2', srider2);
}


function load3() {
    var srider3 = "";
    if(!localStorage.getItem('srider3')) {
      srider3 = "データがありません";
    } else {
      srider3 = localStorage.getItem('srider3');
    }
    console.log(`srider3= ${srider3}`);
    document.getElementById("srider3_out").innerHTML = srider3;
}

function save3() {    //保存
    var srider3 = document.getElementById("srider3_in").value;
    console.log(`srider3_in = ${srider3_in}`);
    localStorage.setItem('srider3', srider3);
}


function load4() {
    var srider4 = "";
    if(!localStorage.getItem('srider4')) {
      srider4 = "データがありません";
    } else {
      srider4 = localStorage.getItem('srider4');
    }
    console.log(`srider4= ${srider4}`);
    document.getElementById("srider4_out").innerHTML = srider4;
}

function save4() {    //保存
    var srider4 = document.getElementById("srider4_in").value;
    console.log(`srider4_in = ${srider4_in}`);
    localStorage.setItem('srider4', srider4);
}


/*
 //保存方法
 //https://techacademy.jp/magazine/19623
function load() {
    var mydata = "";
    if(!localStorage.getItem('mydata')) {
      mydata = "データがありません";
    } else {
      mydata = localStorage.getItem('mydata');
    }
    console.log(`mydata= ${mydata}`);
    document.getElementById("mydata_out").innerHTML = mydata;
}

function save() {    //保存
    var mydata = document.getElementById("mydata_in").value;
    console.log(`mydata_in = ${mydata_in}`);
    localStorage.setItem('mydata', mydata);
}
*/


/*
//スライダーバーで値をとって保存したいの
function load1() {
    var srider = "";
    if(!localStorage.getItem('srider')) {
      srider = "データがありません";
    } else {
      srider = localStorage.getItem('srider');
    }
    console.log(`srider= ${srider}`);
    document.getElementById("srider_out").innerHTML = srider;
}

function save1() {    //保存
    var srider = document.getElementById("srider_in").value;
    console.log(`srider_in = ${srider_in}`);
    localStorage.setItem('srider', srider);
    nekoneko[0].tyobi = srider;
}
*/
