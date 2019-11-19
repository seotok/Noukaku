# -*- coding: utf-8 -*-

from flask import Flask, render_template, request
import RPi.GPIO as GPIO
import signal
import sys
import lora
import random
import test as lora

path = './test.txt'


# Flaskのインスタンスの作成
app = Flask(__name__)

# 「/」にアクセスしたときの処理
@app.route("/index", methods=["GET", "POST"])
def index():
    return render_template("index.html")

# /indexold
@app.route("/indexold", methods=["GET", "POST"])
def indexold():
    return render_template("indexold.html")

#/home
@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("home.html")

# /LEDTest
@app.route("/LEDTest", methods=["POST"])
def LEDTest():
    app.logger.debug(request.method)
    if request.method == "POST":
        lora.LEDCommand(random.randint(0,255))
    return ""

# /MotorTest
@app.route("/MotorTest", methods=["POST"])
def MotorTest():
    if request.method == "POST":
        lora.GateCommand(random.randint(0,10))
    return ""

# /DevMotorTest
@app.route("/DevMotorTest", methods=["POST"])
def DevMotorTest():
    if request.method == "POST":
        dev = request.form["val"]
        lora.GateCommandwithDir(int(dev),random.randint(0,10))
    return ""

# /Gate
@app.route("/Gate", methods=["POST"])
def Gate():
    if request.method == "POST":
        value = request.form["val"]
        lora.GateCommand(int(value))
    return "<!-- <script>alert('Done!')</script> -->"

# /logeraser
@app.route("/logeraser", methods=["POST"])
def logeraser():
    if request.method == "POST":
        filename = "./fukasawa/flask/logdata" + request.form["val"]
        f = open(filename, mode="w")
        f.write("")
        f.close()
    return ""


# 「Ctrl + C」による終了時の処理
def sigint_handler(signal, frame):
    app.logger.debug("Closing")
    GPIO.cleanup()
    app.logger.debug("Closed")
    sys.exit(0)

# メイン関数
if __name__ == "__main__":
    # SIGINTハンドラの設定
    #signal.signal(signal.SIGINT, sigint_handler)
    # GPIO番号を使用する（ピン番号ではなく）
    #GPIO.setmode(GPIO.BCM)
    # ピンセットアップ
    #GPIO.setup(LEDPINS["1"], GPIO.OUT)
    #GPIO.setup(LEDPINS["2"], GPIO.OUT)
    #GPIO.setup(LEDPINS["3"], GPIO.OUT)
    # Flaskインスタンス実行
    #app.run("0.0.0.0", debug=True) # デバッグ出力する実行
    app.run("0.0.0.0") # デバッグ出力しない実行

