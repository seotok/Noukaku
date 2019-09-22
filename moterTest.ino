//モーター操作UI改善
//温度、水温　センサーの値表示
#include <WiFi.h> 
#include <WiFiClient.h>
#include <WebServer.h>

//水温センサーライブラリ
#include <OneWire.h>
#include <DallasTemperature.h>

//水温センサーの設定
#define ONE_WIRE_BUS 25 // データ(黄)で使用するポート番号
#define SENSER_BIT    9      // 精度の設定bit

//水位センサーの設定
#define WLV_PIN  34


// Wi-Fiに接続するためのSSIDとパスワ－ドを定義する
const char ssid[] = "ESP32AP-SEOTO";
const char password[] = "11111111";

// Webサーバのオブジェクトをserver()として設定する
const IPAddress ip(192,168,0,1);
const IPAddress subnet(255,255,255,0);
WebServer server(80);

//水温センサーからの値
int waterTemp = 0;

//水位センサーからの値
int wlv;
int waterLevel;

//水温センサーで使うやつの定義
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);


//pageA センサー情報表示
const char pageAheader[] PROGMEM = R"=====(
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body>
)=====" ;

const char pageAfooter[] PROGMEM = R"=====(
<input type="button" value="水門操作" onclick="location.href='/toPageB'">
</body>
</html>
)=====" ;



//pageB モーター操作
const char pageB1[] PROGMEM = R"=====(
<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>

<body>

<h1>水門開閉</h1>
)=====";

const char pageB2[] PROGMEM =R"=====(
<center>
<input type="button" class="btn" value="16" onclick="location.href='/moterLevel16'">
<br>
<input type="button" class="btn" value="12" onclick="location.href='/moterLevel12'">
<br>
<input type="button" class="btn" value="8" onclick="location.href='/moterLevel8'">
<br>
<input type="button" class="btn" value="4" onclick="location.href='/moterLevel4'">
<br>
<input type="button" class="btn" value="0" onclick="location.href='/moterLevel0'">
<br>
<input type="button" value="センサー情報" onclick="location.href='/toPageA'">

</center>
<style>
          .btn
          {
              display: block;
              width: 128px;
              height: 64px;
              line-height: 64px;
              background-color: #3692ff;
              color: #fff;
              text-align: center;
              font-size:32px;
          }

          .btn.onclick {
              background-color:#FF66FF ;
          }

          .btn > span:last-of-type,
          .btn.active > span:first-of-type
          {
              display: none;
          }

          .btn.active > span:last-of-type {
              display: inline;
          }
          </style>
</body>
</html>
)=====";



//現在の設定高さを保存しておく変数の定義
int saveLevel = 16; //水位調整板の初期位置

void handleRoot(){

  String pageB="";
  pageB.concat(pageB1);
  pageB.concat("<h2>高さ:"+String(saveLevel)+"cm<h2>");
  pageB.concat(pageB2);
  
 
 server.send(200,"text/html",pageB);

}

void toPageA(){

  //格納
  String result = "";
  result.concat(pageAheader);
  result.concat("<h1>水位: " + String(waterLevel) + "cm</h1>");
  result.concat("<h1>水温:" + String(waterTemp) + " °C </h1>"); //水温表示
  result.concat(pageAfooter);

  //送信
  server.send(200, "text/html", result);
}


void toPageB(){
  
  handleRoot();
  
}

void moterUp(){

  digitalWrite(12, HIGH);

  for (int i = 0; i < 200 *2 ; i++) {
    digitalWrite(13, HIGH);
    delay(1);
    digitalWrite(13, LOW);
    delay(1);
  }
}

void moterDown(){

  digitalWrite(12, LOW);

  for (int i = 0; i < 200 *2 ; i++) {
    digitalWrite(13, HIGH);
    delay(1);
    digitalWrite(13, LOW);
    delay(1);
  }
}

void moterLevel16() {
  
  handleRoot();
  
  if(saveLevel>16){
   for(int i=0;i<saveLevel-16;i++)
   {
    moterDown(); 
   }
    saveLevel=16; 
    return ;
 }
  if(saveLevel<16){
   for(int i=0;i<15-saveLevel;i++)
    {
      moterUp();
    }
    saveLevel=16;
    return;
  }
  if(saveLevel == 16){

    return ;
  } 
}


