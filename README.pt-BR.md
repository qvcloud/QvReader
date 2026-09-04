<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**Leitor e editor de Markdown ultraleve e instantâneo para macOS e Windows**

Abra um arquivo `.md` e leia-o como uma página web — em milissegundos. Limpo, sem distrações,
focado no documento. Pressione `F2` para editar no lugar, `F3` para uma visão dividida ao vivo.
Quando terminar, pressione `Esc` e saia.

</div>

**Idiomas:** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Português (Brasil)](README.pt-BR.md) · [Español](README.es.md)

---

## Por que o QvReader?

A maioria das ferramentas de Markdown resolve "escrever muito". O QvReader resolve **ler e editar
levemente documentos locais com rapidez** — READMEs, documentos gerados por IA, atas de reunião,
notas de release.

- **Abre na hora.** Clique duas vezes em um arquivo e você está lendo. Sem projeto, sem vault, sem bancada.
- **Pegada mínima.** Um aplicativo nativo Tauri — sem motor de navegador embutido. O instalador tem poucos MB.
- **Leitura sem distrações.** Tipografia limpa, sem barras de ferramentas ocupando a página. Ler é o estado padrão.
- **Local primeiro.** Seus arquivos permanecem no seu disco. Sem conta, sem nuvem, sem telemetria do seu conteúdo.
- **Edite quando precisar.** Ler nunca corrompe sua fonte. Editar é explícito e sempre respeita seus bytes originais.

---

## Recursos

### Leitura (padrão)

| Recurso | Detalhe |
|---|---|
| Abertura instantânea | Clique duplo em `.md` → visão de leitura |
| Renderização GFM | Títulos, tabelas, listas de tarefas, tachado, citações |
| Código com destaque | highlight.js, detecção automática de linguagem |
| Matemática (KaTeX) | LaTeX inline e em bloco |
| Imagens locais | Caminhos relativos resolvidos a partir do diretório do documento |
| Sumário (TOC) | Navegue documentos longos por títulos; seção atual destacada |
| Temas | Claro / Escuro / Seguir sistema + predefinições |
| Tamanho do texto | Tamanho do corpo e zoom ajustáveis |
| Observação de arquivo | Detecta edições externas, avisa antes de sobrescrever |

### Edição

| Modo | Atalho | O que faz |
|---|---|---|
| **Visão dividida** | `F3` | Fonte Markdown à esquerda, pré-visualização sincronizada à direita |
| **Edição inline** | `F2` | Edite no lugar, na tela de leitura |
| **Modo de leitura** | `Esc` | De volta à leitura limpa, ou fecha quando limpo |

- `Cmd/Ctrl+S` salva com **fidelidade de fim de linha (LF/CRLF) e codificação (UTF-8/BOM)**.
- Alterações não salvas são protegidas — sem perda silenciosa de dados ao fechar, sair ou em mudança externa.
- A visão dividida mantém sua linha do cursor alinhada e destacada na pré-visualização.
- Todas as visões compartilham um único estado de documento e histórico de desfazer.

### Workspace

- `qvreader .` no terminal abre uma **pasta como workspace**, com barra lateral de árvore de arquivos.
- Registre o CLI uma vez e abra qualquer arquivo ou projeto de qualquer lugar.

---

## Instalação

Baixe o instalador mais recente para sua plataforma na página de
**[GitHub Releases](https://github.com/qvcloud/QvReader/releases)**.

| Plataforma | Arquivo |
|---|---|
| macOS (Apple Silicon e Intel) | `QvReader_<ver>_universal.dmg` |
| Windows (x64) | `QvReader_<ver>_x64-setup.exe` / `.msi` |
| Linux (Debian / AppImage) | `QvReader_<ver>_amd64.deb` / `.AppImage` |

> O repositório onde esta página está é a **casa de comunidade e releases**. O código-fonte é
> desenvolvido em privado e espelhado em instaladores publicados sob **Releases**.

### Registrar o CLI `qvreader` (opcional)

```bash
# macOS: aponte o wrapper para o app instalado
qvreader README.md        # abrir um arquivo
qvreader .                # abrir a pasta atual como workspace
```

---

## Início rápido

```bash
# abrir um arquivo específico
qvreader path/to/file.md

# abrir uma pasta como workspace
qvreader .

# clique duas vezes em qualquer arquivo .md
# ele apenas abre — leitura, imediatamente
```

**Leitura** → rolar, seguir links, selecionar texto.
**Edição** → pressione `F3` (dividida) ou `F2` (inline), faça alterações, `Cmd/Ctrl+S` para salvar, `Esc` para voltar.
**Navegação** → alterne a barra lateral de sumário / workspace.

---

## Documentação

- [Uso e atalhos](docs/pt-BR/usage.md)
- [Recursos](docs/pt-BR/features.md)
- [Desenvolvimento (compilar do código-fonte)](docs/pt-BR/development.md)
- [Processo de release](docs/pt-BR/release-process.md)
- [Changelog](CHANGELOG.md)

---

## Status do projeto

O QvReader está em desenvolvimento ativo. macOS é a plataforma principal de lançamento; Windows é
publicado via CI. O Linux é avaliado quando a estabilidade central e a capacidade de teste estiverem prontas.

Veja [docs/pt-BR/roadmap.md](docs/pt-BR/roadmap.md) para o que está planejado e o que está fora de escopo.

---

## Licença

[Apache License 2.0](LICENSE)

```
Copyright 2026 QvCloud (qvreader.com)
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
