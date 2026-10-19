# Código compartido en la conversación

Los siguientes fragmentos fueron compartidos por el usuario. Son una copia documental para continuidad; no significa que estén compilados o aplicados en una app funcional.

## `app/(tabs)/_layout.tsx` — versión más reciente
```tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabsLayout(){
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor:'#FFD700',
      tabBarInactiveTintColor:'rgba(255,255,255,0.6)',
      tabBarStyle:{
        backgroundColor:'#0A0A0A',
        borderTopColor:'#D4AF37',
        borderTopWidth:0.5,
        height: Platform.OS === 'android' ? 70 : 85,
        paddingBottom: Platform.OS === 'android' ? 12 : 25,
        paddingTop: 8,
      },
      headerStyle:{backgroundColor:'#0A0A0A'},
      headerTintColor:'#FFD700'
    }}>
      <Tabs.Screen name="index" options={{title:"Inicio", tabBarIcon:({color})=><Ionicons name="home" size={24} color={color}/>}} />
      <Tabs.Screen name="servicios/index" options={{title:"Servicios", tabBarIcon:({color})=><Ionicons name="cut" size={24} color={color}/>}} />
      <Tabs.Screen name="reservas/index" options={{title:"Reservas", tabBarIcon:({color})=><Ionicons name="calendar" size={24} color={color}/>}} />
      <Tabs.Screen name="tienda/index" options={{title:"Tienda", tabBarIcon:({color})=><Ionicons name="bag" size={24} color={color}/>}} />
      <Tabs.Screen name="perfil/index" options={{title:"Perfil", tabBarIcon:({color})=><Ionicons name="person" size={24} color={color}/>}} />
    </Tabs>
  )
}
```

## `app/_layout.tsx` — versión inicial compartida
```tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function RootLayout() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return null;

  return (
    <>
      <StatusBar style="light" backgroundColor="#0A0A0A" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: '#0A0A0A' },
        headerTintColor: '#FFD700',
        contentStyle: { backgroundColor: '#0A0A0A' },
        animation: 'slide_from_right',
      }}>
        {!isAuth ? (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="servicios/[categoria]" options={{ title: 'CORONA REAL', headerBackTitle: 'Volver' }} />
        <Stack.Screen name="reservas/nuevo" options={{ title: 'Nueva Reserva', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
```
Se debe verificar la ruta de pantallas, ya que la estructura comunicada sitúa detalle y reserva nueva dentro de `(tabs)`.

## `app/(tabs)/servicios/index.tsx`
```tsx
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const SERVICIOS = [
  {id:"1", cat:"Barbería Clásica", nombre:"Crew Cut", precio:4000},
  {id:"2", cat:"Degradados & Fade", nombre:"Low Fade", precio:4500},
  {id:"3", cat:"Colorimetría", nombre:"Balayage", precio:15000},
  {id:"4", cat:"Manicuría", nombre:"Semipermanente", precio:5000},
  {id:"5", cat:"Afeitado", nombre:"Hot Towel Shave", precio:3500},
  {id:"6", cat:"Tricología", nombre:"Botox Capilar", precio:9000},
];

export default function ServiciosList(){
  const router = useRouter();
  return (
    <ScrollView style={{flex:1, backgroundColor:"#0A0A0A"}} contentContainerStyle={{padding:16, paddingTop:50}}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:20}}>
        <Image source={require("../../../assets/images/logo_1024.png")} style={{width:28, height:28}} />
        <Text style={{color:"#FFD700", fontSize:20, fontWeight:"bold", marginLeft:8}}>SERVICIOS</Text>
      </View>
      {SERVICIOS.map(s=>(
        <TouchableOpacity key={s.id} onPress={()=>router.push(`/servicios/${s.cat}` as any)}
          style={{backgroundColor:"#111", borderColor:"#D4AF37", borderWidth:0.5, borderRadius:16, padding:16, marginBottom:10}}>
          <Text style={{color:"#FFD700", fontWeight:"bold"}}>{s.nombre}</Text>
          <Text style={{color:"white", opacity:0.7, marginTop:4}}>{s.cat} - ${s.precio}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}
```

## `app/(tabs)/reservas/index.tsx` — versión inicial
```tsx
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { escucharMisReservas } from '../../../services/firestore';
import { auth } from '../../../services/firebase';
import { useRouter } from 'expo-router';

export default function MisReservas(){
  const [reservas, setReservas] = useState<any[]>([]);
  const router = useRouter();
  useEffect(()=>{
    if(!auth.currentUser) return;
    return escucharMisReservas(auth.currentUser.uid, setReservas);
  },[]);
  return (
    <ScrollView style={{flex:1, backgroundColor:"#0A0A0A"}} contentContainerStyle={{padding:16, paddingTop:50}}>
      <Text style={{color:"#FFD700", fontSize:22, fontWeight:"bold", marginBottom:20}}>MIS RESERVAS</Text>
      {reservas.length===0 ? (
        <Text style={{color:"white", opacity:0.6}}>No tenés reservas aún</Text>
      ) : reservas.map(r=>(
        <View key={r.id} style={{backgroundColor:"#111", borderColor:"#D4AF37", borderWidth:0.5, borderRadius:16, padding:16, marginBottom:10}}>
          <Text style={{color:"#FFD700"}}>{r.fecha} - {r.horaInicio}</Text>
          <Text style={{color:"white"}}>Estado: {r.estado}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={()=>router.push("/reservas/nuevo" as any)}
        style={{backgroundColor:"#FFD700", padding:16, borderRadius:16, marginTop:20, alignItems:"center"}}>
        <Text style={{fontWeight:"bold", color:"black"}}>NUEVA RESERVA</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
```

