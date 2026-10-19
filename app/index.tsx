import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";

export default function IndexRoute() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setSignedIn(Boolean(user));
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0A0A", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#FFD700" size="large" />
      </View>
    );
  }

  return <Redirect href={signedIn ? "/(tabs)" : "/(auth)/login"} />;
}