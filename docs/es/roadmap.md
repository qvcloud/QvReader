# Hoja de Ruta

Una vista transparente de lo que QvReader está planificando, lo que ya ha entregado y lo que evita deliberadamente.
Solo las características que superan estrictas puertas de especificación y demuestran no perjudicar la velocidad de inicio, el tamaño binario, la fidelidad de Markdown o la experiencia de lectura central se integran en el desarrollo.

---

## Metas Alcanzadas (v0.1.0 ~ v0.1.4)

- [x] **Rendimiento Extremo y Optimización de Paquete (v0.1.4)**: Binario nativo de ~5MB, bundle de entrada JS de 614KB, fuentes matemáticas 100% WOFF2, inicio en frío <50 ms, desplazamiento fluido a 60 FPS en documentos de más de 50.000 líneas.
- [x] **Motor de Diseño Fluido Adaptativo a la Pantalla (v0.1.3)**: Anchura dinámica (896px–1280px) que elimina márgenes vacíos en pantallas anchas, con 3 modos (`adaptativo`, `estándar`, `ancho completo`).
- [x] **Modal Interactivo de Zoom para Diagramas Mermaid (v0.1.3)**: Renderizado nativo de diagramas de flujo, secuencia y arquitectura con modal de pantalla completa activable por doble clic (arrastre y ampliación).
- [x] **Canal de Exportación en 4 Vías (v0.1.3)**: Impresión nativa económica en tinta, PDF vectorial de alta fidelidad, imagen 2x Retina con copia al portapapeles y HTML autónomo sin conexión.
- [x] **Contrato de Interacción Mínimo (v0.1.0)**: Lectura inmediata al hacer doble clic en `.md`, `Esc` para cerrar, `F2` para editar en el lugar, `F3` para vista previa dividida sincronizada.
- [x] **Fidelidad de Bytes Originales y Guardado Seguro (v0.1.0)**: Preservación de saltos de línea LF/CRLF y codificación UTF-8, detección de conflictos externos y protección contra pérdida de cambios no guardados.
- [x] **Localización Completa en 6 Idiomas (v0.1.0 ~ v0.1.3)**: Simetría total en Español, English, 简体中文, 日本語, 한국어 y Português (Brasil).

---

## Candidatos Futuros (v0.1.5+)

- 🔄 **Integración de Firma de Código y Notarización**: Firma oficial de Apple Developer ID y notarización (eliminando avisos de Gatekeeper) y certificados de firma de código abierto para Windows con SignPath.
- 🔄 **Notificaciones de Actualización Automática**: Verificación silenciosa en el inicio contra GitHub Releases, mostrando notas de versión de forma elegante.
- 🔄 **Mejoras en Bloques de Código**: Alternancia de números de línea, animación de confirmación de copia y plegado de bloques extensos de código.
- 🔄 **Paquetes para el Ecosistema Linux**: Expansión a canales oficiales de distribución Flatpak y Snap.

---

## Características Excluidas Deliberadamente

- Sincronización obligatoria en la nube o integración remota con Git (prioridad Local-First absoluta).
- Suscripciones mensuales recurrentes (compra única de por vida).
- Publicación de blogs o integración con CMS.
- Herramientas pesadas de IDE o gráficos de conocimiento complejos.
- Publicidad intrusiva o avisos visualmente molestos durante la lectura.

Los debates de funciones se desarrollan abiertamente en el [rastreador de problemas de GitHub](https://github.com/qvcloud/QvReader/issues).