void moterLevel12() {

  handleRoot();

  if(saveLevel>12){
   for(int i=0;i<saveLevel-12;i++)
   {
    moterDown(); 
   }
   saveLevel=12;
    
    return ;
  }
  if(saveLevel<12){
  for(int i=0;i<12-saveLevel;i++)
  {
    moterUp();
  }
  saveLevel=12;
  
   return;
  }
  if(saveLevel == 12){
    return ;
  } 
}


void moterLevel8() {

  handleRoot();

  if(saveLevel>8){
   for(int i=0;i<saveLevel-8;i++)
   {
    moterDown(); 
   }
    saveLevel=8;
   
    return ;
 }
 if(saveLevel<8){
 for(int i=0;i<9-saveLevel;i++)
  {
    moterUp();
  }
    saveLevel=8;
   
   return;
   } 
  if(saveLevel == 8){
    return ;
  } 
}


void moterLevel4() {

  handleRoot();

  if(saveLevel>4)
  {
   for(int i=0;i<saveLevel-4;i++)
   {
    moterDown(); 
   }
    saveLevel=4; 
    return ;
 }
 if(saveLevel<4){
  for(int i=0;i<4-saveLevel;i++)
  {
    moterUp();
    }
  saveLevel=4;
  
   return;
  }
  if(saveLevel == 4){
  
    return ;
  } 
}

void moterLevel0() {

  handleRoot();

  if(saveLevel>0){
   for(int i=0;i<saveLevel-0;i++)
   {
    moterDown(); 
   }
    saveLevel=0;
  
    return ;
 }
  if(saveLevel<0){
  for(int i=0;i<0-saveLevel;i++)
 {
  moterUp();
  }
  saveLevel=0;
  
   return;
   } 
  if(saveLevel == 0){

    return ;
  } 
}


void setup() {
  
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);
  
  Serial.begin(115200);

  //水温センサーの準備
  sensors.setResolution(SENSER_BIT);

  //Wifiの準備
  WiFi.softAP(ssid,password);
  delay(100);
  WiFi.softAPConfig(ip,ip,subnet);
  IPAddress serverIP = WiFi.softAPIP();

  server.on("/", handleRoot); //ページを更新する関数の設定
  
  server.on("/toPageA", toPageA); //pageA（センサー情報のページ）へ移動する
  server.on("/toPageB", toPageB); //pageB（水門開閉　操作のページ）へ移動する
  
  server.on("/moterUp", moterUp);
  server.on("/moterDown", moterDown);

  //ボタン→モーター動作
  server.on("/moterLevel16", moterLevel16); //高さを15cmに合わせるための関数の設定
  server.on("/moterLevel12", moterLevel12); //高さを12cmに合わせるための関数の設定
  server.on("/moterLevel8", moterLevel8); //高さを9cmに合わせるための関数の設定
  server.on("/moterLevel4", moterLevel4); //高さを６cmに合わせるための関数の設定
  server.on("/moterLevel0", moterLevel0); //高さを0cmに合わせるための関数の設定

  
  server.begin();

}


void loop() {

  sensors.requestTemperatures(); //温度を測る準備
  waterTemp = sensors.getTempCByIndex(0); //温度の結果を取得する

  //水位の値
  wlv = analogRead(WLV_PIN);
  //水位判定
  if(wlv>=0 && wlv < 1500){
   waterLevel = 0;
  }else if(wlv>=1500 && wlv<2500){
    waterLevel = 1;
  }else if(wlv>=2500 && wlv<3000){
    waterLevel = 2;
  }else if(wlv>=3000 && wlv<3500){
    waterLevel = 3;
  }else if(wlv>=3500 && wlv<4096){
    waterLevel = 4;
  }else{
    
  }
  
  server.handleClient();

  Serial.print(waterLevel); //水位表示
  Serial.print(",");
  Serial.print(waterTemp);  //水温表示
  Serial.println("");
  delay(500);
  
}
