import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from "@notifee/react-native";

export default async function onDisplayNotification(message) {
  notifee.requestPermission({
    alert: true,
    badge: true,
    sound: true,
  });

  const settings = await notifee.getNotificationSettings();
  if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
    // console.log("Notification permissions has been AUTHORIZED");
  } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
    console.log("Notification permissions has been DENIED");
  }

  // Create a channel (required for Android)
  const channelName = message.data.channelId;
  const notificationLevel = message.data.notificationLevel;
  const channelId = await notifee.createChannel({
    id: channelName,
    name: channelName,
    // vibration: true,
    // importance: AndroidImportance.HIGH,
    sound: notificationLevel === "notification" ? "polite" : "continuousbeat",
  });

  const fcmTime = message?.data?.fcm_ts || "??";
  const currentTime = new Date().toLocaleTimeString("en-GB");
  const body = fcmTime + " - " + currentTime;

  // Display a notification
  try {
    await notifee.displayNotification({
      title: message?.data?.title || "Beep Boop 🤖",
      body: body,
      android: {
        channelId,
        // smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: "default",
        },
      },
      ios: {
        // sound: "attention.m4r",
        sound: "default",
        // critical: true,
        // criticalVolume: 1,
      },
      // data: {
      //   screen: "home",
      // },
    });
  } catch (e) {
    console.error(e);
  }
}
