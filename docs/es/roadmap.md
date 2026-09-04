# Hoja de ruta

Una visión transparente de lo que QvReader planea y de lo que deliberadamente no está construyendo.
Los elementos entran en desarrollo solo después de estar especificados y de demostrar que no dañan la
velocidad de inicio, el tamaño del binario, la fidelidad del Markdown o la experiencia central de lectura.

## Candidatos de alta prioridad

- **Metas de rendimiento para documentos grandes** — objetivos cuantificados de carga y desplazamiento,
  no solo "se abre".
- **Actualización en vivo de archivos externos** — cuando otro editor / un agente de IA reescribe el archivo,
  actualiza sin pérdida de datos.
- **Resaltado de vínculo de bloque fuente ↔ vista previa** — más fino que el desplazamiento sincronizado simple.
- **Pulido nativo de macOS** — UX de asociación de archivos, menús, atajos por plataforma.

## Secundarios / evaluados después

- Exportación nativa en **PDF**, exportación **HTML** de archivo único.
- Diagramas **Mermaid** y **matemáticas** más ricas como extensiones opcionales de carga diferida.
- Compatibilidad con **Linux** — solo cuando las funciones centrales estén estables y exista capacidad de prueba.
- Compilación de Windows portátil ("verde").
- Foco en tablas con reconocimiento de Markdown / lectura a pantalla completa.

## Explícitamente fuera de alcance

La carta fija el límite. QvReader no perseguirá "ser todo":

- Sincronización en la nube / unidades integradas / sincronización con hosting Git.
- Publicación de blogs o CMS.
- Cuentas, pagos, activación, licenciamiento o telemetría que lea tu contenido.
- Establecer silenciosamente asociaciones de archivo predeterminadas.
- Carreras de paridad de funciones con Typora / Obsidian / IDEs completos.

Cada elemento de la hoja de ruta está limitado por las preguntas de revisión del proceso de especificación:
¿Sirve a un escenario real y frecuente? ¿Preserva "abrir rápido, leer bien, no interrumpir"? ¿Cuál es su
impacto medible en tamaño/inicio/memoria? ¿Toca el formato fuente? ¿Cuál es la interacción equivalente por
plataforma? ¿Implica red/cuenta/pago/privacidad?

El trabajo candidato se discute en el [rastreador de issues](https://github.com/qvcloud/QvReader/issues).
