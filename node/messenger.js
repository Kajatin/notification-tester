// Node.js
var admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const actionTypeCombos = [
  ["out_of_bed", "laying_on_floor", "alarm_v2", "continuousbeat"],
  ["out_of_bed", "standing_on_floor", "alarm_v2", "continuousbeat"],
  ["in_bed", "laying_on_bed", "notification_v2", "polite"],
  ["in_bed", "sitting_on_bed_edge", "notification_v2", "polite"],
];
const beds = [7, 8];

const currentIsoDateTime = new Date().toISOString();
const randomActionTypeCombo =
  actionTypeCombos[Math.floor(Math.random() * actionTypeCombos.length)];

async function sendMessageToDevice(token) {
  const patient_alert = {
    id: Math.floor(Math.random() * 1000000).toString(),
    bed: beds[Math.floor(Math.random() * beds.length)],
    alert_sent: false,
    type: randomActionTypeCombo[0],
    action: randomActionTypeCombo[1],
    created_on: currentIsoDateTime,
    timestamp: currentIsoDateTime,
    uuid: Math.floor(Math.random() * 1000000).toString(),
  };

  let message = {
    token: token,
    android: {
      priority: "high",
      notification: {
        title: "Beep Boop 🤖",
        body: "Notification coming through",
        channelId: randomActionTypeCombo[2],
        sound: randomActionTypeCombo[3],
        color: "#106BD0",
        icon: "ic_notification",
        priority: "high",
      },
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          alert: {
            title: "Beep Boop 🤖",
            body: "Notification coming through",
          },
          sound: {
            critical: true,
            name: randomActionTypeCombo[3] + ".caf",
          },
          badge: 1,
        },
      },
      headers: {
        "apns-push-type": "alert",
        "apns-priority": "5",
        "apns-topic": process.env.FIREBASE_MESSAGING_APNS_TOPIC,
      },
    },
    data: {
      notificationLevel: randomActionTypeCombo[2].split("_")[0],
      type: "patient_alert",
      origin: "roland",
      fcm_ts: new Date().toLocaleTimeString("en-GB"),
      channelId: randomActionTypeCombo[2],
      patientEvent: JSON.stringify(patient_alert),
    },
  };

  try {
    // console.log("Sending message:", message);
    let response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

let deviceToken = process.env.FCM_TOKEN;
sendMessageToDevice(deviceToken);
