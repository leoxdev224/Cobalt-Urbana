# Cobalt Urbana

Landing estática ARS → USDT. Conserva el símbolo original de la marca y usa el Meta Pixel `1743600580129283` con un único `PageView` por carga.

Todos los botones de contacto abren https://t.me/Cobaltcambios y envían un evento `Contact` por clic, con `contact_channel: telegram`. El CTA principal de la sección de contacto conserva `#cta`. El recorrido es único: Telegram → conversación con el equipo → reunión. Calendly se comparte manualmente dentro del chat; ya no es una alternativa directa desde la landing. El botón blanco final también abre Telegram. Los enlaces de navegación a `#contacto` solo desplazan la página y no registran contactos. `Contact` mide el clic: no confirma un mensaje enviado ni una reunión reservada. Si el Pixel no está disponible, los enlaces siguen funcionando.

Verificación local sin enviar eventos a Meta: `node --test tests/meta-pixel.test.cjs`.

## Vista previa local

Requiere Node.js, sin instalar dependencias:

```sh
node scripts/preview.mjs
```

Abrir http://127.0.0.1:4173. Para finalizar el servidor, presionar Ctrl+C.

## Publicación en Vercel

Proyecto estático, sin build ni dependencias. Publicar la raíz del repositorio, incluyendo `index.html`, `styles.css`, `script.js`, `assets/hero-city.webp` y los archivos de marca existentes. El servidor de vista previa no se usa en producción.

## Contenido y contacto

- Telegram informado por el usuario: https://t.me/Cobaltcambios (@Cobaltcambios). Abre una conversación directa; la persona debe enviar su mensaje. No se integró un bot ni una base de datos.
- El equipo comparte https://calendly.com/gestionloly/nueva-reunion dentro de Telegram para coordinar la reunión, según el recorrido confirmado por el usuario. La landing no envía mensajes ni entrega automáticamente el enlace de Calendly.
- Se conserva `#agendar` como enlace a la sección de contacto.
- No hay una cotización automática ni un formulario que aparente enviar solicitudes: el visitante inicia el contacto en Telegram y coordina la reunión con el equipo.
- Faltan datos verificables de la empresa/prestador, horarios, comisiones, mínimos y plazos. No se publicaron cifras, licencias ni garantías sin acreditar. Las respuestas indican qué debe acordarse con el equipo. Reemplazarlas por condiciones concretas cuando el negocio las confirme.
- La imagen de ciudad/notebook es ilustrativa; no representa oficinas o activos de la empresa.
- El video anterior se conserva en el repositorio pero ya no se descarga en la nueva página.

## Imagen principal

Generada con la herramienta integrada de imágenes y optimizada a WebP (aprox. 130 KB). Archivo: `assets/hero-city.webp`.

Brief utilizado: escena fotográfica nocturna de una ciudad financiera azul oscuro junto al agua, edificios iluminados hacia la derecha, notebook abierta sin marca en la esquina inferior derecha, espacio negativo oscuro a la izquierda para texto HTML, reflejos azules y acentos cian. Sin textos, logos, símbolos monetarios ni monedas. Las monedas y la flecha se implementaron con CSS/SVG, no dentro de la imagen.
