import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const CATEGORIAS = [
  { icon: "✂", title: "Barbería Clásica", detail: "Cortes tradicionales y modernos" },
  { icon: "⚡", title: "Degradados & Fade", detail: "Precisión en cada detalle" },
  { icon: "✦", title: "Colorimetría", detail: "Color y estilo personalizado" },
  { icon: "♧", title: "Manicuría", detail: "Cuidado de manos y uñas" },
  { icon: "♜", title: "Afeitado", detail: "Afeitado clásico y toalla caliente" },
  { icon: "✧", title: "Tricología", detail: "Tratamientos capilares" },
];

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.crown}>♛</Text>
      <Text style={styles.brand}>CORONA REAL</Text>
      <Text style={styles.subtitle}>TU ESTILO. TU CORONA.</Text>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>BIENVENIDO</Text>
        <Text style={styles.bannerText}>Una experiencia premium de cuidado y estilo.</Text>
        <TouchableOpacity style={styles.goldButton} onPress={() => router.push("/(tabs)/servicios")}>
          <Text style={styles.goldButtonText}>EXPLORAR SERVICIOS</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>NUESTROS SERVICIOS</Text>
      <View style={styles.grid}>
        {CATEGORIAS.map((item) => (
          <TouchableOpacity key={item.title} style={styles.category} onPress={() => router.push({ pathname: "/(tabs)/servicios/[categoria]", params: { categoria: item.title } })}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.categoryTitle}>{item.title}</Text>
            <Text style={styles.categoryDetail}>{item.detail}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.copyright}>© Mauro Iván Maidana</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { padding: 18, paddingTop: 30, paddingBottom: 30 },
  crown: { textAlign: "center", color: "#FFD700", fontSize: 44 },
  brand: { color: "#FFD700", fontSize: 27, fontWeight: "900", letterSpacing: 3, textAlign: "center" },
  subtitle: { color: "#AAAAAA", fontSize: 10, letterSpacing: 3, textAlign: "center", marginTop: 8, marginBottom: 24 },
  banner: { backgroundColor: "#171717", borderColor: "#D4AF37", borderWidth: 1, borderRadius: 18, padding: 20, marginBottom: 26 },
  bannerTitle: { color: "#FFD700", fontSize: 20, fontWeight: "900", letterSpacing: 2 },
  bannerText: { color: "#DDDDDD", fontSize: 13, lineHeight: 20, marginTop: 8, marginBottom: 16 },
  goldButton: { backgroundColor: "#FFD700", padding: 13, borderRadius: 10, alignItems: "center" },
  goldButtonText: { color: "#0A0A0A", fontWeight: "900", fontSize: 12, letterSpacing: 1 },
  sectionTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", letterSpacing: 1.5, marginBottom: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  category: { width: "48%", backgroundColor: "#151515", borderWidth: 1, borderColor: "#3B3218", borderRadius: 14, padding: 14, marginBottom: 12, minHeight: 145 },
  icon: { color: "#FFD700", fontSize: 26, marginBottom: 9 },
  categoryTitle: { color: "#FFD700", fontSize: 13, fontWeight: "800" },
  categoryDetail: { color: "#AAAAAA", fontSize: 11, lineHeight: 16, marginTop: 6 },
  copyright: { color: "#777777", fontSize: 10, textAlign: "center", marginTop: 20 },
});