import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Explicitly define type

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // No more TypeScript errors!
      setLoading(false);
      if (!user) router.replace("/login");
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
