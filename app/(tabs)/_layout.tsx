import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#888888",
        tabBarStyle: {
          backgroundColor: "#0A0A0A",
          borderTopColor: "#D4AF37",
          borderTopWidth: 0.6,
          height: Platform.OS === "android" ? 68 : 84,
          paddingBottom: Platform.OS === "android" ? 10 : 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Inicio", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="servicios/index" options={{ title: "Servicios", tabBarIcon: ({ color, size }) => <Ionicons name="cut-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="reservas/index" options={{ title: "Reservas", tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="tienda/index" options={{ title: "Tienda", tabBarIcon: ({ color, size }) => <Ionicons name="bag-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="perfil/index" options={{ title: "Perfil", tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="servicios/[categoria]" options={{ href: null }} />
      <Tabs.Screen name="reservas/nuevo" options={{ href: null }} />
    </Tabs>
  );
}