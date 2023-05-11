import { registerRootComponent } from "expo";

import messaging from "@react-native-firebase/messaging";

import App from "./App";
import onDisplayNotification from "./notificationHandler";

async function onBackgroundMessage(message) {
  try {
    console.log("Background notification received");
    onDisplayNotification();
  } catch (error) {
    console.error(error);
  }
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  await onBackgroundMessage(remoteMessage);
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
