// シリアルモニタからコマンドを直接入力して制御するためのプログラム
// reset と入力するとLoRaをリセットするようになっている
// config と入力するとLoRaのリセット後にconfigurationモードへ移行

#include <string.h>

static const int LORA_RST = 14;  // リセットピン
const int BAUDRATE = 115200;  // ボーレート 通信速度的なやつ

//////////////////// シリアルモニタに入力された文字列を受け取るための関数
int Ser_recv(char *buf)  // 返り値は受信した文字列末のインデックス
{
  char *start = buf;
  
  while (true) 
  {
    delay(0);
    while (Serial.available() > 0) 
    {
      *buf++ = Serial.read();
      if (*(buf-2) == '\r' && *(buf-1) == '\n') 
      {
        *buf = '\0';
        return (buf - start);
      }
    }
  }
}

////////////////////////////// LoRaから文字列を受け取るための関数
int LoRa_recv(char *buf)    // 返り値は受信した文字列末のインデックス
{
  char *start = buf;
  
  while (true) 
  {
    delay(0);
    while (Serial2.available() > 0) 
    {
      *buf++ = Serial2.read();
      if (*(buf-2) == '\r' && *(buf-1) == '\n') 
      {
        *buf = '\0';
        return (buf - start);
      }
    }
  }
}

////////////////////////////// LoRaへ文字列を送信するための関数 
int LoRa_send(char * msg)   // 返り値は送信した文字列末のインデックス
{
  char *start = msg;
  
  while (*msg != '\0')
  {
    Serial2.write(*msg++);
    Serial2.write("\r\n");
  }
  return (msg - start);
}

////////////////////////////// LoRaをリセットするための関数
void LoRa_reset(void)
{
  digitalWrite(LORA_RST, LOW);  // LOWにするとリセット
  delay(100);
  digitalWrite(LORA_RST, HIGH);  // リセットしたらHIGHに戻すこと
}

////////////////////////////// 初期化
void setup() 
{
  // リセットピンの初期化
  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST,HIGH);  // リセットピンは通常時はHIGH

  // シリアル通信の確立
  Serial.begin(BAUDRATE);   // シリアルモニタで通信するほう
  Serial2.begin(BAUDRATE);  // LoRaとのシリアル通信を行うほう

  // 送受信可能になるまでの時間調整
  delay(1500);
}

////////////////////////////// メインループ
void loop() 
{
  ////////// 送信部 
  
  char serv[64];  // シリアルモニタに入力された文字列を保存しておく配列
  
  if(Serial.available() > 0)
  {
    Ser_recv(serv);  // シリアル入力から文字列を受け取る
    Serial.print(serv);
    
    // reset と打ち込まれていた際はLoRaをリセットする
    if(strstr(serv, "reset"))
    {
      LoRa_reset(); 
      return;
    }
     
    LoRa_send(serv);  // LoRaへ送信
  }

  ////////// 受信部
  
  String recv;  // LoRaから受け取った文字列を保存しておく変数
  
  if(Serial2.available() > 0)
  {  
    // LoRa_recv() を使っていませんが悪しからず
    recv = Serial2.readStringUntil('\n');  
  }
  
  /*  Srting型であれば文字列検索など便利な関数を使えるが、
   *  一部の関数を使用する際に変換が必要になる
   *  
   *  LoRa_recv()を使う場合は以下のようになる
   *  
   *    char recv[64];
   *    if(Serial2.available() > 0)
   *    {
   *      LoRa_recv(recv);
   *    }
   *  
   *  こちらはchar型を使えるため atoi 等を使えるが、
   *  処理が少し遅くなるようだ
   */
   
  Serial.println(recv);  // シリアルモニタへの表示
  
  delay(1000);
}
