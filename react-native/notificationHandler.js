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
    console.log("Notification permissions has been AUTHORIZED");
  } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
    console.log("Notification permissions has been DENIED");
  }

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "default7",
    name: "Default 7",
    // vibration: true,
    // importance: AndroidImportance.HIGH,
    sound: "polite",
  });

  const currentTime = new Date().toLocaleTimeString("da-DK");
  constParsed = JSON.parse(message?.data?.body || "{}");
  const body = (constParsed?.fcm_ts || "??") + " - " + currentTime;

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
    console.log(e);
  }
}
