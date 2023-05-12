// Node.js
var admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

async function sendMessageToDevice(token) {
  const patient_event = {
    id: "1234",
    bed: 8,
    timestamp: "2023-05-11T18:20:00.000Z",
    type: "out_of_bed",
    action: "laying_on_floor",
    fcm_ts: new Date().toLocaleTimeString("da-DK"),
  };

  let message = {
    token: token,
    android: {
      priority: "high",
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
      headers: {
        "apns-push-type": "background",
        "apns-priority": "5",
        "apns-topic": process.env.FIREBASE_MESSAGING_APNS_TOPIC,
      },
    },
    notification: {
      title: "Beep Boop 🤖",
      body: JSON.stringify(patient_event),
    },
    data: {
      title: "Beep Boop 🤖",
      type: "patient_event",
      body: JSON.stringify(patient_event),
      medical_staff_in_room: "false",
      // visitor_in_room: !!latest_visitor_event?.data
      //     ?.visitors_in_room
      //     ? 'true'
      //     : 'false',
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
