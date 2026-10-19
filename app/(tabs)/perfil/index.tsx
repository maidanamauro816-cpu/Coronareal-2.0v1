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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/services/firebase";
import { useRouter } from "expo-router";

type UserData = {
  uid?: string;
  nombre?: string;
  displayName?: string;
  name?: string;
  email?: string | null;
  fotoPerfil?: string;
  [key: string]: unknown;
};

export default function PerfilScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
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
          const data = userSnap.data();
          setUserData({
            ...data,
            uid: user.uid,
            email: data.email ?? user.email,
            nombre:
              data.nombre ??
              data.displayName ??
              data.name ??
              user.displayName ??
              "Cliente Corona Real",
            fotoPerfil: data.fotoPerfil ?? user.photoURL ?? undefined,
          } as UserData);
        } else {
          const initialData: UserData = {
            uid: user.uid,
            nombre: user.displayName || "Cliente Corona Real",
            email: user.email,
            fotoPerfil: user.photoURL || undefined,
          };
          await setDoc(userRef, initialData, { merge: true });
          if (mounted) setUserData(initialData);
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        if (mounted) {
          setUserData({
            uid: user.uid,
            nombre: user.displayName || "Cliente Corona Real",
            email: user.email,
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
      Alert.alert(
        "Sesión no iniciada",
        "Iniciá sesión para cambiar tu foto de perfil."
      );
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso denegado",
          "Permití el acceso a la galería para elegir una foto."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
        base64: true,
      });

      if (result.canceled || !result.assets?.[0]?.base64) return;

      const base64 = result.assets[0].base64;
      const estimatedImageBytes = Math.floor((base64.length * 3) / 4);

      // Mantener margen para el prefijo data URI y el resto del documento.
      if (estimatedImageBytes > 650 * 1024) {
        Alert.alert(
          "Foto demasiado grande",
          "Elegí una foto más pequeña o recortala. Firestore permite hasta 1 MiB por documento."
        );
        return;
      }

      setUploading(true);

      const fotoPerfil = `data:image/jpeg;base64,${base64}`;
      const userRef = doc(db, "users", user.uid);

      // merge:true crea el documento si falta y conserva los campos existentes.
      await setDoc(
        userRef,
        {
          uid: user.uid,
          nombre:
            userData?.nombre ||
            user.displayName ||
            "Cliente Corona Real",
          email: userData?.email ?? user.email,
          fotoPerfil,
        },
        { merge: true }
      );

      setUserData((previous) => ({
        ...(previous || {}),
        uid: user.uid,
        nombre:
          previous?.nombre ||
          user.displayName ||
          "Cliente Corona Real",
        email: previous?.email ?? user.email,
        fotoPerfil,
      }));

      Alert.alert("¡Listo!", "Tu foto de perfil se guardó correctamente.");
    } catch (error) {
      console.error("Error al guardar la foto de perfil:", error);
      Alert.alert(
        "No se pudo guardar la foto",
        "Revisá tu conexión, las reglas de Firestore y el tamaño de la imagen."
      );
    } finally {
      setUploading(false);
    }
  };

  const cerrarSesion = async () => {
    if (loggingOut || uploading) return;

    try {
      setLoggingOut(true);
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar la sesión. Intentá nuevamente.");
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  if (!auth.currentUser) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.nombre}>Sesión no iniciada</Text>
        <TouchableOpacity
          style={styles.buttonGold}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.buttonGoldText}>Ir al inicio de sesión</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const nombre =
    userData?.nombre ||
    userData?.displayName ||
    userData?.name ||
    auth.currentUser.displayName ||
    "Cliente Corona Real";
  const email = userData?.email ?? auth.currentUser.email ?? "";
  const fotoPerfil = userData?.fotoPerfil || auth.currentUser.photoURL;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>CORONA REAL</Text>
        <Text style={styles.subheading}>MI PERFIL</Text>

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
                  {nombre.trim().charAt(0).toUpperCase() || "C"}
                </Text>
              </View>
            )}

            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color="#FFD700" />
              </View>
            )}
          </View>

          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.email}>{email || "Correo no disponible"}</Text>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.buttonGold, (uploading || loggingOut) && styles.disabledButton]}
            onPress={cambiarFotoPerfil}
            disabled={uploading || loggingOut}
            activeOpacity={0.8}
          >
            {uploading ? (
              <ActivityIndicator color="#0A0A0A" />
            ) : (
              <Text style={styles.buttonGoldText}>Cambiar foto de perfil</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonOutline, (loggingOut || uploading) && styles.disabledButton]}
            onPress={cerrarSesion}
            disabled={loggingOut || uploading}
            activeOpacity={0.8}
          >
            {loggingOut ? (
              <ActivityIndicator color="#FFD700" />
            ) : (
              <Text style={styles.buttonOutlineText}>Cerrar sesión</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.info}>
            La foto se guarda en Firestore sin utilizar Firebase Storage.
          </Text>
        </View>

        <Text style={styles.footer}>ESTILO PREMIUM</Text>
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
    justifyContent: "center",
    padding: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heading: {
    color: "#FFD700",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 4,
    textAlign: "center",
  },
  subheading: {
    color: "#FFFFFF",
    fontSize: 13,
    letterSpacing: 3,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    backgroundColor: "#161616",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 18,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  avatarPlaceholder: {
    backgroundColor: "#292929",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFD700",
    fontSize: 42,
    fontWeight: "bold",
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 62,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  nombre: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 4,
  },
  email: {
    color: "#BBBBBB",
    fontSize: 14,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 22,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#39311A",
    marginBottom: 18,
  },
  buttonGold: {
    backgroundColor: "#FFD700",
    width: "100%",
    minHeight: 50,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonGoldText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  buttonOutline: {
    width: "100%",
    minHeight: 50,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  buttonOutlineText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  info: {
    color: "#888888",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 20,
  },
  loadingText: {
    color: "#FFD700",
    marginTop: 12,
  },
  footer: {
    color: "#D4AF37",
    fontSize: 10,
    letterSpacing: 3,
    textAlign: "center",
    marginTop: 24,
  },
});
