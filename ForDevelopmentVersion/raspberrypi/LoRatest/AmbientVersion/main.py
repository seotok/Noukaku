# sf, bwを変えながら移動端末から受信する
#
# LoRaモジュールから1行読み、rssi、panid、srcid、msgに分解
# さらにmsgが'latlng=(lat,lng)'という形式なので、'(lat,lng)'部分をTupleに変換
# rssiを保存し、Ambientに送信
#
#

import lora
import ast
import time
import struct
import sys


# (bw, sf, timeout)
mode = [3, 12, 5]


lr = lora.LoRa()

def printable(l):
    x = struct.unpack(str(len(l)) + 'b', l)
    y = ''
    for i in range(len(x)):
        if x[i] >= 0:
            y = y + chr(x[i])
    return y

def sendcmd(cmd):
    print(cmd)
    lr.write(cmd)
    t = time.time()
    while (True):
        if (time.time() - t) > 5:
            print('panic: %s' % cmd)
            exit()
        line = lr.readline()
        if 'OK' in printable(line):
            print(line)
            return True
        elif 'NG' in printable(line):
            print(line)
            return False

def setMode(bw, sf):
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
    sendcmd('bw %d\r\n' % bw)
    sendcmd('sf %d\r\n' % sf)
    sendcmd('q 2\r\n')
    sendcmd('w\r\n')

    lr.reset()
    print('LoRa module set to new mode')
    time.sleep(1)
    sys.stdout.flush()

while (True):
    rssi = [None] * len(mode)
    latlng = ()
    for i in range(len(mode)):
        print('setMode(bw: %d, sf: %d)' % (mode[0], mode[1]))
        setMode(mode[0], mode[1])

        t = None if i == 0 else mode[2]
        timeout = False
        start = time.time()
        while (True):
            while (True):
                line = lr.readline(t)
                print(line)
                sys.stdout.flush()
                if len(line) == 0: # TIMEOUT
                    timeout = True
                    break
                if len(line) >= 14: # 'rssi(4bytes),pan id(4bytes),src id(4bytes),\r\n'で14バイト
                    break
            if timeout == True:
                rssi = None
                print('TIMEOUT')
                break;
            data = lr.parse(line)  # 'rssi(4bytes),pan id(4bytes),src id(4bytes),laglng=(12バイト,12バイト)\r\n', ペイロード34バイト
            print(data)
            if 'loc=' in data[3]:
                loc = ast.literal_eval(data[3].split('=')[1])
                rssi = data[0]
                latlng = loc
                s = mode[2] - (time.time() - start)
                print('sleep: ' + str(s))
                if i != 0 and s > 0:
                    time.sleep(s)
                break

    print(rssi)
    print(latlng)
    sys.stdout.flush()
