import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      router.replace("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 2000,
    easing: Easing.linear,
    useNativeDriver: true,
  }).start();

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }]}
    >
      <Image
        source={require("../assets/lastplayer-logo.jpeg")}
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        onChangeText={setPassword}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <Text
        onPress={() => router.push("/signup")}
        style={styles.link}
      >
        Don't have an account? Sign up
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
    backgroundColor: "#111111",
  },
  logo: {
    width: 150,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ff9900",
    color: "#fff",
    backgroundColor: "#111",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#ff9900",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  link: {
    color: "#ff9900",
    marginTop: 10,
    textAlign: "center",
  },
});
