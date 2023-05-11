// Node.js
var admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // databaseURL: "https://" + process.env.FIREBASE_DATABASE + ".firebaseio.com",
});

async function sendMessageToDevice(token) {
  const patient_event = {
    id: "1234",
    bed: 8,
    timestamp: "2023-05-11T08:00:00.000Z",
    type: "out_of_bed",
    action: "laying_on_floor",
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
        "apns-push-type": "alert",
        "apns-priority": "10",
        "apns-topic": "com.gmail.rolandkajatin.notificationsreactnative",
      },
    },
    notification: {
      title: "Patient event",
      body: JSON.stringify(patient_event).slice(0, 100),
    },
    data: {
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
