# Cobalt Urbana

Landing estática ARS → USDT. Conserva el símbolo original de la marca y el Meta Pixel `1556371032264770` con un único `PageView` por carga.

## Vista previa local

Requiere Node.js, sin instalar dependencias:

```sh
node scripts/preview.mjs
```

Abrir http://127.0.0.1:4173. Para finalizar el servidor, presionar Ctrl+C.

## Publicación en Vercel

Proyecto estático, sin build ni dependencias. Publicar la raíz del repositorio, incluyendo `index.html`, `styles.css`, `script.js`, `assets/hero-city.webp` y los archivos de marca existentes. El servidor de vista previa no se usa en producción.

## Contenido y contacto

- Contacto confirmado: https://calendly.com/gestionloly/nueva-reunion. No se inventó un WhatsApp ni un correo.
- Se conserva `#agendar` como enlace a la sección de contacto.
- No hay una cotización automática ni un formulario que aparente enviar solicitudes: el visitante elige una reunión en Calendly.
- Faltan datos verificables de la empresa/prestador, horarios, comisiones, mínimos y plazos. No se publicaron cifras, licencias ni garantías sin acreditar. Las respuestas indican qué debe acordarse con el equipo. Reemplazarlas por condiciones concretas cuando el negocio las confirme.
- La imagen de ciudad/notebook es ilustrativa; no representa oficinas o activos de la empresa.
- El video anterior se conserva en el repositorio pero ya no se descarga en la nueva página.

## Imagen principal

Generada con la herramienta integrada de imágenes y optimizada a WebP (aprox. 130 KB). Archivo: `assets/hero-city.webp`.

Brief utilizado: escena fotográfica nocturna de una ciudad financiera azul oscuro junto al agua, edificios iluminados hacia la derecha, notebook abierta sin marca en la esquina inferior derecha, espacio negativo oscuro a la izquierda para texto HTML, reflejos azules y acentos cian. Sin textos, logos, símbolos monetarios ni monedas. Las monedas y la flecha se implementaron con CSS/SVG, no dentro de la imagen.
