/* Contenido de la novela visual "ESTAR NO ES PARTICIPAR".
   Todo texto que se ve también se lee en voz alta (app.js arma la lectura desde estos mismos campos).
   Los campos de un "beat" pueden ser valores o funciones (s) => valor, donde s.d guarda las decisiones: {c1,c2,...} con 'a' | 'b' | 'c'. */

export const QUESTION = '¿Cuántas veces llamamos ‘dificultad de una persona’ a una barrera que podríamos cambiar?';

export const CHARACTERS = {
  lucia: { name: 'Lucía Benítez', age: 27, role: 'Diseñadora gráfica y organizadora de la jornada',
    bio: 'Ama la cumbia y la cartelería de barrio. Es rápida, generosa y a veces se apura: piensa que “hacer” es lo mismo que “hacer bien”. Está aprendiendo a preguntar antes.' },
  marcela: { name: 'Marcela Duarte', age: 45, role: 'Referente del área de Cultura municipal',
    bio: 'Conoce los presupuestos, los permisos y los plazos. Insiste en que hay cosas que no dependen de la buena voluntad de un grupo, sino de responsabilidades de instituciones.' },
  nelida: { name: 'Nélida Giménez', age: 68, role: 'Maestra rural jubilada. Tiene baja visión',
    bio: 'Hace dulces y tejidos, escucha radioteatros y habla con todo el barrio. Lee con lupa y letra grande; prefiere los mensajes de voz. Tiene opinión sobre todo y la dice.' },
  moncho: { name: 'Ramón “Moncho” Acosta', age: 52, role: 'Mecánico de motos. Usa silla de ruedas',
    bio: 'Fanático del chamamé, arregla lo que se le ponga enfrente y vino a ayudar a armar el escenario. Sabe de pendientes, ruedas y soluciones prácticas. Desconfía de las ayudas que nadie le preguntó si quería.' },
  abril: { name: 'Abril Villalba', age: 19, role: 'Estudiante de diseño y creadora de stickers. Usa comunicación aumentativa',
    bio: 'Dibuja pájaros del monte y frases del barrio. Se comunica con una tablet con pictogramas y voz sintetizada, y con un tablero. Tiene humor filoso y ideas largas: necesita tiempo, no que hablen por ella.' },
  gabriel: { name: 'Gabriel Sosa', age: 24, role: 'Percusionista de la murga. Persona sorda, usa lengua de señas',
    bio: 'Toca el bombo y siente el ritmo por la vibración. Se comunica en lengua de señas argentina (LSA) y por escrito. Le gusta editar videos y organizar ensayos.' },
  tadeo: { name: 'Tadeo Villalba', age: 17, role: 'Hermano de Abril. Juega al vóley',
    bio: 'Acompaña a Abril porque quiere, no por obligación. Tiene buenas intenciones y una tendencia a ayudar de más. Tiene sus propios planes y se aburre fácil.' },
};

export const RIGHTS = {
  art3: { n: 'Artículo 3', t: 'Principios generales', p: 'La Convención parte del respeto a la dignidad de cada persona, a su autonomía —incluida la libertad de tomar sus propias decisiones—, la no discriminación, la participación e inclusión plenas en la sociedad y la accesibilidad.' },
  art9: { n: 'Artículo 9', t: 'Accesibilidad', p: 'Para que las personas con discapacidad puedan vivir de forma independiente y participar plenamente, se deben tomar medidas que aseguren el acceso, en igualdad con las demás personas, al entorno físico, el transporte, la información y las comunicaciones, y a los servicios abiertos al público. Eso implica identificar y eliminar barreras, por ejemplo en edificios y espacios, y ofrecer formas de asistencia como lectores, guías e intérpretes de lengua de señas.' },
  art21: { n: 'Artículo 21', t: 'Libertad de expresión y de opinión, y acceso a la información', p: 'Las personas con discapacidad tienen derecho a expresarse, opinar y acceder a la información en igualdad con las demás, mediante las formas de comunicación que elijan. Eso incluye recibir la información pública en formatos accesibles y a tiempo, y aceptar y facilitar el uso de lenguas de señas, el Braille, la comunicación aumentativa y alternativa y otros medios.' },
  art30: { n: 'Artículo 30', t: 'Participación en la vida cultural, las actividades recreativas, el esparcimiento y el deporte', p: 'Las personas con discapacidad tienen derecho a participar en la vida cultural en igualdad con las demás: acceder a materiales y actividades culturales en formatos accesibles y a los lugares donde se realizan, y poder desarrollar su potencial creativo y artístico, no sólo para sí mismas sino para enriquecer a la sociedad.' },
  art4: { n: 'Artículo 4, apartado 3 (complementario)', t: 'Consulta y participación', p: 'Al elaborar y aplicar leyes y políticas sobre estos temas, los Estados deben consultar estrechamente a las personas con discapacidad y colaborar activamente con ellas, también a través de sus organizaciones.' },
};

const by = (k, map) => (s) => map[s.d[k]];
const acc = (s) => ({ a: 'carry', b: 'improvised', c: 'plan' }[s.d.c2] || 'stairs');

