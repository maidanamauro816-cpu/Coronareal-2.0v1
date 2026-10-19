import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/services/firebase";
import { useRouter } from "expo-router";

type UserData = {
  uid?: string;
  email?: string | null;
  nombre?: string;
  displayName?: string;
  name?: string;
  fotoPerfil?: string;
  [key: string]: unknown;
};

export default function PerfilScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;

      setLoading(true);

      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!mounted) return;

        if (userSnap.exists()) {
          setUserData({
            uid: user.uid,
            email: user.email,
            ...userSnap.data(),
          } as UserData);
        } else {
          setUserData({
            uid: user.uid,
            email: user.email,
            nombre: user.displayName || "Cliente Corona Real",
            fotoPerfil: user.photoURL || undefined,
          });
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        if (mounted) {
          setUserData({
            uid: user.uid,
            email: user.email,
            nombre: user.displayName || "Cliente Corona Real",
            fotoPerfil: user.photoURL || undefined,
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const cambiarFotoPerfil = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Sesión no iniciada", "Iniciá sesión para cambiar tu foto.");
      return;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos acceso a tu galería para elegir una foto."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });

      if (result.canceled || !result.assets?.[0]?.base64) return;

      setUploading(true);

      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, { fotoPerfil: base64Img });
      } else {
        // Crea el documento si el usuario todavía no existe en Firestore.
        await setDoc(
          userRef,
          {
            uid: user.uid,
            email: user.email || "",
            nombre: user.displayName || "Cliente Corona Real",
            fotoPerfil: base64Img,
          },
          { merge: true }
        );
      }

      setUserData((previous) => ({
        ...(previous || {}),
        uid: user.uid,
        email: previous?.email || user.email,
        nombre:
          previous?.nombre ||
          previous?.displayName ||
          user.displayName ||
          "Cliente Corona Real",
        fotoPerfil: base64Img,
      }));

      Alert.alert("Listo", "Foto de perfil actualizada.");
    } catch (error) {
      console.error("Error al actualizar la foto:", error);
      Alert.alert(
        "No se pudo guardar la foto",
        "Revisá tu conexión y las reglas de Firestore. Firestore admite documentos de hasta 1 MiB; si la imagen codificada supera ese límite, elegí una foto más pequeña."
      );
    } finally {
      setUploading(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar la sesión. Intentá nuevamente.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const nombre =
    userData?.nombre ||
    userData?.displayName ||
    userData?.name ||
    "Cliente Corona Real";
  const email = userData?.email || auth.currentUser?.email || "";
  const fotoPerfil =
    typeof userData?.fotoPerfil === "string" && userData.fotoPerfil.length > 0
      ? userData.fotoPerfil
      : auth.currentUser?.photoURL || null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>MI PERFIL</Text>
        <View style={styles.headingLine} />

        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            {fotoPerfil ? (
              <Image
                source={{ uri: fotoPerfil }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {String(nombre).charAt(0).toUpperCase() || "C"}
                </Text>
              </View>
            )}

            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.uploadingText}>Guardando foto...</Text>
              </View>
            )}
          </View>

          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.email}>
            {email || "Correo electrónico no disponible"}
          </Text>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.primaryButton, uploading && styles.disabledButton]}
            onPress={cambiarFotoPerfil}
            disabled={uploading || !auth.currentUser}
            activeOpacity={0.85}
          >
            {uploading ? (
              <ActivityIndicator color="#0A0A0A" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Cambiar foto de perfil
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={cerrarSesion}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.brand}>CORONA REAL</Text>
        <Text style={styles.tagline}>BARBERÍA PREMIUM</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a",
  },
  loadingText: {
    color: "#FFD700",
    marginTop: 12,
    fontSize: 14,
  },
  heading: {
    color: "#FFD700",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 3,
  },
  headingLine: {
    width: 76,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFD700",
    marginTop: 13,
    marginBottom: 30,
  },
  card: {
    width: "100%",
    maxWidth: 430,
    alignItems: "center",
    backgroundColor: "#111111",
    borderColor: "#D4AF37",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 26,
  },
  avatarContainer: {
    width: 154,
    height: 154,
    borderRadius: 77,
    borderWidth: 3,
    borderColor: "#FFD700",
    padding: 4,
    overflow: "hidden",
    marginBottom: 22,
    backgroundColor: "#0a0a0a",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 72,
    backgroundColor: "#202020",
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFD700",
    fontSize: 54,
    fontWeight: "800",
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadingText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
  nombre: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  email: {
    color: "#C8C8C8",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 23,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#3A3218",
    marginBottom: 22,
  },
  primaryButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: "#0A0A0A",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  secondaryButton: {
    width: "100%",
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "700",
  },
  brand: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 4,
    marginTop: 34,
  },
  tagline: {
    color: "#A6A6A6",
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 7,
  },
});

