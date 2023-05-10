// Node.js
var admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // databaseURL: "https://" + process.env.FIREBASE_DATABASE + ".firebaseio.com",
});

async function sendMessageToDevice(token) {
  console.log("sendMessageToDevice", token);

  let message = {
    token: token,
    data: { hello: "world!" },
    apns: {
      payload: {
        aps: {
          "content-available": 1,
          alert: {
            title: "Hello",
            body: "Hello world!",
          },
          badge: 1,
          sound: "default",
          notification: {
            title: "Hello",
            body: "Hello world!",
          },
        },
      },
      headers: {
        "apns-push-type": "background",
        "apns-priority": "5",
        // "apns-topic": process.env.FIREBASE_MESSAGING_APNS_TOPIC,
      },
    },
  };

  try {
    let response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

let deviceToken = process.env.FCM_TOKEN;
sendMessageToDevice(deviceToken);
