import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SERVICIOS } from "./index";

export default function CategoriaScreen() {
  const params = useLocalSearchParams<{ categoria: string }>();
  const categoria = decodeURIComponent(String(params.categoria || ""));
  const router = useRouter();
  const items = SERVICIOS.filter((item) => item.categoria === categoria);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{categoria.toUpperCase()}</Text>
      <Text style={styles.subtitle}>Servicios disponibles</Text>
      {items.length ? items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.name}>{item.nombre}</Text>
          <Text style={styles.price}>${item.precio.toLocaleString("es-AR")}</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: "/(tabs)/reservas/nuevo", params: { servicio: item.nombre } })}>
            <Text style={styles.buttonText}>RESERVAR ESTE SERVICIO</Text>
          </TouchableOpacity>
        </View>
      )) : <Text style={styles.empty}>No hay servicios cargados en esta categoría.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { padding: 20, paddingTop: 28 },
  title: { color: "#FFD700", fontSize: 22, fontWeight: "900", letterSpacing: 1.5 },
  subtitle: { color: "#AAAAAA", marginTop: 8, marginBottom: 20 },
  card: { backgroundColor: "#151515", borderColor: "#D4AF37", borderWidth: 1, borderRadius: 16, padding: 18, marginBottom: 12 },
  name: { color: "#FFFFFF", fontSize: 17, fontWeight: "800" },
  price: { color: "#FFD700", fontSize: 20, fontWeight: "900", marginTop: 10 },
  button: { backgroundColor: "#FFD700", padding: 13, borderRadius: 10, alignItems: "center", marginTop: 18 },
  buttonText: { color: "#0A0A0A", fontWeight: "900", fontSize: 12 },
  empty: { color: "#BBBBBB" },
});