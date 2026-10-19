# CORONA REAL 2.0v1

Aplicación móvil Expo Router + React Native + Firebase para Corona Real, con estética premium negra y dorada.

## Incluye en esta rama
- Login y registro por correo/contraseña con Firebase Authentication.
- Inicio con seis categorías de servicios.
- Catálogo de servicios y detalle por categoría.
- Solicitud de reservas y lista en tiempo real.
- Catálogo inicial de tienda.
- Perfil editable con foto Base64 guardada en Firestore, sin Firebase Storage.
- Cinco pestañas inferiores: Inicio, Servicios, Reservas, Tienda y Perfil.
- Reglas e índice iniciales de Firestore.
- Workflow de GitHub Actions para compilar un APK Android de depuración.

## Stack
- Expo SDK `~51.0.28`
- Expo Router `~3.5.23`
- React Native `0.74.5`
- Firebase JS SDK `10.12.2`
- TypeScript

## Firebase
Se incorporó el archivo Android `google-services.json` del proyecto Firebase `coronareal2v1`, paquete `com.maidanamauro.coronareal2v1`.

**Requisitos de consola aún por verificar:** habilitar Email/Password en Authentication, comprobar reglas/índices de Firestore y confirmar que existe la configuración de una app web Firebase válida para el SDK JavaScript. Las reglas locales de este repositorio no se despliegan automáticamente a Firebase.

## Foto de perfil sin Storage
La imagen se recorta a 1:1 con Expo Image Picker y se guarda como `data:image/jpeg;base64,...` en `users/{uid}.fotoPerfil`. El archivo limita la imagen antes de guardar para dejar margen dentro del límite de 1 MiB por documento de Firestore. No se usa `firebase/storage`.

## Precios y tienda
Los precios del catálogo son ejemplos heredados de la documentación, no tarifas confirmadas. La tienda es por ahora un catálogo visual sin pagos ni inventario conectado.

## Compilación
El workflow [Android APK](.github/workflows/android-apk.yml) se ejecuta automáticamente al cambiar los archivos relevantes. Consultá la pestaña **Actions** para ver el resultado y descargar el artefacto `corona-real-debug-apk` cuando el build termine.

## Próximas verificaciones
1. Confirmar compilación en Actions y corregir errores detectados.
2. Probar login/registro y lectura/escritura de Firestore con una cuenta real.
3. Confirmar los índices y reglas en Firebase Console.
4. Confirmar la app web Firebase config si el SDK JavaScript requiere un `appId` web.
5. Reemplazar precios de ejemplo y completar horarios/disponibilidad real de reservas.

© Mauro Iván Maidana