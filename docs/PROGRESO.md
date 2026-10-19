# CORONA REAL 2.0v1 — progreso y traspaso

## Identidad del proyecto
- Nombre: CORONA REAL 2.0v1.
- Repositorio anterior mencionado: `maidanamauro816-cpu/Coronareal2.0`.
- Repositorio nuevo: `maidanamauro816-cpu/Coronareal-2.0v1`.
- Rama principal: `main`.
- El repositorio nuevo fue localizado, pero estaba vacío (`size: 0)); `package.json` devuelve 404. La documentación de este commit constituye el traspaso inicial.
- No se ha confirmado una compilación ni se ha generado un APK.

## Stack declarado por el usuario
```json
{
  "name": "coronareal2-0",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.28",
    "expo-router": "~3.5.23",
    "expo-status-bar": "~1.12.1",
    "firebase": "^10.12.2",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "react-native-safe-area-context": "4.10.5",
    "react-native-screens": "3.31.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "typescript": "^5.3.3"
  }
}
```
Mantener Expo SDK 51 y RN 0.74.5 hasta poder revisar el proyecto completo.

## Estructura informada
```text
app/
  _layout.tsx
  (auth)/
    _layout.tsx
    login.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    servicios/
      index.tsx
      [categoria].tsx
    reservas/
      index.tsx
      nuevo.tsx
    tienda/
      index.tsx
    perfil/
      index.tsx
assets/images/
  logo_1024.png
  logo_512.png
  logo_256.png
services/
  firebase.ts
  firestore.ts
app.json
package.json
firestore.rules
firestore.indexes.json
firebase.json
```
La estructura fue comunicada por el usuario, pero los archivos binarios y fuentes no se han subido todos a este repositorio todavía.

## Diseño y navegación
- Fondo negro `#0A0A0A`; dorado `#FFD700`; dorado metálico `#D4AF37`.
- Barra inferior de cinco pestañas: Inicio, Servicios, Reservas, Tienda, Perfil.
- El usuario compartió una versión de `app/(tabs)/_layout.tsx` con `headerShown: false` y tamaños de barra específicos por plataforma.
- Root layout escucha Firebase Auth y alterna grupos `(auth)` y `(tabs)`. Se propuso revisar redirecciones, pero no está probado.
- El inicio debe mostrar seis categorías, pero el contenido de `app/(tabs)/index.tsx` todavía no se ha compartido en este hilo.

## Catálogo compartido
Ejemplos actuales en `app/(tabs)/servicios/index.tsx`:
- Crew Cut — Barbería Clásica — 4000
- Low Fade — Degradados & Fade — 4500
- Balayage — Colorimetría — 15000
- Semipermanente — Manicuría — 5000
- Hot Towel Shave — Afeitado — 3500
- Botox Capilar — Tricología — 9000

Estos precios son datos de ejemplo hasta que el usuario los confirme. La pantalla usa el logo transparente y el tema negro/dorado. Revisar navegación a `/servicios/[categoria]`, especialmente categorías con espacios y acentos.

## Reservas / Firestore
El usuario compartió funciones para:
- crear reserva con consulta previa de disponibilidad;
- escuchar reservas del día en tiempo real;
- escuchar reservas propias en tiempo real;
- consultar horas ocupadas;
- confirmar, cancelar, completar y eliminar reservas;
- escuchar catálogo de servicios.

Riesgos a resolver:
1. Una consulta previa con `getDocs` no impide dos solicitudes concurrentes para el mismo horario.
2. La consulta actual compara coincidencia exacta de `horaInicio`; no detecta intervalos que se solapan por duración.
3. Añadir callback de error a `onSnapshot` y estados de carga/error en Mis Reservas.
4. Verificar índices compuestos que Firestore solicite.
5. Limitar en reglas qué campos pueden modificar cliente, barbero y administrador.

## Revisión de seguridad
En las reglas compartidas:
- `/users` permite lectura a todo usuario autenticado: revisar exposición de datos.
- La creación del perfil permite un campo `rol` arbitrario; un usuario podría intentar asignarse `admin` o `barbero`. Debe impedirse el autoascenso de rol.
- La actualización de reservas no limita todos los campos modificables.
- No asumir que reglas de Firestore garantizan disponibilidad exclusiva.
- Validar roles y documentos existentes antes de desplegar reglas corregidas.

## Tareas priorizadas
1. Añadir fuentes reales y assets al repositorio.
2. Revisar `services/firebase.ts`; no publicar claves privadas, tokens ni credenciales administrativas.
3. Revisar rutas y guardas de autenticación en `app/_layout.tsx`.
4. Revisar home y las seis categorías.
5. Corregir navegación a detalle de servicio.
6. Completar manejo de errores/carga en reservas.
7. Diseñar protección atómica de disponibilidad y detección de solapamientos.
8. Endurecer reglas Firestore y probarlas.
9. Revisar tienda, perfil y flujo de nueva reserva.
10. Instalar dependencias y compilar; aún no hay build verificado.
