import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { crearReserva } from "@/services/firestore";

const SERVICIOS = ["Crew Cut", "Low Fade", "Balayage", "Semipermanente", "Hot Towel Shave", "Botox Capilar"];

export default function NuevaReservaScreen() {
  const params = useLocalSearchParams<{ servicio?: string }>();
  const router = useRouter();
  const [servicio, setServicio] = useState(String(params.servicio || SERVICIOS[0]));
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [busy, setBusy] = useState(false);

  const guardar = async () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
      Alert.alert("Revisá los datos", "Usá fecha AAAA-MM-DD y horario HH:MM (por ejemplo 2026-11-05 y 14:30).");
      return;
    }
    setBusy(true);
    try {
      await crearReserva({ servicioNombre: servicio, fecha, horaInicio: hora });
      Alert.alert("Solicitud enviada", "Tu reserva quedó pendiente de confirmación.", [
        { text: "Ver mis reservas", onPress: () => router.replace("/(tabs)/reservas") }
      ]);
    } catch (error: any) {
      console.error("Error creando reserva:", error);
      Alert.alert("No se pudo reservar", error?.message || "Revisá tu conexión y las reglas de Firestore.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>NUEVA RESERVA</Text>
      <Text style={styles.subtitle}>La solicitud quedará pendiente de confirmación.</Text>
      <Text style={styles.label}>Servicio</Text>
      {SERVICIOS.map((item) => (
        <TouchableOpacity key={item} style={[styles.choice, servicio === item && styles.choiceSelected]} onPress={() => setServicio(item)}>
          <Text style={[styles.choiceText, servicio === item && styles.choiceTextSelected]}>{item}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.label}>Fecha (AAAA-MM-DD)</Text>
      <TextInput value={fecha} onChangeText={setFecha} placeholder="2026-11-05" placeholderTextColor="#777" style={styles.input} autoCapitalize="none" />
      <Text style={styles.label}>Horario (HH:MM)</Text>
      <TextInput value={hora} onChangeText={setHora} placeholder="14:30" placeholderTextColor="#777" style={styles.input} keyboardType="numbers-and-punctuation" />
      <TouchableOpacity style={styles.button} onPress={guardar} disabled={busy}>
        {busy ? <ActivityIndicator color="#0A0A0A" /> : <Text style={styles.buttonText}>ENVIAR SOLICITUD</Text>}
      </TouchableOpacity>
      <Text style={styles.note}>El horario no se confirma automáticamente. El local debe revisar la solicitud.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { padding: 20, paddingTop: 28, paddingBottom: 40 },
  title: { color: "#FFD700", fontSize: 22, fontWeight: "900", letterSpacing: 1.5 },
  subtitle: { color: "#AAAAAA", lineHeight: 20, marginTop: 8, marginBottom: 22 },
  label: { color: "#FFFFFF", fontWeight: "800", marginBottom: 9, marginTop: 12 },
  choice: { borderWidth: 1, borderColor: "#373737", backgroundColor: "#151515", borderRadius: 10, padding: 12, marginBottom: 8 },
  choiceSelected: { borderColor: "#FFD700", backgroundColor: "#29230D" },
  choiceText: { color: "#CCCCCC" },
  choiceTextSelected: { color: "#FFD700", fontWeight: "800" },
  input: { color: "#FFFFFF", backgroundColor: "#151515", borderWidth: 1, borderColor: "#4B3D18", borderRadius: 10, padding: 14, marginBottom: 8 },
  button: { backgroundColor: "#FFD700", borderRadius: 12, padding: 15, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#0A0A0A", fontWeight: "900" },
  note: { color: "#777777", fontSize: 11, lineHeight: 17, textAlign: "center", marginTop: 16 },
});