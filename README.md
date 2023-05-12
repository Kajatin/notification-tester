# Push Notifications 🔔

Implementation of a simple push notifications app in both Swift and React Native. It is meant to test the reliability of notifications on iOS and Android devices.

## Swift

Send and receive simple test notification on the device. This app uses the `UNUserNotificationCenter` to schedule a single or repeating notifications for you to test their reliability.

Native push notifications are not yet supported.

<p align="center">
  <img src="https://github.com/Kajatin/notification-tester/assets/33018844/76638b1e-3d54-4f2f-bf47-05192a801b62" width="30%">
</p>

## React Native

The RN implementation of the same app. This one uses [notifee](https://notifee.app/) to handle notifications.
Push notifications are powered by Firebase Cloud Messaging.

### Build

My workflow for building and testing the app on a physical device is as follows:

1. `cd react-native`
1. `npm install`
1. `npx expo prebuild`
1. `npx expo run:ios --device` or `npx expo run:android`

### Firebase Messaging Setup

In order for your app to connect to a Firebase instance, you'll need to add the following
credential files:

* `GoogleService-Info.plist` should be placed in `react-native/ios/` for iOS
* `google-services.json` should be placed in `react-native/android/app/` for Android

Additionally, for the `node` backend to be able to send messages, you'll need the
service account credentials JSON file and set the path in the `GOOGLE_APPLICATION_CREDENTIALS`
environment variable.

When you launch the app, the device will log its token to the console. You can use this token
to send messages to the device with the `messenger.js` script. Make sure to set the
`FCM_TOKEN` environment variable to the token you want to send the message to.

To set up the backend, follow these steps:

1. `cd node`
1. `npm install`
1. `npm run send`
