# CORONA REAL 2.0v1 — progreso y traspaso

## Trabajo realizado
Se reconstruyó un esqueleto de aplicación Expo SDK 51 en el repositorio `maidanamauro816-cpu/Coronareal-2.0v1`, rama `main`. Incluye `package.json`, configuración Expo/TypeScript/Babel, inicialización de Firebase JS SDK, rutas de login, inicio, servicios, detalle de categoría, reservas, tienda y perfil, además de reglas/índices iniciales y workflow de GitHub Actions para APK Android.

El perfil fue actualizado directamente en el repositorio:
- Expo Image Picker con recorte 1:1, calidad 0.2 y Base64.
- Foto guardada en `users/{uid}.fotoPerfil` con `setDoc(..., {merge:true})`.
- Sin Firebase Storage.
- Control de tamaño para dejar margen por debajo de 1 MiB.
- Nombre, email, indicador de carga y cierre de sesión.

## Firebase
Se localizó `google-services (4).json` en `maidanamauro816-cpu/Corona-Real` y se copió como `google-services.json` en este repositorio. Identifica proyecto `coronareal2v1` y Android package `com.maidanamauro.coronareal2v1`.

Pendiente verificar en Firebase Console:
- Email/Password habilitado en Authentication.
- La configuración de app web Firebase para el SDK JavaScript; el archivo encontrado es configuración Android.
- Desplegar y probar `firestore.rules` y `firestore.indexes.json`.
- Probar permisos de lectura/escritura con una cuenta real.

## Estado de build
Se añadió `.github/workflows/android-apk.yml`. GitHub Actions recibió un evento push para compilar el APK. El estado final y el artefacto deben confirmarse en la pestaña Actions; no afirmar que el APK funciona hasta ver un run exitoso.

## Límites y tareas pendientes
- No se ha podido probar la aplicación en un teléfono físico desde esta sesión.
- Las seis categorías, precios y tienda son una base inicial; precios son de ejemplo y la tienda no procesa compras.
- El formulario de reserva guarda una solicitud pendiente, pero todavía no implementa disponibilidad real ni evita reservas simultáneas del mismo horario.
- No hay integración de pagos ni un panel administrativo completo.
- No subir claves privadas, tokens ni credenciales administrativas.
- La foto Base64 debe mantenerse pequeña; Firestore limita cada documento a 1 MiB.

## Diseño
- Fondo negro `#0A0A0A`.
- Dorado `#FFD700`; dorado metálico `#D4AF37`.
- Cinco pestañas: Inicio, Servicios, Reservas, Tienda, Perfil.
- Autoría: © Mauro Iván Maidana.
