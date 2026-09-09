# Verificación de reservas — 9 de septiembre de 2026

Integración local de `https://cal.com/bpmtechstudio/30min`, con duración de 30
minutos, Cal Video y disponibilidad administrada en Cal.com. No se ha publicado
la web ni creado una reserva durante las pruebas.

## Resultados

- ESLint, TypeScript, las 40 pruebas existentes y el build de producción pasan
  con Node 24. El build incluye la configuración final del calendario compacto.
- Navegador Edge: Contacto y cierre de ficha de proyecto muestran el enlace
  correcto. La agenda real carga, permite elegir una fecha y muestra horas.
- Vistas de 390 y 1440 píxeles sin desbordamiento horizontal. Zona horaria
  visible y calendario revisado visualmente en móvil y escritorio.
- Sin solicitudes a Cal.com ni iframe antes de abrir. El cierre retira el
  iframe, devuelve el foco al enlace y conserva el borrador del formulario.
  La reapertura funciona sin duplicar el iframe.
- Sin JavaScript se conserva el enlace directo. Al bloquear el proveedor, se
  muestra la alternativa externa tras el plazo de espera y se puede cerrar.
- El evento de apertura conserva únicamente categorías permitidas, incluyendo
  la referencia del caso; no registra datos de reserva ni una cita confirmada.

## Límites comprobados

Escape cierra el diálogo cuando el foco está en sus controles propios. Con el
foco dentro del iframe externo, Cal.com no propaga esa tecla: el botón visible
«Cerrar agenda» sigue disponible. No se ha usado el evento privado
`__closeIframe`, que el proveedor excluye de su API pública de integraciones.

Las pruebas se detienen antes de confirmar una cita. No acreditan entrega de
invitaciones, avisos, asistencia ni sincronización con otros calendarios. El
formulario de contacto mantiene pendiente su configuración de Resend.

Capturas y resultados de esta comprobación se guardan en
`%TEMP%\bpm-local-dev\booking-results.json` y los archivos `booking-*.png`.
Las mediciones Lighthouse del informe anterior corresponden a la iteración
anterior y no se han repetido para esta integración.
