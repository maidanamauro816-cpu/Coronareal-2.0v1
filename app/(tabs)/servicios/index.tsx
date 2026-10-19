import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export const SERVICIOS = [
  { id: "1", categoria: "Barbería Clásica", nombre: "Crew Cut", precio: 4000 },
  { id: "2", categoria: "Degradados & Fade", nombre: "Low Fade", precio: 4500 },
  { id: "3", categoria: "Colorimetría", nombre: "Balayage", precio: 15000 },
  { id: "4", categoria: "Manicuría", nombre: "Semipermanente", precio: 5000 },
  { id: "5", categoria: "Afeitado", nombre: "Hot Towel Shave", precio: 3500 },
  { id: "6", categoria: "Tricología", nombre: "Botox Capilar", precio: 9000 },
];

export default function ServiciosScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>SERVICIOS</Text>
      <Text style={styles.subtitle}>Elegí tu próximo estilo</Text>
      {SERVICIOS.map((servicio) => (
        <TouchableOpacity key={servicio.id} style={styles.card} onPress={() => router.push({ pathname: "/(tabs)/servicios/[categoria]", params: { categoria: servicio.categoria } })}>
          <View style={styles.row}>
            <View style={styles.dot} />
            <View style={styles.texts}>
              <Text style={styles.name}>{servicio.nombre}</Text>
              <Text style={styles.category}>{servicio.categoria}</Text>
            </View>
            <Text style={styles.price}>${servicio.precio.toLocaleString("es-AR")}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <Text style={styles.note}>Precios de referencia sujetos a confirmación del local.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { padding: 18, paddingTop: 28, paddingBottom: 35 },
  title: { color: "#FFD700", fontSize: 24, fontWeight: "900", letterSpacing: 3 },
  subtitle: { color: "#AAAAAA", marginTop: 7, marginBottom: 22 },
  card: { backgroundColor: "#151515", borderWidth: 1, borderColor: "#4B3D18", borderRadius: 14, padding: 16, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#FFD700", marginRight: 12 },
  texts: { flex: 1 },
  name: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  category: { color: "#AAAAAA", fontSize: 12, marginTop: 5 },
  price: { color: "#FFD700", fontSize: 14, fontWeight: "800", marginLeft: 8 },
  note: { color: "#777777", fontSize: 11, marginTop: 8, textAlign: "center" },
});