/* ------------------------------------------------------------------ */
/* CAPÍTULO 1 · La invitación                                          */
/* ------------------------------------------------------------------ */
const ch1 = [
  { type: 'title', bg: 'taller', text: 'Capítulo 1. La invitación' },
  { bg: 'taller', chars: [], text: 'El Colorado, Formosa. Es jueves a la tarde y en el salón de la comisión vecinal huele a mate y a pintura fresca. En pocos días se hace la jornada comunitaria del barrio, en el marco del Mes de la Inclusión: música, feria de oficios y un muro para compartir voces.' },
  { bg: 'taller', chars: [], text: 'Vos sos parte del grupo organizador. Lo que decidas va a cambiar quién puede llegar, quién puede entender y quién puede participar.' },
  { bg: 'taller', chars: ['lucia'], who: 'lucia', prop: 'flyer',
    text: '¡Terminé el afiche! Me pasé la noche. Mirá qué lindo quedó.' },
  { bg: 'taller', chars: ['lucia'], prop: 'flyer',
    text: 'El afiche es una sola imagen: colores fuertes, un título enorme y, abajo, en letra muy chica, la fecha, la hora, el lugar y cómo participar. No tiene una versión en texto ni en audio.' },
  { bg: 'taller', chars: ['lucia'], who: 'lucia', prop: 'flyer',
    text: 'Lo mandamos hoy mismo por WhatsApp y por las redes. Hay poco tiempo, y la gente comparte imágenes, no textos largos.',
    persp: { who: 'nelida', text: 'Mis ojos ya no me dejan leer esa letrita, hijo. A mí me llegan manchas de colores. Siempre me entero por la vecina de enfrente, si se acuerda de avisarme. Me gustaría enterarme yo, de primera mano, como todos.' } },
  { bg: 'taller', chars: ['lucia'], text: 'En el grupo, Abril escribió: “Lindo afiche, Lu. ¿Dónde puedo ver cómo llegar y qué se va a hacer? Antes de ir me gusta saber qué me espera.”' },
  { id: 'c1', type: 'choice', bg: 'taller', chars: ['lucia'], prop: 'flyer',
    prompt: 'Quedan unas horas para publicar. ¿Cómo hacés llegar la invitación?',
    options: [
      { id: 'a', value: 0, label: 'Subir la imagen tal como está: es lindísima y no hay tiempo.',
        recap: 'Publicaste la invitación sólo como imagen con letra chica. Nélida se enteró tarde y Moncho no sabía cómo era la entrada.' },
      { id: 'b', value: 1, label: 'Subir la imagen y copiar en el texto del mensaje la fecha, la hora y el lugar.',
        recap: 'Agregaste los datos en texto. Fue un avance, pero no preguntaste cómo preferían recibirlos y faltó contar cómo era el acceso.' },
      { id: 'c', value: 2, label: 'Antes de publicar, preguntarle a Nélida y a Abril por dónde les llegan mejor las invitaciones, y armar versiones con eso.',
        recap: 'Preguntaste antes de publicar y armaste versiones en imagen grande, texto y audio, con datos del acceso. Nélida llegó a horario.' } ],
    perspWho: 'nelida' },
  { type: 'line', bg: 'taller', chars: ['lucia'], prop: 'flyer', when: (s) => s.d.c1 === 'a',
    text: 'La imagen se comparte rápido. Pero quien usa lector de pantalla no puede leerla, y la letra chica no se lee en un celular. Nadie sabe cómo es la entrada del salón.' },
  { bg: 'taller', chars: ['lucia'], prop: 'flyer', when: (s) => s.d.c1 === 'a', who: 'lucia', text: 'Quedó perfecto, ¿no? Ya la vieron cientos de personas.' },
  { bg: 'taller', chars: ['lucia'], prop: 'flyer', when: (s) => s.d.c1 === 'b',
    text: 'Subís la imagen con los datos copiados en el texto. Nélida puede pedirle a su celular que los lea. Pero nadie preguntó cómo prefieren recibir la información, ni se contó cómo es la entrada.' },
  { bg: 'taller', chars: ['lucia'], prop: 'flyer', when: (s) => s.d.c1 === 'b', who: 'lucia', text: 'Por lo menos los datos están en texto. Es más de lo que hacíamos antes.' },
  { bg: 'taller', chars: ['lucia', 'abril'], prop: 'flyer', when: (s) => s.d.c1 === 'c',
    text: 'Nélida contesta con un audio: prefiere mensajes de voz y letra grande en el pizarrón de la panadería. Abril pide que figure cómo es el acceso y si habrá pausas. Armás tres versiones: imagen con letra grande y alto contraste, texto con los datos y un audio corto.' },
  { bg: 'taller', chars: ['lucia', 'abril'], prop: 'flyer', when: (s) => s.d.c1 === 'c', who: 'lucia', text: 'No se me había ocurrido pensar en la radio ni en la panadería. Gracias por frenarme.' },
  { type: 'explain', of: 'c1', bg: 'taller', chars: ['lucia'], prop: 'flyer',
    info: {
      a: { barrier: 'La información estaba sólo en una imagen con letra pequeña, sin alternativa en texto ni audio. Quienes ven poco, usan lector de pantalla o necesitan saber cómo es el acceso quedan afuera antes de llegar.',
        right: 'Artículo 21: acceso a la información en formatos accesibles y a tiempo. Artículo 9: accesibilidad de la información y las comunicaciones.',
        refs: ['art21', 'art9'],
        action: 'Publicar siempre los datos en texto, con letra grande y buen contraste; sumar audio y contar cómo es el acceso al lugar.' },
      b: { barrier: 'La información ya estaba en más de un formato, pero se eligió sin consultar y faltaron los datos de accesibilidad del lugar.',
        right: 'Artículo 21: formatos accesibles y comunicación a elección de cada persona. Artículo 3: participación e inclusión plenas.',
        refs: ['art21', 'art3'],
        action: 'Preguntar a las personas con las que querés contar qué formatos usan, e incluir cómo es la entrada y qué apoyos habrá.' },
      c: { barrier: 'La barrera era un formato único (imagen con letra chica). Se reconoció antes de que dejara afuera a alguien.',
        right: 'Artículo 21 y artículo 9: información accesible. Artículo 3: participación.',
        refs: ['art21', 'art9', 'art3'],
        action: 'Convertir la consulta en hábito: revisar los formatos cada vez que se comunica algo, y contar cómo es el acceso.' } } },
];

