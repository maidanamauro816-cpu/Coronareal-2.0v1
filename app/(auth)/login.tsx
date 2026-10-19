import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { auth, db } from "@/services/firebase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || password.length < 6) {
      Alert.alert("Datos incompletos", "Ingresá un correo válido y una contraseña de al menos 6 caracteres.");
      return;
    }
    setBusy(true);
    try {
      let credential;
      if (creating) {
        credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (nombre.trim()) await updateProfile(credential.user, { displayName: nombre.trim() });
        await setDoc(doc(db, "users", credential.user.uid), {
          uid: credential.user.uid,
          nombre: nombre.trim() || "Cliente Corona Real",
          email: credential.user.email,
          rol: "cliente",
          creado: new Date().toISOString(),
        }, { merge: true });
      } else {
        credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Error de autenticación:", error);
      Alert.alert("No se pudo ingresar", error?.message || "Revisá tus datos y que Email/Password esté habilitado en Firebase Authentication.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.card}>
        <Text style={styles.crown}>♛</Text>
        <Text style={styles.brand}>CORONA REAL</Text>
        <Text style={styles.subtitle}>{creating ? "CREÁ TU CUENTA" : "BARBERÍA · ESTILO · DISTINCIÓN"}</Text>
        {creating && (
          <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre completo" placeholderTextColor="#888" style={styles.input} />
        )}
        <TextInput value={email} onChangeText={setEmail} placeholder="Correo electrónico" placeholderTextColor="#888" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Contraseña (mínimo 6 caracteres)" placeholderTextColor="#888" secureTextEntry style={styles.input} />
        <TouchableOpacity style={styles.goldButton} onPress={submit} disabled={busy}>
          {busy ? <ActivityIndicator color="#0A0A0A" /> : <Text style={styles.goldText}>{creating ? "CREAR CUENTA" : "INGRESAR"}</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.switchButton} onPress={() => setCreating(!creating)} disabled={busy}>
          <Text style={styles.switchText}>{creating ? "Ya tengo cuenta · Iniciar sesión" : "Crear una cuenta nueva"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.copyright}>© Mauro Iván Maidana</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0A0A0A", alignItems: "center", justifyContent: "center", padding: 22 },
  card: { width: "100%", maxWidth: 430, padding: 24, backgroundColor: "#151515", borderWidth: 1, borderColor: "#D4AF37", borderRadius: 22, alignItems: "center" },
  crown: { color: "#FFD700", fontSize: 52, marginBottom: 2 },
  brand: { color: "#FFD700", fontSize: 27, fontWeight: "900", letterSpacing: 3 },
  subtitle: { color: "#BBBBBB", fontSize: 10, letterSpacing: 2, textAlign: "center", marginTop: 10, marginBottom: 26 },
  input: { width: "100%", color: "#FFFFFF", backgroundColor: "#0A0A0A", borderColor: "#3B3218", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 12 },
  goldButton: { width: "100%", backgroundColor: "#FFD700", paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 4 },
  goldText: { color: "#0A0A0A", fontWeight: "900", letterSpacing: 1 },
  switchButton: { padding: 14, marginTop: 8 },
  switchText: { color: "#FFD700", fontSize: 13, textAlign: "center" },
  copyright: { color: "#777777", marginTop: 26, fontSize: 11 },
});