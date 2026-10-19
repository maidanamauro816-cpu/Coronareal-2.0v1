import { ScrollView, StyleSheet, Text, View } from "react-native";

const PRODUCTOS = [
  { nombre: "Pomada modeladora", detalle: "Fijación y acabado", precio: "Consultar" },
  { nombre: "Shampoo profesional", detalle: "Limpieza y cuidado capilar", precio: "Consultar" },
  { nombre: "Aceite para barba", detalle: "Suavidad y aroma", precio: "Consultar" },
  { nombre: "Kit de cuidado premium", detalle: "Rutina completa para casa", precio: "Consultar" },
];

export default function TiendaScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>TIENDA PREMIUM</Text>
      <Text style={styles.subtitle}>Productos para mantener tu estilo</Text>
      {PRODUCTOS.map((p) => (
        <View key={p.nombre} style={styles.card}>
          <View style={styles.productIcon}><Text style={styles.icon}>✦</Text></View>
          <View style={styles.info}>
            <Text style={styles.name}>{p.nombre}</Text>
            <Text style={styles.detail}>{p.detalle}</Text>
            <Text style={styles.price}>{p.precio}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.note}>Catálogo inicial. La compra en línea y los precios deben habilitarse por el comercio.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { padding: 20, paddingTop: 30, paddingBottom: 40 },
  title: { color: "#FFD700", fontSize: 23, fontWeight: "900", letterSpacing: 2 },
  subtitle: { color: "#AAAAAA", marginTop: 8, marginBottom: 22 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#151515", borderWidth: 1, borderColor: "#4B3D18", borderRadius: 14, padding: 14, marginBottom: 12 },
  productIcon: { width: 58, height: 58, borderRadius: 12, backgroundColor: "#29230D", alignItems: "center", justifyContent: "center", marginRight: 14 },
  icon: { color: "#FFD700", fontSize: 28 },
  info: { flex: 1 },
  name: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  detail: { color: "#AAAAAA", fontSize: 12, marginTop: 5 },
  price: { color: "#FFD700", fontWeight: "800", marginTop: 8 },
  note: { color: "#777777", fontSize: 11, lineHeight: 17, textAlign: "center", marginTop: 12 },
});