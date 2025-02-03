import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import {
  getFirestore,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

const db = getFirestore();

export default function HomeScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(
    null
  );
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const docRef = doc(db, "config", "gameshow");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const timestamp = docSnap.data().nextGameTime;
          if (timestamp && timestamp.seconds) {
            const targetTime = new Date(
              timestamp.seconds * 1000
            ); // Convert Firestore Timestamp
            console.log(
              "Fetched Target Time (Local Time):",
              targetTime.toString()
            );
            console.log(
              "Current Time (Local Time):",
              new Date().toString()
            );
            updateCountdown(targetTime);
          } else {
            console.error(
              "nextGameTime field is missing or invalid."
            );
          }
        } else {
          console.error(
            "Firestore document does not exist."
          );
        }
      } catch (error) {
        console.error(
          "Error fetching Firestore data:",
          error
        );
      }
    };

    fetchCountdown();
    const interval = setInterval(() => {
      fetchCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateCountdown = (targetTime: Date) => {
    const now = new Date();
    const diff = Math.max(
      0,
      Math.floor(
        (targetTime.getTime() - now.getTime()) / 1000
      )
    );
    setCountdown(diff);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--:--";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }]}
    >
      <Text style={styles.title}>Next Game Starts In:</Text>
      <Text style={styles.countdown}>
        {formatTime(countdown)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#111",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  countdown: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ff9900",
    textAlign: "center",
  },
});