/* ------------------------------------------------------------------ */
/* CAPÍTULO 2 · La llegada                                             */
/* ------------------------------------------------------------------ */
const ch2 = [
  { type: 'title', bg: 'plaza', text: 'Capítulo 2. La llegada' },
  { bg: 'plaza', chars: ['lucia', 'marcela'],
    text: 'Sábado, cuatro de la tarde. El sol de Formosa pega fuerte y la plaza se llena de mesas, banderines y olor a empanadas. La actividad central es en el salón de la comisión, frente a la plaza.' },
  { bg: 'plaza', chars: ['lucia', 'marcela'], who: 'marcela',
    text: 'Yo coordino por Cultura. El edificio es de la comisión y es viejo: la entrada principal tiene tres escalones. La puerta lateral da a un patio de tierra con desnivel. Una obra definitiva hay que presentarla y pedirla.' },
  { bg: 'plaza', chars: ['nelida', 'lucia'], who: 'nelida',
    text: by('c1', {
      a: 'Llegué como pude. La vecina de enfrente me avisó que era hoy, pero del horario no entendí nada. ¿Ya empezó?',
      b: 'Llegué justo: mi nieta me leyó el mensaje. ¿Se entra por los escalones? Nadie dice nada de la entrada.',
      c: 'Escuché el audio tres veces, ¡qué buena idea! Y leí el pizarrón de la panadería. Llegué temprano y con ganas.' }) },
  { bg: 'plaza', chars: ['moncho', 'lucia'],
    text: 'Llega Moncho Acosta, mecánico de motos y fanático del chamamé, en su silla de ruedas, con una caja de herramientas sobre las piernas: se ofreció a ayudar a armar el escenario.' },
  { bg: 'plaza', chars: ['moncho', 'lucia'], who: 'moncho',
    text: by('c1', {
      a: 'El afiche no decía cómo era la entrada. Tuve que llamar a un amigo para preguntar. No es la primera vez.',
      b: 'Vi los datos en el mensaje, pero nada sobre la entrada. Vine a ver, como siempre.',
      c: 'En el mensaje decía que había escalones y que estaban viendo el recorrido. Eso se agradece. ¿Y cómo lo van a resolver?' }) },
  { bg: 'plaza', chars: ['moncho'], scene3d: { access: () => 'stairs' },
    text: 'Mirás la entrada. Tres escalones llevan a la puerta principal; la puerta lateral da a un patio de tierra. Si tu dispositivo muestra la vista 3D, podés girarla arrastrando o con los botones.',
    persp: { who: 'moncho', text: 'Los escalones no son un problema mío: son un problema del edificio. Mi silla va hasta donde el piso la deja. Lo que quiero es que me pregunten qué necesito, no que me levanten.' } },
  { id: 'c2', type: 'choice', bg: 'plaza', chars: ['moncho'], scene3d: { access: () => 'stairs' },
    prompt: 'La actividad empieza en media hora. ¿Cómo resolvés el acceso?',
    options: [
      { id: 'a', value: 0, label: 'Pedirle a cuatro voluntarios que lo suban en la silla por los escalones, con cuidado.',
        recap: 'Resolviste el acceso cargando a Moncho por los escalones. Entró, pero tenso, y quedó dependiendo de que haya voluntarios.' },
      { id: 'b', value: 1, label: 'Armar una rampa con los tablones y caballetes que hay en el depósito.',
        recap: 'Armaste una rampa de tablones muy empinada. Era un intento de ayuda, pero no era segura ni usable, y Moncho tuvo que dar un rodeo.' },
      { id: 'c', value: 2, label: 'Conversar con Moncho y con Marcela, probar juntos el recorrido posible hoy y dejar presentado el pedido de una rampa permanente.',
        recap: 'Diseñaste con Moncho una rampa larga y suave y se presentó el pedido de obra permanente. Moncho pudo entrar y quedarse.' } ] },
  { bg: 'plaza', chars: ['moncho', 'lucia'], when: (s) => s.d.c2 === 'a', scene3d: { access: acc },
    text: 'Cuatro voluntarios agarran la silla y la suben, escalón por escalón. Moncho se agarra fuerte de los apoyabrazos.' },
  { bg: 'plaza', chars: ['moncho', 'lucia'], when: (s) => s.d.c2 === 'a', who: 'moncho', scene3d: { access: acc },
    text: 'Te agradezco, pero que me carguen cuatro personas no es lo mío. Si se les resbala uno, me caigo yo. Y la próxima vez, ¿vuelvo a depender de que haya cuatro?' },
  { bg: 'plaza', chars: ['moncho', 'lucia'], when: (s) => s.d.c2 === 'b', scene3d: { access: acc },
    text: 'Los tablones quedan casi parados: la rampa mide poco más de un metro y la subida es una pared, sin barandas. Moncho prueba el primer tramo y retrocede.' },
  { bg: 'plaza', chars: ['moncho', 'lucia'], when: (s) => s.d.c2 === 'b', who: 'moncho', scene3d: { access: acc },
    text: 'Esto no es una rampa, es un tobogán. Si la pendiente me gana, me voy para atrás. Gracias por intentarlo, pero así no. Entro por el costado, como siempre.' },
  { bg: 'plaza', chars: ['moncho', 'marcela'], when: (s) => s.d.c2 === 'c', scene3d: { access: acc },
    text: 'Con Moncho medís el desnivel y prueban juntos. Él propone una rampa larga y suave, con barandas y bordes, que se arma con sus colegas del taller. Marcela se compromete a presentar el pedido de una rampa permanente, y se coloca un cartel con el recorrido.' },
  { bg: 'plaza', chars: ['moncho', 'marcela'], when: (s) => s.d.c2 === 'c', who: 'marcela', scene3d: { access: acc },
    text: 'La rampa de hoy resuelve esta jornada. La obra permanente la tiene que pedir y asegurar la comisión junto con el municipio, y yo me ocupo de acompañar el trámite.' },
  { type: 'explain', of: 'c2', bg: 'plaza', chars: ['moncho'], scene3d: { access: acc },
    info: {
      a: { barrier: 'Escalones en la entrada principal. La solución dependió de cargar a la persona: pone en riesgo su seguridad, su dignidad y su autonomía, y no cambia el acceso.',
        right: 'Artículo 9: acceso al entorno físico en igualdad de condiciones. Artículo 3: dignidad y autonomía.',
        refs: ['art9', 'art3'],
        action: 'Eliminar la barrera con una rampa adecuada o un recorrido accesible, definido con quien lo va a usar.' },
      b: { barrier: 'Una rampa improvisada, con pendiente excesiva y sin barandas: parece una solución, pero no es segura ni se puede usar de forma independiente.',
        right: 'Artículo 9: accesibilidad del entorno físico. Artículo 3: independencia y autonomía.',
        refs: ['art9', 'art3'],
        action: 'Diseñar con pendiente suave, superficie firme y bordes, consultando a quien la va a usar, y probarla antes de abrirla.' },
      c: { barrier: 'Los escalones de la entrada principal siguen ahí. Hoy hay un recorrido accesible, pero la obra definitiva todavía no existe.',
        right: 'Artículo 9: accesibilidad del entorno físico. Artículo 3: participación. Una solución puntual de un grupo no reemplaza la responsabilidad de las instituciones.',
        refs: ['art9', 'art3'],
        action: 'Resolver lo urgente con quienes lo usan y presentar el pedido de obra permanente ante la comisión y el municipio, con seguimiento.' } } },
];

