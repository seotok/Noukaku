import pyrebase
import RPi.GPIO as GPIO
from time import sleep

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

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(17, GPIO.OUT)
GPIO.setup(27, GPIO.OUT)


print ("**********    INICIO  *************")

while True:
    salidaLed1 = db.child("home/led1").get()
    GPIO.output(17, salidaLed1.val())
    
    salidaLed2 = db.child("home/led2").get()
    GPIO.output(27, salidaLed2.val())
    sleep(1)

GPIO.cleanup()
