#LoRaConsole
#made by Eu93n3
##概要
ES920LR用

Arduino IDE のシリアルモニタで ES920LR の制御をするためのプログラム

##使い方
1. ESP32に書き込む
2. シリアルモニタを開く *115200bpsに設定すること
3. シリアルモニタ上の欄に文字列を入力し送信を押すと ES920LR に送信
4. ES920LR から受信した文字列はシリアルモニタに表示される
5. "config" と入力し送信するとES920LR の再起動時に configuration モードへ移行
6. "reset" と入力し送信すると ES920LR を再起動する

configuration モード用のコマンドは "ES920LRコマンドリスト" か [ここ](http://easel5.com/download/)を参照のこと

その他不明な点は、ネットの海を漁るなり制作者に聞くなりすること。わからないことはそのままにしない!
