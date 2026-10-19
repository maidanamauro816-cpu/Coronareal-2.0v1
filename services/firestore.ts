import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export type Reserva = {
  id: string;
  clienteId: string;
  clienteEmail?: string | null;
  servicioNombre: string;
  fecha: string;
  horaInicio: string;
  estado: "pendiente" | "confirmado" | "cancelado" | "completado";
  creado?: unknown;
};

export function escucharMisReservas(
  clienteId: string,
  callback: (reservas: Reserva[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, "reservas"),
    where("clienteId", "==", clienteId),
    orderBy("fecha", "desc")
  );
  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Reserva[]
      );
    },
    (error) => onError?.(error)
  );
}

export async function crearReserva(input: {
  servicioNombre: string;
  fecha: string;
  horaInicio: string;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Iniciá sesión para reservar.");

  if (!input.fecha || !input.horaInicio || !input.servicioNombre) {
    throw new Error("Completá el servicio, la fecha y el horario.");
  }

  const ref = await addDoc(collection(db, "reservas"), {
    clienteId: user.uid,
    clienteEmail: user.email ?? null,
    servicioNombre: input.servicioNombre,
    fecha: input.fecha,
    horaInicio: input.horaInicio,
    estado: "pendiente",
    creado: serverTimestamp(),
  });

  return ref.id;
}