const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
/*
 exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });
 */
var express = require("express");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
console.log("online")

exports.cctest = functions.https.onCall((data, context) => {
  ret = {};
  admin.auth().setCustomUserClaims(context.auth.uid, { claimtest: true }).then((res) => {
    console.log("success");
    console.log(res);
    // The new custom claims will propagate to the user's ID token the
    // next time a new one is issued.
    ret = { uid: context.auth.uid };
  }).catch((err) => {
    console.log("failed");
    console.log(err);
    ret = { uid: "failed" };
  });
  return ret;
});

exports.idecho = functions.https.onCall((data, context) => {
  return { data: data, auth: context.auth }
});

//context.auth“à‚Éuid‚ª‚ ‚é–Í—l