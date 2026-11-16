# 0007. Flujo de entrada: el navegador instala, la app inicia sesión

- **Fecha:** 2026-11-13
- **Estado:** aceptada

## Contexto

Balam debe usarse solo por las familias de la clase, así que necesita inicio de sesión. Había que decidir qué pantalla ve cada persona al abrir Balam: en el navegador o en la app instalada, en celular o en computadora, con sesión o sin ella.

Las condiciones que importaban:

- **Balam es para celular.** El estudiante no tiene celular propio: usa el del padre, que es quien guarda la cuenta. El docente tampoco necesita funciones en la computadora; si prepara algo ahí, lo pasa como archivo (JSON o Excel) y lo carga desde el celular.
- **Los padres no deben pelear con la tecnología.** Como en WhatsApp, deben iniciar sesión una vez y no volver a hacerlo.
- **No se puede impedir que alguien instale una PWA.** Cualquiera que abra `balam-math.web.app` puede instalarla desde el menú del navegador, aunque la página no muestre ningún botón. Lo que sí se controla es qué ve al abrirla.
- **En iPhone, la app instalada no comparte la sesión con Safari.** Si se pidiera la sesión en el navegador, el padre tendría que iniciar sesión dos veces. En Android sí se comparte.

## Decisión

El navegador solo sirve para instalar y la app instalada es la única puerta de entrada:

| Plataforma | Instalada | Sesión | Pantalla       |
| ---------- | --------- | ------ | -------------- |
| escritorio | —         | —      | `#/bienvenida` |
| celular    | no        | —      | `#/bienvenida` |
| celular    | sí        | no     | `#/login`      |
| celular    | sí        | sí     | `#/inicio`     |

En la computadora siempre se ve la bienvenida, que remite al celular con el QR, **aunque alguien instale la app desde el menú de Chrome o Edge** (la computadora también permite instalar PWA). La ruta escrita a mano no cambia el resultado: la decisión la toma una función pura (`decidirRuta`) que se prueba en Node.

## Alternativas consideradas

- **Iniciar sesión en el navegador antes de instalar:** obliga a los padres con iPhone a iniciar sesión dos veces, y además no protege nada, porque la instalación no se puede impedir.
- **Permitir usar Balam en el navegador sin instalar:** algunos padres nunca la instalarían y la usarían desde una pestaña que se cierra o se pierde.
- **Casos distintos por plataforma (Android, iPhone, escritorio):** funcionaba, pero tenía seis casos en lugar de cuatro y era más difícil de probar y de explicar.
- **Acceso del docente desde la computadora (con un botón "Soy docente" o con un QR, como WhatsApp Web):** el QR necesita un servidor que cree sesiones (Cloud Functions, plan de pago). Hoy no hay ninguna función de escritorio que lo justifique.

## Consecuencias

**Ganamos:**

- Cuatro casos, fáciles de probar y de explicar a las familias: "instala la app y entra con tu usuario".
- Entre celulares no hay diferencias: Android y iPhone siguen las mismas reglas.
- En la computadora no se consulta la sesión.

**Aceptamos:**

- La bienvenida y las instrucciones de instalación son públicas. No es un problema: no tienen datos de nadie.
- **La seguridad no está en el flujo, sino en el servidor.** Las reglas de Firebase (y después PHP) deben negar los datos a quien no tiene sesión, y a cada familia darle solo los suyos. Esconder pantallas no protege nada.
- El docente no tiene acceso web: trabaja desde el celular.

**Revisar la decisión si:** el docente necesita funciones que no caben en el celular, o si Balam deja de ser solo para la clase.