/* ------------------------------------------------------------------ */
/* CAPÍTULO 3 · La conversación                                        */
/* ------------------------------------------------------------------ */
const ch3 = [
  { type: 'title', bg: 'puesto', text: 'Capítulo 3. La conversación' },
  { bg: 'puesto', chars: ['abril', 'tadeo'],
    text: 'Dentro del salón, bajo un toldo, hay un puesto de stickers: pájaros del monte, mates con alas y frases del barrio. Es de Abril Villalba, 19 años, estudiante de diseño. Abril se comunica con una tablet con pictogramas y voz sintetizada, y a veces con un tablero de cartón.' },
  { bg: 'puesto', chars: ['abril', 'tadeo'],
    text: 'Abril arma sus mensajes tocando símbolos y palabras. Lleva más tiempo que hablar, pero dice exactamente lo que quiere decir. Su hermano Tadeo está al lado, comiendo un chipá.' },
  { bg: 'puesto', chars: ['abril', 'moncho'], when: (s) => s.d.c2 === 'c',
    text: 'Moncho ya está en el puesto, eligiendo stickers para el taller. Entró por la rampa y se quedó: charla con Abril sobre pegatinas para cascos.' },
  { bg: 'puesto', chars: ['abril', 'moncho'], when: (s) => s.d.c2 === 'a',
    text: 'Moncho está al fondo, con los brazos cruzados. Saludó con un movimiento de cabeza y se quedó lejos del grupo.' },
  { bg: 'puesto', chars: ['abril', 'moncho'], when: (s) => s.d.c2 === 'b',
    text: 'Moncho entró por el rodeo largo y se quedó en la puerta, sin acercarse. Tenía otros planes para esta tarde y los cambió.' },
  { bg: 'puesto', chars: ['abril', 'tadeo'],
    text: 'Te toca coordinar con Abril el diseño de los stickers para el cierre de la jornada. Falta poco para la reunión del grupo y hay una agenda apretada.' },
  { bg: 'puesto', chars: ['abril', 'tadeo'], who: 'abril',
    text: 'Hola. Me llamo Abril. Tengo ideas para los stickers.' },
  { bg: 'puesto', chars: ['abril', 'tadeo'], who: 'tadeo',
    text: 'Si querés, te cuento yo. Ella tarda un poco, y yo ya sé lo que va a decir. Así vamos más rápido.',
    persp: { who: 'abril', text: 'Tadeo me quiere, pero no es mi voz. Cuando completan mis frases, termino diciendo algo que no dije. No necesito que hablen por mí. Necesito tiempo.' } },
  { id: 'c3', type: 'choice', bg: 'puesto', chars: ['abril', 'tadeo'],
    prompt: 'La reunión empieza pronto. ¿Cómo te comunicás con Abril?',
    options: [
      { id: 'a', value: 0, label: 'Aceptar la oferta de Tadeo: así es más rápido y la reunión empieza a horario.',
        recap: 'Hablaste con Tadeo en lugar de con Abril. Ganaste tiempo, pero ella guardó la tablet y quedó afuera de la decisión.' },
      { id: 'b', value: 1, label: 'Hablarle a Abril, pero con preguntas de sí o no y resúmenes, para no demorar.',
        recap: 'Le hablaste a Abril, pero con preguntas cerradas. La conversación fue rápida y sus mejores ideas quedaron sin decirse.' },
      { id: 'c', value: 2, label: 'Hablarle a Abril, preguntarle cómo prefiere conversar, esperar sin completar sus frases y proponer pausas más largas en la reunión.',
        recap: 'Le preguntaste a Abril cómo conversar y esperaste. Sus ideas cambiaron el cierre de la jornada y el grupo ajustó los tiempos.' } ] },
  { bg: 'puesto', chars: ['abril', 'tadeo'], when: (s) => s.d.c3 === 'a',
    text: 'Tadeo cuenta lo que cree que Abril quiere. Abril te mira, baja la vista y guarda la tablet en el bolso. Los stickers quedan decididos “por ella”.' },
  { bg: 'puesto', chars: ['abril', 'tadeo'], when: (s) => s.d.c3 === 'a', who: 'tadeo',
    text: 'Listo, resuelto. ¿Viste? Todo más rápido.' },
  { bg: 'puesto', chars: ['abril'], when: (s) => s.d.c3 === 'b',
    text: 'Abril contesta “sí”, “no”, “sí”. Vas rápido, pero la charla se vuelve un interrogatorio. Antes de que te vayas, ella toca la tablet de nuevo.' },
  { bg: 'puesto', chars: ['abril'], when: (s) => s.d.c3 === 'b', who: 'abril',
    text: 'Tengo más ideas.' },
  { bg: 'puesto', chars: ['abril'], when: (s) => s.d.c3 === 'b',
    text: 'Pero ya te estás yendo, y la reunión empieza.' },
  { bg: 'puesto', chars: ['abril'], when: (s) => s.d.c3 === 'c',
    text: 'Le preguntás a Abril cómo prefiere conversar. Ella elige la tablet para las ideas largas y el tablero para las respuestas cortas. Le decís que no hay apuro.' },
  { type: 'wait', bg: 'puesto', chars: ['abril'], when: (s) => s.d.c3 === 'c', cta: 'Esperar y escuchar',
    text: 'Abril está armando su mensaje con los símbolos. Pasa casi un minuto. Esperás sin completarle la frase y sin mirar el reloj. No hay tiempo límite: seguís cuando quieras.' },
  { bg: 'puesto', chars: ['abril'], when: (s) => s.d.c3 === 'c', who: 'abril',
    text: 'Quiero stickers de pájaros del monte. Que cada persona elija uno y lo pegue donde quiera. Es su manera de decir: estuve acá. Y quiero participar de la reunión, con tiempo para responder.' },
  { bg: 'puesto', chars: ['abril'], when: (s) => s.d.c3 === 'c',
    text: 'Proponés al grupo darle más tiempo a cada intervención y avisar las preguntas por escrito con anticipación. Eso le sirve a Abril, y a más gente.' },
  { type: 'explain', of: 'c3', bg: 'puesto', chars: ['abril'],
    info: {
      a: { barrier: 'Te dirigiste a la persona que acompaña y no a Abril: se priorizó la velocidad sobre su voz y su decisión.',
        right: 'Artículo 21: expresarse y opinar usando la comunicación que cada persona elija, incluida la comunicación aumentativa y alternativa. Artículo 3: autonomía y decisiones propias.',
        refs: ['art21', 'art3'],
        action: 'Dirigirte a ella, preguntarle cómo prefiere comunicarse y esperar sin interrumpir ni completar sus frases.' },
      b: { barrier: 'El tiempo de la conversación estaba pensado para el habla rápida. La comunicación aumentativa necesita más tiempo y preguntas abiertas.',
        right: 'Artículo 21: expresión y opinión por los medios que elige la persona. Artículo 3: participación.',
        refs: ['art21', 'art3'],
        action: 'Dar tiempo, preguntar con opciones abiertas y adaptar la agenda a esa duración.' },
      c: { barrier: 'El ritmo de las reuniones, medido para quien habla rápido, deja afuera a quien necesita más tiempo para expresarse.',
        right: 'Artículo 21: comunicación a elección de la persona. Artículo 3: autonomía, participación e inclusión.',
        refs: ['art21', 'art3'],
        action: 'Mantener pausas más largas y anticipar las preguntas como práctica de todo el grupo.' } } },
];

