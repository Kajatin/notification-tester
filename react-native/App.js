import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

function getCurrentTimeAsString() {
  return new Date().toLocaleTimeString();
}

export default function App() {
  const [intervalId, setIntervalId] = useState(null);
  const [counter, setCounter] = useState(0);
  const [lastNotificationTime, setLastNotificationTime] = useState("00:00:00");
  const [scheduleStart, setScheduleStart] = useState("00:00:00");
  const [currentTime, setCurrentTime] = useState(getCurrentTimeAsString());
  const [fcmToken, setFcmToken] = useState(null);
  const [message, setMessage] = useState("waiting for message");

  // Note that an async function or a function that returns a Promise
  // is required for both subscribers.
  async function onMessageReceived(message) {
    console.log("onMessageReceived", message);
    setMessage(JSON.stringify(message));
    onDisplayNotification();
  }

  async function setupMessaging() {
    messaging().onMessage(onMessageReceived);
  }

  useEffect(() => {
    setupMessaging();
  }, []);

  useEffect(() => {
    if (!fcmToken) {
      (async () => {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        if (!(await messaging().hasPermission())) {
          const permission = await messaging().requestPermission({
            alert: true,
            badge: true,
            criticalAlert: true,
            sound: true,
          });
          console.log("permission", permission);
        }
        const token = await messaging().getToken();
        console.log("token", token);
        setFcmToken(token);
      })();
    }
  }, [fcmToken]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(getCurrentTimeAsString());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  async function onStartScheduling() {
    if (intervalId) {
      return;
    }

    setScheduleStart(getCurrentTimeAsString());

    const id = setInterval(async () => {
      await onDisplayNotification();
    }, 10 * 1000);

    setIntervalId(id);
  }

  async function onStopScheduling() {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      notifee.cancelAllNotifications();
    }
  }

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    // Display a notification
    try {
      await notifee.displayNotification({
        title: "Beep Boop 🤖",
        body: "Notification coming through",
        android: {
          channelId,
          smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: "default",
          },
        },
        ios: {
          // sound: "attention.m4r",
          sound: "default",
          critical: true,
          criticalVolume: 1,
        },
        data: {
          screen: "home",
        },
      });
    } catch (e) {
      console.log(e);
    }

    setCounter(counter + 1);
    setLastNotificationTime(getCurrentTimeAsString());
  }

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>{message}</Text>
      </View>

      <View style={styles.spacing} />

      <View style={styles.center}>
        <Text style={styles.largeTitle}>{counter}</Text>
        <Text style={styles.title}>{lastNotificationTime}</Text>
        <Text style={styles.title}>{currentTime}</Text>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => onDisplayNotification()}
          >
            <Text style={styles.buttonText}>Send notification</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.spacing} />

      <View style={styles.center}>
        <Text style={styles.title3}>
          Scheduling {intervalId ? "ON" : "OFF"}
        </Text>
        <Text style={styles.title}>{scheduleStart}</Text>

        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => onStartScheduling()}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={async () => onStopScheduling()}
          >
            <Text style={styles.cancelButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.spacing} />

      <View style={[styles.center, styles.cancelButton]}>
        <TouchableOpacity
          onPress={async () => {
            setCounter(0);
            await onStopScheduling();
          }}
        >
          <Text style={styles.cancelButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f0e9",
    justifyContent: "center",
    paddingTop: 80,
    paddingBottom: 40,
  },
  spacing: {
    flex: 1,
  },
  center: {
    alignItems: "center",
  },
  largeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    padding: 5,
  },
  title: {
    fontSize: 24,
    padding: 5,
  },
  title3: {
    fontSize: 20,
    padding: 5,
    opacity: 0.5,
  },

  button: {
    backgroundColor: "#e3e3e3",
    borderRadius: 5,
    margin: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 20,
    color: "#1a68d6",
  },

  cancelButton: {
    backgroundColor: "transparent",
    borderRadius: 5,
    margin: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontSize: 20,
    color: "#ff3b30",
  },
});

