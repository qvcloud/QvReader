# Processo de release

Como os instaladores são compilados e chegam aos **GitHub Releases** deste repositório.

## Arquitetura (dois repositórios)

| Repositório | Visibilidade | Papel |
|---|---|---|
| **Repositório de desenvolvimento privado** (`qvcloud/markdown-viewer`) | privado | Guarda o código-fonte real, frontend, backend Rust e o **workflow de compilação CI** (`build-desktop.yml`). Os binários só podem ser compilados aqui — é onde o código vive. |
| **Este repositório** (`qvcloud/QvReader`) | público | **Casa de comunidade + release.** README, docs, LICENSE, changelog e os instaladores baixáveis publicados sob Releases. |

Por que dois repositórios? Compilar um app desktop precisa do código-fonte e da toolchain de compilação.
O repositório público deve ser a cara da comunidade — mas o código ainda não é aberto. Então as compilações
acontecem no repositório privado, e os instaladores prontos são enviados aos Releases do repositório público.

## Como um release acontece

1. Um mantenedor envia uma tag de versão `v*` ao **repositório de desenvolvimento privado**.
2. `build-desktop.yml` executa três jobs paralelos (macOS universal / Windows / Linux) e compila os instaladores.
3. Um job final `create-release` baixa todos os artefatos e os publica como um GitHub Release em
   **`qvcloud/QvReader`** via `softprops/action-gh-release`.
   - Requer o secret de Actions `QVREADER_RELEASE_TOKEN` no repositório privado — um PAT de granularidade
     fina com **Contents: read/write** em `qvcloud/QvReader`.
   - Se esse secret não estiver definido, o release recai no repositório privado (para o workflow nunca falhar).

## Publicar este conteúdo de comunidade

Os arquivos neste repositório são enviados diretamente a `qvcloud/QvReader`:

```bash
./scripts/publish.sh
```

O script inicializa este diretório como seu próprio repositório git (remote =
`git@github.com:qvcloud/QvReader.git`), faz commit e envia para `main`.

## Versionamento

- Siga o [SemVer](https://semver.org/).
- Os nomes de tag são `v<maior>.<menor>.<patch>` (por exemplo, `v1.0.1`).
- Atualize o `CHANGELOG.md` antes de criar a tag.

## Checklist de release

- [ ] `CHANGELOG.md` atualizado.
- [ ] Versão atualizada no manifesto do app.
- [ ] Tag `v*` enviada ao repositório de desenvolvimento privado.
- [ ] Confirme que o Release público em `qvcloud/QvReader` carrega os instaladores das três plataformas.
- [ ] Verifique se os links de download no README apontam para a nova tag.