/* ------------------------------------------------------------------ */
/* CAPÍTULO 4 · La actividad                                           */
/* ------------------------------------------------------------------ */
const ch4 = [
  { type: 'title', bg: 'salon', text: 'Capítulo 4. La actividad' },
  { bg: 'salon', chars: ['lucia', 'gabriel'],
    text: 'La actividad central ya está lista. El salón tiene un escenario con dos escalones y un micrófono con pie. En la pared, el cartel: “Muro de voces. Pasá al micrófono, un minuto, y contá qué querés de tu barrio.”' },
  { bg: 'salon', chars: ['lucia', 'gabriel'], who: 'lucia',
    text: 'Es simple: todos hacen lo mismo y nadie queda afuera. Lo hicimos así el año pasado y salió bárbaro.' },
  { bg: 'salon', chars: ['gabriel', 'nelida'],
    text: 'Gabriel Sosa, 24 años, toca el bombo en la murga y se comunica en lengua de señas argentina, la LSA. Hoy no hay intérprete. Nélida, en cambio, habla por los codos, pero no puede leer los carteles.' },
  { bg: 'salon', chars: ['gabriel', 'nelida'], who: 'gabriel',
    text: 'Gabriel dice en lengua de señas, con la traducción en pantalla: “Para mí el micrófono es sonido. Si no hay quien interprete, no me entienden. Pero tengo mucho para contar.”' },
  { bg: 'salon', chars: ['abril', 'tadeo'], who: 'abril',
    text: by('c3', {
      a: 'Quiero decir lo mío. Pero mejor que hable Tadeo. Siempre es lo más fácil. Para ellos.',
      b: 'Un minuto con micrófono no me alcanza para armar una idea. Mi tablet necesita más tiempo.',
      c: 'Si me dan tiempo, quiero participar. Prefiero escribir mi frase antes y que salga por la tablet. Sin apuro.' }) },
  { bg: 'salon', chars: ['moncho', 'lucia'], who: 'moncho',
    text: by('c2', {
      a: 'Subir al escenario cargado de nuevo no es lo mío. Prefiero contar mi historia desde abajo. Pero la consigna dice micrófono y escenario.',
      b: 'Por esa rampa no subo, y menos al escenario. Prefiero mirar desde acá, a menos que alguien me diga cómo hacerlo.',
      c: 'Con la rampa llegué hasta acá y eso cambia todo. Subir al escenario no me interesa. ¿Se puede hablar desde abajo, con el micrófono en la mano?' }),
    persp: { who: 'nelida', text: 'Yo hablo, hijo, no tengo problema. Pero si el programa está en carteles chiquitos, no sé cuándo me toca. Más que micrófono, necesito que alguien me avise o que se anuncie en voz alta.' } },
  { id: 'c4', type: 'choice', bg: 'salon', chars: ['lucia', 'gabriel', 'abril'],
    prompt: 'El evento está por empezar. ¿Qué hacés con la consigna?',
    options: [
      { id: 'a', value: 0, label: 'Mantener la consigna: si todos hacen lo mismo, es lo más justo.',
        recap: 'Mantuviste el micrófono y el minuto para todos. Abril, Gabriel y Moncho quedaron sin poder participar de verdad.' },
      { id: 'b', value: 1, label: 'Mantener el micrófono, pero permitir que otra persona lea el texto de quien lo prefiera, o que pase “después” quien lo necesite.',
        recap: 'Agregaste excepciones sobre el mismo formato. Participaron más personas, pero la forma principal siguió siendo una sola.' },
      { id: 'c', value: 2, label: 'Cambiar la consigna junto con quienes participan: contar qué querés de tu barrio con voz, escritura, dibujo, pictogramas o lengua de señas, y que cada quien elija cómo y cuándo.',
        recap: 'Abriste la consigna a varias formas de expresarse y cada persona eligió la suya. El muro quedó con voces, dibujos, pictogramas y señas.' } ] },
  { bg: 'salon', chars: ['lucia', 'nelida'], when: (s) => s.d.c4 === 'a',
    text: 'Los primeros cuatro pasan sin problema. Después, Abril se queda en su silla y Gabriel sale del salón. Nélida habla, pero no sabe quién sigue. El muro de voces queda lleno de voces parecidas.' },
  { bg: 'salon', chars: ['lucia'], when: (s) => s.d.c4 === 'a', who: 'lucia',
    text: 'Qué raro, ¿por qué se fueron? El formato era igual para todos.' },
  { bg: 'salon', chars: ['abril', 'tadeo'], when: (s) => s.d.c4 === 'b',
    text: 'Tadeo lee en el micrófono una frase de Abril. Ella asiente, pero se nota que no es lo que quería decir. Gabriel escribe su texto para que otra persona lo lea, pero su lengua sigue sin estar en el escenario.' },
  { bg: 'salon', chars: ['lucia', 'gabriel'], when: (s) => s.d.c4 === 'b', who: 'lucia',
    text: 'Al menos pudieron pasar. ¿No? Aunque no quedaron muy contentos.' },
  { bg: 'salon', chars: ['abril', 'gabriel'], when: (s) => s.d.c4 === 'c',
    text: 'El muro se llena. Abril presenta con su tablet una frase que armó con tiempo. Gabriel cuenta su historia en lengua de señas, con la traducción escrita en una pizarra grande. Nélida cuenta una anécdota en voz alta, y alguien anuncia a quién le toca.' },
  { bg: 'salon', chars: ['moncho', 'abril'], when: (s) => s.d.c4 === 'c',
    text: by('c2', {
      a: 'Moncho habla desde abajo, con el micrófono en la mano. Dice que gracias a este formato pudo contar su historia sin pasar por los escalones.',
      b: 'Moncho dibuja un mapa del barrio en el muro, con las calles que se pueden recorrer en silla. Es su manera de contarlo.',
      c: 'Moncho cuenta, desde abajo, cómo armaron la rampa. “Entre todos, y preguntando”, dice.' }) },
  { bg: 'salon', chars: ['gabriel', 'abril'], when: (s) => s.d.c4 === 'c', who: 'gabriel',
    text: 'En la pantalla: “Es la primera vez que pienso la consigna en mi lengua.” Y más abajo, un dibujo de un bombo.' },
  { type: 'explain', of: 'c4', bg: 'salon', chars: ['abril', 'gabriel'],
    info: {
      a: { barrier: 'Una sola forma de participar —hablar al micrófono en un minuto— presentada como igualdad. Tratar igual a personas en condiciones distintas no garantiza la participación.',
        right: 'Artículo 30: participar en la vida cultural y recreativa en igualdad. Artículo 21: elegir cómo comunicarse (lengua de señas, comunicación aumentativa).',
        refs: ['art30', 'art21'],
        action: 'Ofrecer varias formas de expresarse y participar, con tiempos distintos, desde el diseño de la actividad.' },
      b: { barrier: 'Se admitieron excepciones, pero la forma principal siguió siendo una sola, y quienes la necesitaban tenían que pedir el ajuste.',
        right: 'Artículo 30: participación cultural. Artículo 3: autonomía, incluida la libertad de decidir cómo participar.',
        refs: ['art30', 'art3'],
        action: 'Diseñar la consigna con varios modos desde el principio y dejar que cada persona elija el suyo.' },
      c: { barrier: 'La consigna original exigía una sola forma de expresión. Al abrirla, aparecieron otras: la falta de intérprete de LSA sigue siendo una barrera.',
        right: 'Artículo 30: participación en la vida cultural. Artículo 21: lengua de señas y comunicación a elección. Artículo 9: asistencia de intérpretes.',
        refs: ['art30', 'art21', 'art9'],
        action: 'Seguir ampliando: pedir intérprete de LSA, subtítulos y materiales accesibles. Es una responsabilidad de la organización y de instituciones, no un detalle de buena voluntad.' } } },
];

