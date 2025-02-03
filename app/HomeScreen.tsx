import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import {
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";

const db = getFirestore();

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(
    null
  );
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animation ref

  useEffect(() => {
    console.log("👀 Checking authentication...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User authenticated:", user.email);
        fetchCountdown();
      } else {
        console.log(
          "❌ User not authenticated, redirecting..."
        );
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCountdown = async () => {
    try {
      console.log(
        "📡 Fetching countdown from Firestore..."
      );
      const docRef = doc(db, "config", "gameshow");
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error(
          "❌ Firestore document does not exist."
        );
        setLoading(false);
        return;
      }

      const timestamp = docSnap.data().nextGameTime;
      if (!timestamp || !timestamp.seconds) {
        console.error(
          "❌ nextGameTime field is missing or invalid."
        );
        setLoading(false);
        return;
      }

      const targetTime = new Date(timestamp.seconds * 1000);
      console.log(
        "🕒 Fetched Target Time:",
        targetTime.toString()
      );

      // Set initial countdown
      setCountdown(
        Math.max(
          0,
          Math.floor(
            (targetTime.getTime() - Date.now()) / 1000
          )
        )
      );
      setLoading(false);

      // Start countdown interval
      const interval = setInterval(() => {
        setCountdown((prev) =>
          prev !== null && prev > 0 ? prev - 1 : 0
        );
      }, 1000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error(
        "🔥 Error fetching Firestore data:",
        error
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("✨ Starting fade-in animation...");
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--:--";

    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor(
      (seconds % (3600 * 24)) / 3600
    );
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${days}d ${String(hours).padStart(
      2,
      "0"
    )}h ${String(minutes).padStart(2, "0")}m ${String(
      secs
    ).padStart(2, "0")}s`;
  };

  if (loading) {
    console.log("⏳ Showing loading screen...");
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading countdown...
        </Text>
      </View>
    );
  }

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
  loadingText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
  },
});
