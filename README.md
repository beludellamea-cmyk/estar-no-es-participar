# ESTAR NO ES PARTICIPAR

Novela visual interactiva para el **Mes de la Inclusión**. Un grupo organiza una jornada comunitaria en El Colorado, Formosa, y vos decidís cómo se comunica, cómo se llega, cómo se conversa, cómo se participa y cómo se eligen los apoyos. Dura entre 8 y 12 minutos, sin límite de tiempo.

> Belén Dellamea · Experiencia educativa creada con IA

## Qué incluye

- **5 capítulos** con narración y diálogos breves: la invitación, la llegada, la conversación, la actividad y las decisiones.
- **5 decisiones** con 3 alternativas plausibles cada una. Cambian los diálogos y las consecuencias posteriores (por ejemplo, cómo llegó Nélida según cómo invitaste, o cómo se siente Moncho en la actividad según cómo resolviste la entrada).
- **“Escuchar otra perspectiva”** en las escenas clave.
- Tras cada decisión: **qué barrera apareció, qué derecho se relaciona y qué acción podría abrir la participación**, con enlace a “Derechos y fuentes”.
- **3 finales** según el recorrido, con ejemplos concretos de lo que pasó y la pregunta final. Botón **“Volver a mirar mis decisiones”** para cambiar una decisión y recalcular.
- **Modo individual y grupal** en un mismo dispositivo (en el grupal se muestran las opciones, se conversa, se elige una y se confirma).
- **Lectura en voz alta** con la SpeechSynthesis del navegador (sin micrófono, sin claves, sin servicios pagos). Opciones “Con narración” / “Sin narración”, escuchar/repetir, pausar/reanudar, detener y desactivar.
- **Escena 3D** (Three.js) de la plaza y la entrada del salón, que forma parte de la historia: se puede girar y se transforma según las decisiones. Si WebGL falla, se muestra una vista lateral equivalente y se puede seguir.
- **Accesibilidad**: teclado completo, foco visible, botones grandes, texto ampliable (A− / A+), `prefers-reduced-motion`, sin destellos, sin pruebas con tiempo y sin información sólo por color o sonido.
- **Progreso local**: se guarda sólo en el navegador (`localStorage`). Hay botón de reinicio. No pide cuentas ni datos personales.

## Probarlo en tu computadora

Es un sitio estático. Los módulos de JavaScript necesitan un servidor local (no funcionan abriendo el archivo con doble clic):

```bash
cd estar-no-es-participar
python3 -m http.server 8000
# abrí http://localhost:8000/
```

Para ver la alternativa sin 3D: `http://localhost:8000/?sin3d=1` (o el botón “Usar vista simple” dentro de la escena 3D).

## Publicarlo en GitHub Pages

1. Integrá la rama en `main` (revisando la propuesta de cambios).
2. En el repositorio: **Settings → Pages**.
3. En **Build and deployment**: *Source* = **Deploy from a branch**; *Branch* = **main** y carpeta **/(root)**. Guardá.
4. En uno o dos minutos queda en `https://<usuario>.github.io/<repositorio>/`.

No hay paso de compilación: el resultado ya está en la raíz. Todas las rutas son relativas (funciona dentro de un subdirectorio) y `.nojekyll` evita el procesamiento de Jekyll.

## Estructura

```
index.html            página única
css/styles.css        estilos
js/story.js           guion: capítulos, decisiones, consecuencias, finales, derechos y fuentes
js/app.js             motor de la novela visual, estado, interfaz
js/voice.js           lectura en voz alta (SpeechSynthesis)
js/scene3d.js         escena 3D (Three.js)
js/art.js             personajes, escenarios y afiche en SVG (originales)
vendor/               Three.js r160 y OrbitControls (MIT), copiados localmente
FUENTES-Y-LICENCIAS.md
```

## Para editar el contenido

Todo el texto está en `js/story.js`. Cada escena (“beat”) puede tener campos fijos o funciones `(s) => …` que miran las decisiones (`s.d.c1`, `s.d.c2`, …) para cambiar diálogos y consecuencias. Lo que se muestra es lo mismo que se lee en voz alta.

## Notas sobre la voz

- Se usa la voz en español de Argentina (`es-AR`) si el dispositivo la tiene; si no, otra en español (`es-419`, `es-US`, `es-MX`, `es-ES`…). Si no hay ninguna voz en español, se usa la predeterminada y se avisa.
- La calidad y las voces disponibles dependen del navegador y del sistema operativo.
- Si usás lector de pantalla, elegí “Sin narración” para evitar dos voces a la vez.
- No hay música de fondo en esta versión.

## Limitaciones conocidas

Ver la sección final de la entrega y [FUENTES-Y-LICENCIAS.md](FUENTES-Y-LICENCIAS.md). En particular: los textos de derechos son **paráfrasis** y los enlaces oficiales deben revisarse antes de publicar; no hay intérprete de lengua de señas en video (la LSA aparece representada por texto).