## `services/firestore.ts`
```ts
import { db } from './firebase';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, getDocs, Timestamp, orderBy, deleteDoc } from 'firebase/firestore';

export interface Reserva {
  id?: string;
  clienteId: string;
  barberoId: string;
  servicioId: string;
  servicioNombre: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
  creado?: any;
  precio?: number;
}

export const crearReserva = async (data: Omit<Reserva, 'id' | 'estado' | 'creado'>) => {
  const q = query(
    collection(db, "reservas"),
    where("barberoId", "==", data.barberoId),
    where("fecha", "==", data.fecha),
    where("horaInicio", "==", data.horaInicio),
    where("estado", "in", ["pendiente", "confirmado"])
  );
  const ocupados = await getDocs(q);
  if (!ocupados.empty) throw new Error("Horario no disponible");

  const docRef = await addDoc(collection(db, "reservas"), {
    ...data,
    estado: "pendiente" as const,
    creado: Timestamp.now(),
  });
  return docRef.id;
};

export const escucharReservasDelDia = (barberoId: string, fecha: string, callback: (reservas: Reserva[]) => void) => {
  const q = query(collection(db, "reservas"), where("barberoId", "==", barberoId), where("fecha", "==", fecha), orderBy("horaInicio", "asc"));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Reserva));
    callback(data.filter(r => r.estado !== 'cancelado'));
  });
};

export const escucharMisReservas = (clienteId: string, callback: (reservas: Reserva[]) => void) => {
  const q = query(collection(db, "reservas"), where("clienteId", "==", clienteId), orderBy("fecha", "desc"));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Reserva));
    callback(data);
  });
};

export const obtenerHorariosOcupados = async (barberoId: string, fecha: string) => {
  const q = query(collection(db, "reservas"), where("barberoId", "==", barberoId), where("fecha", "==", fecha), where("estado", "in", ["pendiente", "confirmado"]));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data().horaInicio);
};

export const confirmarReserva = (id: string) => updateDoc(doc(db, "reservas", id), { estado: "confirmado" });
export const cancelarReserva = (id: string) => updateDoc(doc(db, "reservas", id), { estado: "cancelado" });
export const completarReserva = (id: string) => updateDoc(doc(db, "reservas", id), { estado: "completado" });
export const eliminarReserva = (id: string) => deleteDoc(doc(db, "reservas", id));

export const escucharServicios = (callback: (servicios: any[]) => void) => {
  const q = query(collection(db, "servicios"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
```

## `firestore.rules` compartido
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuth() { return request.auth != null; }
    function isOwner(userId) { return isAuth() && request.auth.uid == userId; }
    function isBarbero() {
      return isAuth() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.rol == 'barbero';
    }
    function isAdmin() {
      return isAuth() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.rol == 'admin';
    }

    match /users/{userId} {
      allow read: if isAuth();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    match /servicios/{servicioId} {
      allow read: if true;
      allow write: if isBarbero() || isAdmin();
    }
    match /reservas/{reservaId} {
      allow read: if isAuth() && (
        resource.data.clienteId == request.auth.uid ||
        resource.data.barberoId == request.auth.uid ||
        isAdmin()
      );
      allow create: if isAuth() &&
        request.resource.data.clienteId == request.auth.uid &&
        request.resource.data.estado == 'pendiente' &&
        request.resource.data.clienteId != null &&
        request.resource.data.barberoId != null &&
        request.resource.data.fecha != null &&
        request.resource.data.horaInicio != null;
      allow update: if isAuth() && (
        (isOwner(resource.data.clienteId) &&
         request.resource.data.estado == 'cancelado' &&
         request.resource.data.clienteId == resource.data.clienteId &&
         request.resource.data.barberoId == resource.data.barberoId &&
         request.resource.data.fecha == resource.data.fecha &&
         request.resource.data.horaInicio == resource.data.horaInicio
        ) ||
        (isOwner(resource.data.barberoId) &&
         request.resource.data.estado in ['confirmado', 'completado'] &&
         request.resource.data.clienteId == resource.data.clienteId
        ) ||
        isAdmin()
      );
      allow delete: if isAdmin();
    }
    match /productos/{productoId} {
      allow read: if true;
      allow write: if isBarbero() || isAdmin();
    }
    match /disponibilidad/{barberoId} {
      allow read: if isAuth();
      allow write: if isOwner(barberoId) || isAdmin();
    }
  }
}
```

## Pendiente acordado: error de Firestore en reservas
Se propuso ampliar `escucharMisReservas` para aceptar un callback `onError` y pasar el tercer argumento de `onSnapshot`. También actualizar la pantalla para mostrar carga/error en vez de quedarse vacía. Esa corrección es una propuesta no probada; aplicar y compilar cuando se incorporen los archivos ejecutables.