/* ------------------------------------------------------------------ */
/* CAPÍTULO 5 · Las decisiones                                         */
/* ------------------------------------------------------------------ */
const monchoLast = (s) => ({
  a: 'La vez pasada eligieron por nosotros y lo comprado terminó en el depósito. Preguntar sale gratis.',
  b: 'La rampa de tablones también se hizo “para nosotros”, y no se pudo usar. Si me preguntaban, les decía cómo.',
  c: 'Cuando nos sentamos juntos, la rampa funcionó. Eso es diseñar con las personas, no para las personas.' }[s.d.c2]);

const ch5 = [
  { type: 'title', bg: 'cierre', text: 'Capítulo 5. Las decisiones' },
  { bg: 'cierre', chars: ['marcela', 'lucia'],
    text: 'La jornada termina con la tarde cayendo. Marcela trae una noticia: la comisión consiguió un pequeño fondo para apoyos de accesibilidad. Hay que decidir qué comprar y cómo organizarlo, antes de la próxima actividad.' },
  { bg: 'cierre', chars: ['marcela', 'lucia'], who: 'marcela',
    text: 'Tengo una lista: una rampa portátil, tablets con pictogramas, un intérprete de lengua de señas para dos jornadas, subtítulos en pantalla, carteles en letra grande y con Braille, y un lugar de descanso con sombra. No alcanza para todo. ¿Cómo lo decidimos?' },
  { bg: 'cierre', chars: ['lucia', 'marcela'], who: 'lucia',
    text: 'Yo creo que ya sabemos qué hace falta: rampa y tablets. Lo básico. Si consultamos a todos, vamos a tardar un mes.' },
  { bg: 'cierre', chars: ['moncho', 'abril', 'gabriel', 'nelida'],
    text: 'Del otro lado de la plaza están Moncho, Abril, Gabriel y Nélida, guardando sillas. Ninguno fue invitado a decidir. Todos están a diez metros.',
    persp: { who: 'moncho', text: monchoLast } },
  { id: 'c5', type: 'choice', bg: 'cierre', chars: ['lucia', 'marcela'],
    prompt: 'Hay que elegir apoyos para las próximas jornadas. ¿Cómo decidís?',
    options: [
      { id: 'a', value: 0, label: 'Decidir entre quienes organizamos, con lo que ya sabemos, y comprar enseguida.',
        recap: 'Compraste apoyos entre el grupo organizador. Algunos no coincidían con lo que las personas usan, y nadie había pensado en el intérprete.' },
      { id: 'b', value: 1, label: 'Pedirle a una especialista que arme la lista y comprar lo que recomiende, para después invitar a usarlo.',
        recap: 'Compraste apoyos recomendados por una especialista. Eran útiles, pero las personas que los iban a usar no decidieron cómo.' },
      { id: 'c', value: 2, label: 'Convocar a Moncho, Abril, Gabriel, Nélida y Marcela para decidir juntos qué apoyos, cómo y quién se encarga.',
        recap: 'Decidiste con Moncho, Abril, Gabriel, Nélida y Marcela qué apoyos, cómo usarlos y quién se encarga. Quedó un plan con responsables y fechas.' } ] },
  { bg: 'cierre', chars: ['lucia', 'abril'], when: (s) => s.d.c5 === 'a',
    text: 'Comprás una rampa portátil y dos tablets con pictogramas. Cuando se las mostrás, Abril ya usa su propia tablet, con su vocabulario cargado; la nueva tiene símbolos que ella no usa. La rampa portátil no entra al escenario. Gabriel pregunta por el intérprete, y nadie lo había pensado.' },
  { bg: 'cierre', chars: ['lucia', 'moncho'], when: (s) => s.d.c5 === 'a', who: 'lucia',
    text: 'Pero ¿no era justo lo que hacía falta?' },
  { bg: 'cierre', chars: ['lucia', 'abril'], when: (s) => s.d.c5 === 'b',
    text: 'La especialista arma una lista clara. Se compran apoyos útiles: rampa, carteles, subtítulos. Funciona para casi todo. Pero la tablet no se adapta al sistema de símbolos de Abril, y los subtítulos no coinciden con cómo prefiere Gabriel. Nadie les preguntó cómo querían usarlos.' },
  { bg: 'cierre', chars: ['marcela', 'lucia'], when: (s) => s.d.c5 === 'b', who: 'marcela',
    text: 'Se compró lo correcto en teoría. Falta saber si les sirve a quienes lo van a usar.' },
  { bg: 'cierre', chars: ['moncho', 'abril', 'gabriel', 'nelida'], when: (s) => s.d.c5 === 'c',
    text: 'Se juntan alrededor de una mesa. Abril trae su vocabulario de símbolos y pide sumar palabras del barrio. Gabriel pide intérprete en las jornadas grandes y subtítulos en las chicas. Nélida pide carteles con letra grande y alto contraste, y avisos en voz alta. Moncho propone medir la rampa con su cinta y probarla.' },
  { bg: 'cierre', chars: ['marcela', 'lucia'], when: (s) => s.d.c5 === 'c', who: 'marcela',
    text: 'Anoto qué le corresponde a Cultura, qué a la comisión y qué a las personas que quieran sumarse, con fecha. Así no queda todo en la buena voluntad de un grupo.' },
  { bg: 'cierre', chars: ['moncho'], scene3d: { access: (s) => (s.d.c5 === 'c' ? 'plan' : acc(s)), extras: (s) => ({ a: ['signs'], b: ['signs', 'shade'], c: ['signs', 'shade', 'interp'] }[s.d.c5] || []) },
    text: (s) => ({
      a: 'La plaza queda así: carteles nuevos. Pero la entrada sigue como estaba en el capítulo dos, y no hay lugar para intérprete ni descanso.',
      b: 'La plaza queda así: carteles nuevos y un lugar con sombra. La entrada sigue como estaba, y no hay lugar para intérprete.',
      c: 'La plaza queda así: rampa larga con barandas, carteles de alto contraste, un lugar con sombra y un espacio para intérprete. Todo elegido por quienes lo van a usar.' }[s.d.c5]) },
  { type: 'explain', of: 'c5', bg: 'cierre', chars: ['lucia', 'marcela'],
    info: {
      a: { barrier: 'Se eligieron apoyos sin consultar a quienes los iban a usar: pueden no servir, o reemplazar decisiones que les corresponden.',
        right: 'Artículo 3: autonomía y participación plena y efectiva. Artículo 9: accesibilidad, incluidos apoyos como intérpretes. Artículo 4.3: consulta a las personas con discapacidad.',
        refs: ['art3', 'art9', 'art4'],
        action: 'Preguntar qué apoyos ya usan y cómo, y definir responsables concretos.' },
      b: { barrier: 'Se contó con una especialista, pero las personas que usan los apoyos no participaron en la decisión.',
        right: 'Artículo 3: autonomía y participación. Artículo 9: accesibilidad. Artículo 4.3: consulta estrecha con las personas con discapacidad.',
        refs: ['art3', 'art9', 'art4'],
        action: 'Sumar a la especialista como una voz más, y que las decisiones finales las tomen quienes van a usar los apoyos.' },
      c: { barrier: 'La barrera era decidir sobre las personas sin ellas. Siguen pendientes las obras y los servicios que dependen de instituciones.',
        right: 'Artículo 3, artículo 9 y artículo 4.3: participación, accesibilidad y consulta. La responsabilidad institucional no se reemplaza con decisiones individuales.',
        refs: ['art3', 'art9', 'art4'],
        action: 'Sostener el espacio de decisión compartido, con responsables y fechas, y exigir lo que corresponde a las instituciones.' } } },
  { bg: 'cierre', chars: [],
    text: 'El sol se pone sobre la plaza. La jornada terminó, pero las decisiones que tomaste siguen.' },
  { type: 'ending', bg: 'cierre', chars: [] },
];

