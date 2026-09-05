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

### Edição e autoria

| Modo | Atalho | Regras e o que faz |
|---|---|---|
| **Edição inline** | `F2` | **Recurso básico, 100% grátis para sempre**. Edite no próprio local via CodeMirror 6 |
| **Visão dividida** | `F3` | Fonte à esquerda, pré-visualização síncrona ao vivo. **20 usos grátis ao dia**, aviso suave sem bloqueio ao exceder |
| **Modo de leitura** | `Esc` | Retorne à leitura limpa; feche a janela instantaneamente se não houver edições |

- `Cmd/Ctrl+S` salva com **fidelidade de fim de linha (LF/CRLF) e codificação (UTF-8/BOM)**.
- Alterações não salvas são estritamente protegidas — sem perda silenciosa de dados ao fechar ou sair.
- A visão dividida mantém sua linha do cursor alinhada e destacada na pré-visualização.
- Todas as visões compartilham um único estado de documento e histórico de desfazer.

### Exportação e compartilhamento

- **Impressão padrão** (`Cmd/Ctrl+P`): Diálogo nativo do sistema com estilo otimizado para papel e economia de tinta. Grátis para sempre.
- **Exportar como PDF** (`Cmd/Ctrl+Shift+P`): Fluxo guiado para geração direta de PDF.
- **Exportar como imagem longa PNG** (`Cmd/Ctrl+Shift+E`): Captura 2x Retina em alta resolução. Salva automaticamente e copia para a área de transferência.
- **Exportar como HTML independente** (`Cmd/Ctrl+Shift+H`): Arquivo único portátil com estilos offline e motores embutidos.
- *(As exportações avançadas e o workspace incluem uma cota de 300 sessões de teste. A versão Pro é ilimitada e vitalícia)*

### Workspace e gerenciamento de projetos

- Pressione `Cmd/Ctrl+Shift+W` ou clique na gaveta superior para expandir a **barra lateral com árvore de arquivos**.
- Execute `qvreader .` no terminal para abrir a pasta atual como workspace de imediato.

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
