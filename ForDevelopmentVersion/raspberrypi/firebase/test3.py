# -*- coding: utf-8 -*-
import lora  # LoRaを使うためのライブラリ的な
import pyrebase  # firebaseを使うための(ry
import ast
import time
import struct
import sys
import random
import datetime
lr = lora.LoRa()  #LoRaの各処理を行うハンドル的な

path = './sensedata.txt'  # センサーデータの保存先
timeout = 1  # LoRa受信のタイムアウトまでの時間 単位はたぶん秒
panid = 1  # LoRa通信におけるPANネットワークID
maxdevice = 3  # 子機のデバイス数最大値


######### firebase利用のための設定 #########

# このプログラムで使われているfirebaseのデータベースはすべてrealtime databaseであることに注意すること!

config = {
    "apiKey": "AIzaSyAI2_HPjp6941-xfZ6FQ3qRZMUICy0ni4I",
    "authDomain": "test01-fc911.firebaseapp.com",
    "databaseURL": "https://test01-fc911.firebaseio.com",
    "projectId": "test01-fc911",
    "storageBucket": "test01-fc911.appspot.com",
    "messagingSenderId": "774709465749",
    "appId": "1:774709465749:web:e5383bd9b3006fd5af419c",
    "measurementId": "G-MXPFLT1F3J"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

######### firebaseの設定ここまで #########

######### ここから関数宣言 #########

def printable(l):
    x = struct.unpack(str(len(l)) + 'b', l)
    y = ''
    for i in range(len(x)):
        if x[i] >= 0:
            y = y + chr(x[i])
    return y

def sendcmd(cmd):  # LoRaへのコマンド送信
    print(cmd)  # デバッグ用
    lr.write(cmd)  # LoRa送信
    t = time.time()  # 経過時間の計測開始時点を設定
    while (True):
        if (time.time() - t) > 5:  # 5秒たってLoRaからの返答がなければ (秒数に生の数字を書くな!後で変数に直すこと)
            print('panic: %s' % cmd)  # エラーメッセージを表示して
            exit()  # 強制終了
        line = lr.readline()
        if 'OK' in printable(line):  # LoRaから'OK'と返ってきたら
            print(line)  # デバッグ用
            return True  # Trueを返す
        elif 'NG' in printable(line):  # LoRaから'NG'と返ってきたら
            print(line)  # デバッグ用  
            return False  # Falseを返す

def setMode(bw, sf):  # LoRaのコンフィグ関数 引数は bw : 帯域幅   sf : 拡散率
    lr.write('config\r\n')  # コンフィグモードへ入るためLoRaに文字列を送信
    lr.s.flush()
    time.sleep(0.2)  # LoRaが受け付けるまで小休止
    lr.reset()  # コンフィグモードへ入るためリセット
    time.sleep(1.5)  # リセットが完了するまで小休止

    line = lr.readline()
    while not ('Mode' in printable(line)):  # モード選択要求がLoRaから送られてくるまでループ
        line = lr.readline()
        if len(line) > 0:
            print(line)

# 生の数字をプログラムの本文に直接書くのは、数字の意味が分かりづらくなるからあまり良くないのだけれど...

# 各コマンドの詳細はES920LRコマンド仕様ソフトウェア説明書参照
    sendcmd('2\r\n')
    sendcmd('a 1\r\n')
    sendcmd('bw %d\r\n' % bw)
    sendcmd('sf %d\r\n' % sf)
    sendcmd('d 1\r\n')
    sendcmd('e %s\r\n' % format(panid,'04x'))
    sendcmd('f 0000\r\n')
    sendcmd('g FFFF\r\n')
    sendcmd('l 1\r\n')
    sendcmd('m 1\r\n')
    sendcmd('n 2\r\n') # transmode  転送方式 試験的に Frameモードにしてある
    sendcmd('o 2\r\n')
    sendcmd('p 2\r\n')
    sendcmd('q 2\r\n')
    sendcmd('r 5\r\n')
    sendcmd('u 13\r\n')
    sendcmd('w\r\n')
    sendcmd('start\r\n') 
    #lr.reset()
    print('LoRa module set to new mode')
    time.sleep(1)
    sys.stdout.flush()

def LoRaMessenger(line):  # LoRaを使った文字列の送信を簡易にするための関数 引数は送信する文字列
    lr.write(line + '\r\n')
    print(line)

def DataWrite(line):  # データをファイルに書き出し 引数は書き込む文字列  本当なら書き込むファイル名も引数で指定すればよかったのだろうけど...
    line = line.decode()  # 書き込むデータをバイト列から文字列にデコード 
    devNo = 0  # 子機のデバイス番号が入る変数

    if (line.find('sense') <= -1):  # センサーデータであることを示すsenseという文字列が無ければ
        return  # 関数の処理をやめる

    # 子機のデバイス番号の検出 文字列内の'Dev'の次の数字が子機のデバイス番号であるから、
    devNo = line.find('Dev')  # 'Dev'の頭文字が何文字目かを見つけ、
    if(devNo > -1):  # 見つかれば
        devNo = int(line[devNo+3])  #そこから3文字後が子機のデバイス番号になる
    else:
        devNo = 0

# 引数で受け取った文字列を、データ書き込みのために文言等を整える 
# これも書き換える形式(フォーマット?)を変数にして見やすく書き換えやすくしておけばよかったのだけれど
    reline = line.replace('sense','data :').replace('Dev%d' % int(devNo), ' Dev%d' % int(devNo))

# タイムスタンプの作成
    timenow = datetime.datetime.now()
    formatedtime = "{0:%Y-%m-%d %H:%M:%S}".format(timenow)

    f = open(path, mode = 'a')  #ファイルオープン
    f.write(formatedtime+reline)  # タイムスタンプと書き込むデータを結合して書き込み
    f.close()  # ファイルクローズ
    #print('Write Complete')

def LEDCommand(level):  # 子機のLEDを光らせるメッセージを送信するための関数 引数は多分明るさ(0~256)
    LoRaMessenger('led %d' % level)  # 送信先指定がないからすべての子機が光る
    lr.s.flush()
    
def GateCommand(level):  # 水門調整用のメッセージを送信する関数  引数は水門の高さ
    LoRaMessenger('gate %d' % level)  # 送信先指定がないからすべての子機が動く
    lr.s.flush()
    num = 0

# 以前に動作完了通知を受けるために使っていたもの
    #while num < level:
    #    line = lr.readline()
    #    if 'Gate Complete nowLv : %d' % level in printable(line):
    #        print('Success')
    #        return True
    #    num = num + 1
    #    time.sleep(0.1)
    #print('Failed')
    #return False

    return True

def LEDCommandwithDir(dir, level):  # 送信先指定可能な、子機のLEDを(略) 引数は dir : 子機のデバイス番号  level : 多分明るさ(0~256)
    LoRaMessenger('Dev%d:led %d' %(dir, level))
    lr.s.flush()

def GateCommandwithDir(dir, level):  # 送信先指定可能な、水門(中略)関数 引数は dir : 子機のデバイス番号  level : 水門の高さ
    LoRaMessenger('%s%sgate %d' % (format(panid,'04x'),format(dir,'04x'), level))  # 試験的にFrameモードの送信フォーマットで送っている
    lr.s.flush()

######### 関数宣言ここまで #########

######### 以下本文 #########

setMode(4, 7)  # LoRa初期設定

#lastgate = 0  # 未使用の引数
#lastgate2 = 0

lastlevel = {}  # 各子機の水門の(親機からの指示による動作の直前の)高さ

loop = 2  # 開発で使用している子機の番号が'2'と'3'のためこうなっている あとで子機と合わせて直した方がいい
while loop <= maxdevice:
    lastlevel[loop] = 0
    loop += 1

while True:  # 主ループ
    loop = 2  # 開発で使用している子機の番号が(ry
    while (loop <= maxdevice):
        gatenum = db.child("home/gate%d" % loop).get()  # データベースの各子機の水門の高さを確認
        if(lastlevel[loop] != int(gatenum.val())):  # 変更があれば子機に高さを調整するよう送信
            lastlevel[loop] = int(gatenum.val())
            GateCommandwithDir(loop,lastlevel[loop])
        loop += 1
            
    line = lr.readline(timeout)  # LoRaからのメッセージを受信  引数にはタイムアウト時間を入れる
    lr.s.flush()
    print('%s' % line)  # LoRaからのメッセージを表示
    sys.stdout.flush()
    DataWrite(line)  # データ書き込み

    loop = 2
    while(loop <= maxdevice):
        if 'Dev%d:Gate Complete nowLv :'%loop in printable(line):  # 子機からの動作完了メッセージを受信したら
            updata = {}
            updata["gate%dProcessing"%loop] = False  # データベースの処理中かどうかを表す項目をfalse(動作完了)に書き換える
            db.child('home').update(updata)  # データベースに書き込む
        loop += 1
    
    #time.sleep(1)
    