export const CHAPTERS = [
  { n: 1, title: 'La invitación', beats: ch1 },
  { n: 2, title: 'La llegada', beats: ch2 },
  { n: 3, title: 'La conversación', beats: ch3 },
  { n: 4, title: 'La actividad', beats: ch4 },
  { n: 5, title: 'Las decisiones', beats: ch5 },
];

export const ENDINGS = {
  1: { title: 'Final 1: Persisten barreras',
    summary: 'La jornada terminó con la mayoría de las barreras en su lugar. Algunas personas llegaron y otras se quedaron afuera o se fueron. No fue por falta de ganas: la información, el acceso y la actividad se pensaron para una sola manera de participar.',
    note: 'Las barreras que permanecen se pueden cambiar. Cambiarlas no depende de las personas que las enfrentan.' },
  2: { title: 'Final 2: Hay apoyos, pero falta escuchar',
    summary: 'En tu recorrido aparecieron apoyos y ajustes, y eso abrió algunas puertas. Pero varias veces se decidió por las personas y no con ellas, y los apoyos pueden no servir o no respetar lo que cada una decide.',
    note: 'Ofrecer apoyos es un paso. Consultar y respetar las decisiones es lo que los vuelve útiles.' },
  3: { title: 'Final 3: Planificamos con las personas',
    summary: 'La jornada se planificó con accesibilidad y con la participación de las personas involucradas. No hizo desaparecer todas las barreras, sobre todo las que dependen de obras y de instituciones, pero dejó un camino de trabajo compartido, con responsables y fechas.',
    note: 'Esto no te define como mejor o peor persona: muestra cómo se organiza la participación cuando se consulta.' },
};

