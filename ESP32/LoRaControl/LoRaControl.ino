#include <string.h>

// モーターの回転方向の指定用
const int UP   = HIGH;
const int DOWN = LOW;

// ピン
const int DigMotorPinDir = 13;
const int DigMotorPinCont = 12;
static const int LoRa_Rst = 14;
const int LEDPin = A10; //PIN4
const int LEDGroup = 0;
const int SensorPin = A5; //PIN33

// 回転数と高さの変化量の比. 回転数 : 変化量 = X : 1
const float ROT_BIAS = 1;  

// configuration設定用
const int bw = 4;
const int sf = 7;
const int channel = 1;
const char panid[7] = "e 0001";
const char ownid[7] = "f 0002";
const char dstid[7] = "g FFFF";
const int ack = 1;
const int retry = 1;
const int transmode = 1;
const int rcvid = 2;
const int rssi = 2;
const int operation = 2;
const int baudrate = 5;
const int slp = 1;
const int slptime = 50;
const int power = 13;
const int format = 1;

// 送信フォーマット集
const char *SendFormats[] = {
"sense %d"
};

// 命令リスト
const char *TaskList[] = {
  "gate",
  "led"
};
const int TaskNum = 2;

////////////////////////////////////////// ユーザー入力
int Ser_recv(char *buf)
{
  if(Serial.available()>0)
  {
    String str = Serial.readStringUntil('\n');
    str.toCharArray(buf, 64);
    return 0;
  }
  return 1;
  /*
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
  }*/
}

////////////////////////////////////////// 受信用関数
int LoRa_recv(char *buf) 
{
  if(Serial2.available()>0)
  {
    String str = Serial2.readStringUntil('\n');
    str.toCharArray(buf, 64);
    return 0;
  }
  return 1;
  /*
    char *start = buf;
    while (true) {
        delay(0);
        while (Serial2.available() > 0) {
            *buf++ = Serial2.read();
            if (*(buf-2) == '\r' && *(buf-1) == '\n') {
                *buf = '\0';
                return (buf - start);
            }
        }
    }*/
}

////////////////////////////////////////// 送信用関数
int LoRa_send(char * msg) 
{
  char *start = msg;
  while (*msg != '\0') 
  {
    Serial2.write(*msg++);
  }
  Serial2.write("\r\n");
  return (msg - start);
}

////////////////////////////////////////// リセット用関数
void LoRa_reset(void) 
{
  digitalWrite(LoRa_Rst, LOW);
  delay(100);
  digitalWrite(LoRa_Rst, HIGH);
}

////////////////////////////////////////// コマンド処理関数
int sendcmd(char *cmd) 
{
  char buf[64];
  //Serial.print(cmd);
  LoRa_send(cmd);
  while (true) 
  {
    LoRa_recv(buf);
    if (strstr(buf, "OK")) 
    {
      Serial.println(buf);
      return true;
    } 
    else if (strstr(buf, "NG")) 
    {
      Serial.print(buf);
      return false;
    }
  }
}

////////////////////////////////////////// 初期設定用関数
void LoRa_Setup(int received)  // received : 0でconfig送信
{
  char buf[64];
  const char cmddelay = 100;
  if(!received)
  {
    sprintf(buf, "config");
    LoRa_send(buf);
    delay(200);
    LoRa_reset();
    delay(2000);
    
    while (true)  // 後で直す
    {
      LoRa_recv(buf);
      Serial.println(buf);
      if (strstr(buf, "Mode")) 
      {
        break;
      }
      delay(cmddelay);
    }
  }
  sprintf(buf, "2");  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "b %d", bw);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "c %d", sf);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "d %d", channel);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, panid);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, ownid);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, dstid);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "l %d", ack);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "m %d", retry);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "n %d", transmode);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "o %d", rcvid);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "p %d", rssi);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "q %d", operation);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "r %d", baudrate);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "s %d", slp);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "t %d", slptime);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "u %d", power);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "A %d", format);  sendcmd(buf);
  delay(cmddelay);
  sprintf(buf, "w");  sendcmd(buf);  // save
  delay(cmddelay);
  sprintf(buf, "y");  sendcmd(buf);  // load 
  delay(cmddelay);
  sprintf(buf, "z");  sendcmd(buf); // start
  delay(cmddelay);
  //LoRa_reset();
  Serial.println("SetupComplete!");
  delay(1000);
}

