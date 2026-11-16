# 0008. Sesión con un adaptador: Firebase hoy, PHP mañana

- **Fecha:** 2026-11-13
- **Estado:** aceptada

## Contexto

El inicio de sesión se hará con Firebase, pero más adelante Balam tendrá un backend en PHP. El cambio no debe obligar a reescribir las pantallas, los componentes ni el enrutador.

También había que decidir cómo son las cuentas. Las condiciones que importaban:

- El estudiante no tiene celular: la cuenta vive en el celular del padre, y un padre puede tener varios hijos en la clase.
- Muchos padres no usan correo electrónico, o no lo recuerdan.
- Solo entran familias de la clase: no hay registro abierto.
- Hay que ahorrar datos móviles y consultas a Firestore.

## Decisión

**Las cuentas:** una cuenta por familia, con sus hijos dentro. El docente crea las cuentas y entrega en papel, a inicio de año, un usuario (por ejemplo `perez.familia`) y una clave. Si alguien la pierde, va a la escuela y el docente genera una clave nueva; la anterior deja de servir. Las claves no vencen.

**La sesión y el adaptador:** el resto de la app solo importa `js/sesion.js`. Ese archivo delega lo que toca el servidor en un adaptador (`js/firebase/adaptador-sesion.js` hoy, `js/php/adaptador-sesion.js` mañana). Solo la carpeta `js/firebase/` importa Firebase.

El trabajo se divide así:

- **El adaptador solo habla con el servidor.** Cada adaptador cumple este contrato:

  ```js
  haySesion(); // → Promise<boolean>, sin internet ni lecturas
  iniciarSesion(usuario, clave); // → Promise<Familia>, o ErrorDeSesion
  cerrarSesion(); // → Promise<void>
  ```

- **`sesion.js` es dueño del teléfono.** Guarda la familia en `localStorage` al iniciar sesión, la lee al abrir la app y la borra al cerrarla. Lo que ofrece a la app:

  ```js
  obtenerSesion(); // → Promise<Familia | null>
  iniciarSesion(usuario, clave); // → Promise<Familia>, o ErrorDeSesion
  cerrarSesion(); // → Promise<void>
  ```

  Así guardar en el teléfono se escribe una sola vez, y no en cada adaptador.

- **`js/familia.js` es la aduana.** `convertirEnFamilia` valida y limpia todo lo que dice ser una familia, venga del servidor o del teléfono. Es pura, para poder probarla en Node.

Además:

- `Familia` es un tipo propio (`usuario` y `hijos`, cada hijo con `id`, `nombre` y `grado`). Nunca se devuelve el `User` de Firebase.
- `ErrorDeSesion` es un error propio con un tipo (`'clave-incorrecta'`, `'sin-conexion'`…), para que la pantalla de login muestre el mensaje correcto sin conocer los errores de Firebase ni de PHP. Cada adaptador traduce sus propios errores (Firebase lo hace en `js/firebase/errores.js`).
- **La sesión dice quién eres, no todo lo que tienes.** `iniciarSesion` lee el documento de la familia una sola vez y `sesion.js` guarda la lista de hijos en el teléfono. `obtenerSesion` no consulta Firestore. Los datos de cada pantalla (notas, avisos) los pide la pantalla, a través de otro adaptador que se diseñará cuando haga falta.
- Si la familia guardada está dañada o es de una versión vieja de la app, `obtenerSesion` cierra la sesión y devuelve `null`: el padre vuelve al login en vez de quedar trabado.
- El hijo que el padre está viendo es una preferencia guardada en el teléfono, no parte de la sesión.

## Alternativas consideradas

- **Usar Firebase directamente en las pantallas:** es más rápido hoy, pero el cambio a PHP tocaría todos los archivos.
- **Una cuenta por estudiante:** con hermanos habría que cambiar de cuenta, y Firebase maneja una sola sesión a la vez.
- **Un código de un solo uso que vence en un mes:** Firebase no lo ofrece. Habría que programarlo con Cloud Functions, que necesita el plan de pago.
- **Entrar con el número de identidad del estudiante:** no es secreto (aparece en muchos documentos) y es un dato sensible de un menor que no conviene guardar.
- **Recuperar la cuenta con un formulario y una foto del estudiante:** habría que guardar fotos de menores y revisarlas a mano. Ir a la escuela es más simple y más seguro.
- **Restablecer la clave desde la consola de Firebase:** la consola envía un correo, y estas cuentas usan un correo inventado (`usuario@balam.local`) que nunca lo recibe. Las claves se cambian con un script local que usa el Firebase Admin SDK y es gratis.

## Consecuencias

**Ganamos:**

- Cambiar a PHP es escribir `js/php/adaptador-sesion.js`, cambiar una línea en `sesion.js` y borrar la carpeta `js/firebase/`.
- La validación de la familia y el manejo del teléfono no se repiten al migrar: los adaptadores solo traen los datos.
- La sesión persiste en el teléfono, como en WhatsApp: el padre inicia sesión una sola vez.
- Abrir la app no gasta lecturas de Firestore.
- Usuario y clave son el modelo más estándar de PHP: la migración no cambia la experiencia de los padres.

**Aceptamos:**

- Una capa más de código: el adaptador traduce los datos y los errores.
- Una importación circular: `sesion.js` importa el adaptador y el adaptador importa `ErrorDeSesion` de `sesion.js`. Funciona porque `ErrorDeSesion` solo se usa dentro de las funciones, pero hay que tenerlo presente al mover código.
- Si el docente agrega un hijo a una familia, el teléfono no se entera hasta que se actualice la lista (pendiente de decidir cómo).
- Las cuentas no se pueden crear desde la app: se crean con un script en la computadora del docente.
- Mamá y papá comparten la misma cuenta si cada uno tiene su teléfono.

**Revisar la decisión si:** Balam se abre a otras escuelas (las cuentas no podrían depender de un solo docente), o si se agregan las llaves de acceso (passkeys), que cambian cómo se inicia sesión pero no el contrato.