export function endingFor(d) {
  let sum = 0;
  CHAPTERS.forEach((c, i) => {
    const ch = c.beats.find((b) => b.type === 'choice');
    const o = ch && ch.options.find((x) => x.id === d['c' + (i + 1)]);
    if (o) sum += o.value;
  });
  return sum <= 3 ? 1 : sum <= 7 ? 2 : 3;
}

export const SOURCES = [
  { t: 'Convención sobre los Derechos de las Personas con Discapacidad — texto en español (Naciones Unidas)', u: 'https://www.un.org/disabilities/documents/convention/convoptprot-s.pdf' },
  { t: 'Convención sobre los Derechos de las Personas con Discapacidad — Naciones Unidas, Departamento de Asuntos Económicos y Sociales', u: 'https://www.un.org/development/desa/disabilities/convention-on-the-rights-of-persons-with-disabilities.html' },
  { t: 'Convención sobre los Derechos de las Personas con Discapacidad — Oficina del Alto Comisionado de Naciones Unidas para los Derechos Humanos', u: 'https://www.ohchr.org/es/instruments-mechanisms/instruments/convention-rights-persons-disabilities' },
  { t: 'Ley 26.378 (Argentina): aprueba la Convención — Información Legislativa y Documental', u: 'https://www.argentina.gob.ar/normativa/nacional/ley-26378-141317' },
];
