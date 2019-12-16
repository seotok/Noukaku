# -*- coding: utf-8 -*-
import lora
import pyrebase
import ast
import time
import struct
import sys
import random
import datetime
lr = lora.LoRa()
path = './sensedata.txt'
timeout = 1

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

def printable(l):
    x = struct.unpack(str(len(l)) + 'b', l)
    y = ''
    for i in range(len(x)):
        if x[i] >= 0:
            y = y + chr(x[i])
    return y

def sendcmd(cmd):                     #LoRaへのコマンド送信
    print(cmd)                        # debug
    lr.write(cmd)
    t = time.time()
    while (True):
        if (time.time() - t) > 5:
            print('panic: %s' % cmd)
            exit()
        line = lr.readline()
        if 'OK' in printable(line):
            print(line)               # debug
            return True
        elif 'NG' in printable(line):
            print(line)               # debug
            return False

def setMode(bw, sf):                  #コンフィグ
    lr.write('config\r\n')
    lr.s.flush()
    time.sleep(0.2)
    lr.reset()
    time.sleep(1.5)

    line = lr.readline()
    while not ('Mode' in printable(line)):
        line = lr.readline()
        if len(line) > 0:
            print(line)

    sendcmd('2\r\n')
    sendcmd('a 1\r\n')
    sendcmd('bw %d\r\n' % bw)
    sendcmd('sf %d\r\n' % sf)
    sendcmd('d 1\r\n')
    sendcmd('e 0001\r\n')
    sendcmd('f 0000\r\n')
    sendcmd('g FFFF\r\n')
    sendcmd('l 1\r\n')
    sendcmd('m 1\r\n')
    sendcmd('n 1\r\n')
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

def LoRaMessenger(line):
    lr.write(line + '\r\n')
    print(line)

def DataWrite(line):                                      #ファイル書き出し
    line = line.decode()
    devNo = 0
    if (line.find('sense') <= -1):
        return
    devNo = line.find('Dev')
    if(devNo > -1):
        devNo = int(line[devNo+3])
    else:
        devNo = 0
    reline = line.replace('sense','data :').replace('Dev%d' % int(devNo), ' Dev%d' % int(devNo))
    timenow = datetime.datetime.now()
    formatedtime = "{0:%Y-%m-%d %H:%M:%S}".format(timenow)
    f = open(path, mode = 'a')
    f.write(formatedtime+reline)
    f.close()
    #print('Write Complete')

def LEDCommand(level):
    LoRaMessenger('led %d' % level)
    lr.s.flush()
    
def GateCommand(level):
    LoRaMessenger('gate %d' % level)
    lr.s.flush()
    num = 0
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

def LEDCommandwithDir(dir, level):
    LoRaMessenger('Dev%d:led %d' %(dir, level))
    lr.s.flush()

def GateCommandwithDir(dir, level):
    LoRaMessenger('Dev%d:gate %d' % (dir, level))
    lr.s.flush()

setMode(4, 7)

lastgate = 0

while True:
    #send = input('send : ')
    #LoRaMessenger(send)
    #LEDCommand(random.randint(0,255))
    #GateCommandwithDir(3,random.randint(0,16))
    #time.sleep(1)
    
    #if 'reset' in send:
    #    lr.reset()
   
    gatenum = db.child("home/gate").get()

    if(lastgate != int(gatenum.val())):
        lastgate = int(gatenum.val())
        GateCommand(lastgate)
    
    line = lr.readline(timeout)
    lr.s.flush()
    print('%s' % line)
    sys.stdout.flush()
    DataWrite(line)
    #print("Hey!")
    time.sleep(1)
    