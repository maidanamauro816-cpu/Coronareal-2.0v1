import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/services/firebase";
import { escucharMisReservas, Reserva } from "@/services/firestore";

export default function ReservasScreen() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      setError("Iniciá sesión para ver tus reservas.");
      return;
    }
    return escucharMisReservas(
      user.uid,
      (items) => { setReservas(items); setLoading(false); setError(""); },
      (err) => { console.error("Error de reservas:", err); setError("No se pudieron cargar las reservas. Revisá los índices y permisos de Firestore."); setLoading(false); }
    );
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>MIS RESERVAS</Text>
      <Text style={styles.subtitle}>Tus turnos en Corona Real</Text>
      {loading ? <ActivityIndicator color="#FFD700" size="large" /> : null}
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && reservas.length === 0 && <Text style={styles.empty}>Todavía no tenés reservas. Elegí un servicio para comenzar.</Text>}
      {reservas.map((r) => (
        <View key={r.id} style={styles.card}>
          <Text style={styles.service}>{r.servicioNombre}</Text>
          <Text style={styles.details}>{r.fecha} · {r.horaInicio}</Text>
          <Text style={styles.status}>Estado: {r.estado}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/reservas/nuevo")}>
        <Text style={styles.buttonText}>+ NUEVA RESERVA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { padding: 20, paddingTop: 30, paddingBottom: 40 },
  title: { color: "#FFD700", fontSize: 23, fontWeight: "900", letterSpacing: 2 },
  subtitle: { color: "#AAAAAA", marginTop: 8, marginBottom: 22 },
  card: { backgroundColor: "#161616", borderColor: "#4B3D18", borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 },
  service: { color: "#FFD700", fontSize: 16, fontWeight: "800" },
  details: { color: "#FFFFFF", marginTop: 8 },
  status: { color: "#AAAAAA", marginTop: 6, fontSize: 12, textTransform: "capitalize" },
  empty: { color: "#BBBBBB", lineHeight: 21, marginTop: 10 },
  error: { color: "#FF8A80", lineHeight: 20, marginTop: 12 },
  button: { backgroundColor: "#FFD700", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 18 },
  buttonText: { color: "#0A0A0A", fontWeight: "900" },
});