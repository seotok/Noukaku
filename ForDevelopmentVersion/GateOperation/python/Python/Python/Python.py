
import pyrebase
import RPi.GPIO as GPIO
from time import sleep

config = {
  "apiKey": "AIzaSyA1D4qhVZUo43n3rj0YSYPO1cBXPlwvTIY",
  "authDomain": "fir-sample-f5466.firebaseapp.com",
  "databaseURL": "https://fir-sample-f5466.firebaseio.com",
  "storageBucket":  "fir-sample-f5466.appspot.com",
 
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