/////////////////////////////////////////// センサー制御関数
int sensorController()
{
  return analogRead(SensorPin);
}

void sensorDataReceiver(char sendData[64])
{
  int sensorData;
  sensorData = sensorController();
  sprintf(sendData, SendFormats[0], sensorData); 
  //Serial.print(sendData);
}

/////////////////////////////////////////// モーター制御関数
void gateController(int dir, float rot) 
{ // dir : 回転方向 UP = 1, DOWN = 0 // rot : 回転数 
  
  // 異常な数字を渡された際に終了するための処理
  if(dir > 1 || dir < 0 || rot < 0)return;
  
  // 回転方向の決定
  digitalWrite(DigMotorPinDir, dir);

  // 回転処理 400回で一回転(約1cm?)
  for(int i = 0; i < 400*rot; i++)
  {
    digitalWrite(DigMotorPinCont, HIGH);
    delay(1);
    digitalWrite(DigMotorPinCont, LOW);
    delay(1);
  }
}

////////////////////////////////////////// LED制御関数
void ledController(char level)
{
  if(level < 256)
    ledcWrite(LEDGroup, level);
}

////////////////////////////////////////// 高さ制御関数
void levelController(char level)
{
  if(level>255||level<0)return;
  static char nowLevel = 0;    //現在の高さ
  char dir = UP;               //回転方向
  int gap = level - nowLevel; //目標との差
  char ack[64];
  if(gap > 0)
  {
    dir = UP;
  }
  else if(gap < 0) 
  {
    dir = DOWN;
    gap *= -1;
  }
  else dir = -1;
  
  gateController(dir, ROT_BIAS * gap);

  nowLevel = level;

  sprintf(ack,"Gate Complete nowLv : %d",nowLevel);
  Serial.println();
  Serial.println(ack);
  LoRa_send(ack);
}

////////////////////////////////////////// 受信命令処理関数
void recvTaskController()
{
  char buf[64];
  char task = -1;
  char *numpoint = NULL;
  int num;
  LoRa_recv(buf);
  Serial.print(buf);
  for(char i = 0; i < TaskNum; i++)
  {
    
    if(strstr(buf, TaskList[i]) != NULL)
    {
      numpoint = strstr(buf, " ");
      task = i;
      num = atoi(++numpoint);
      break;
    }
  }

  if(task<0)return;
  else if (task == 0) levelController(num);
  else if (task == 1) ledController(num);
}

////////////////////////////////////////// 
void sendController()
{
  char Data[64];
  sensorDataReceiver(Data);
  Serial.println(Data);
  LoRa_send(Data);
}

//////////////////////////////// シリアルモニタからの入力を処理
void consoleController()
{
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
}

////////////////////////////////////////// 全体初期設定
void setup(void)
{
  pinMode(DigMotorPinDir, OUTPUT);
  pinMode(DigMotorPinCont, OUTPUT);
  pinMode(LoRa_Rst, OUTPUT);
  digitalWrite(LoRa_Rst, HIGH);
  ledcSetup(LEDGroup,12800,8);
  ledcAttachPin(LEDPin,LEDGroup);
  Serial.begin(115200);
  Serial2.begin(115200);
  delay(2000);
  for(char i; i < 10; i++) 
  {
    char buf[64];
    LoRa_recv(buf);
    Serial.println(buf);
    if (strstr(buf, "Mode")) 
    {
      //Serial.print(buf);
      LoRa_Setup(1);
      break;
    }
    delay(100);
  }
}

////////////////////////////////////////// メインループ
void loop()
{
  consoleController();
  recvTaskController();
  Serial.print('\n');
  //sendController();
  delay(1000);
}
