# Proceso de versión

Cómo se compilan los instaladores y llegan a los **GitHub Releases** de este repositorio.

## Arquitectura (dos repositorios)

| Repositorio | Visibilidad | Rol |
|---|---|---|
| **Repositorio de desarrollo privado** (`qvcloud/markdown-viewer`) | privado | Guarda el código fuente real, el frontend, el backend Rust y el **workflow de compilación CI** (`build-desktop.yml`). Los binarios solo se pueden compilar aquí — es donde vive el código. |
| **Este repositorio** (`qvcloud/QvReader`) | público | **Hogar de la comunidad + versiones.** README, docs, LICENSE, changelog y los instaladores descargables publicados bajo Releases. |

¿Por qué dos repositorios? Compilar una app de escritorio necesita el código fuente y la cadena de
compilación. El repositorio público pretende ser la cara de la comunidad — pero el código aún no es
abierto. Así que las compilaciones ocurren en el repositorio privado, y los instaladores terminados se
envían a los Releases del repositorio público.

## Cómo ocurre una versión

1. Un mantenedor envía una tag de versión `v*` al **repositorio de desarrollo privado**.
2. `build-desktop.yml` ejecuta tres trabajos paralelos (macOS universal / Windows / Linux) y compila los instaladores.
3. Un trabajo final `create-release` descarga todos los artefactos y los publica como un GitHub Release en
   **`qvcloud/QvReader`** mediante `softprops/action-gh-release`.
   - Requiere el secreto de Actions `QVREADER_RELEASE_TOKEN` en el repositorio privado — un PAT de
     granularidad fina con **Contents: read/write** en `qvcloud/QvReader`.
   - Si ese secreto no está definido, la versión recae en el repositorio privado (para que el workflow nunca falle).

## Publicar este contenido de la comunidad

Los archivos de este repositorio se envían directamente a `qvcloud/QvReader`:

```bash
./scripts/publish.sh
```

El script inicializa este directorio como su propio repositorio git (remote =
`git@github.com:qvcloud/QvReader.git`), hace commit y envía a `main`.

## Versionado

- Sigue [SemVer](https://semver.org/).
- Los nombres de tag son `v<mayor>.<menor>.<parche>` (por ejemplo, `v1.0.1`).
- Actualiza el `CHANGELOG.md` antes de crear la tag.

## Lista de verificación de la versión

- [ ] `CHANGELOG.md` actualizado.
- [ ] Versión actualizada en el manifiesto de la app.
- [ ] Tag `v*` enviada al repositorio de desarrollo privado.
- [ ] Confirma que la Versión pública en `qvcloud/QvReader` lleva los instaladores de las tres plataformas.
- [ ] Comprueba que los enlaces de descarga del README apunten a la nueva tag.
