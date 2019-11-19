# -*- coding: utf-8 -*-

from flask import Flask, render_template, request
import RPi.GPIO as GPIO
import signal
import sys
import pythonscripts.lora
import pythonscripts.test as test

path = './test.txt'


# Flaskのインスタンスの作成
app = Flask(__name__)

# 「/」にアクセスしたときの処理
@app.route("/")
def index():
    return render_template("index.html")

# 「/changepinstate」にアクセスしたときの処理
@app.route("/changepinstate", methods=["POST"])
def changepinstate():
    app.logger.debug(request.method)
    if "POST" == request.method:
        pin   = request.form["pin"]
        state = request.form["state"]
        app.logger.debug("pin = " + pin)
        app.logger.debug("pin type = " + str(type(pin)))
        app.logger.debug("state = " + state)
        app.logger.debug("state type = " + str(type(state)))
        GPIO.output(LEDPINS[pin], int(state))
    return ""

# ファイルの書き込みテスト
@app.route("/ledtest")
def LEDTest():
    test.LEDCommand(255)
    return "<script>window.close</script>"

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

