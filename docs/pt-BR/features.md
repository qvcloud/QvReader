# Recursos

Uma descrição concisa e honesta do que o QvReader faz hoje e do que deliberadamente não faz.

## Posição do produto

O QvReader é um **leitor de Markdown leve, rápido e focado no documento**, com edição apenas
suficiente. Ele ataca o momento "ler rapidamente um README / documento gerado por IA / nota local" —
abra, leia como uma página web, edite ali mesmo se precisar, feche com `Esc`. **Não** é um IDE, uma
base de conhecimento, um vault sincronizado na nuvem ou um CMS completo.

Valores centrais (da carta do projeto):

1. Rápido para abrir, pequeno para instalar.
2. Superfície de leitura limpa, sem bagunça.
3. Ler é o padrão; editar é explícito para você não alterar a fonte acidentalmente.
4. Editar é suficiente para correções reais, nunca um editor pesado.
5. Arquivos locais, local primeiro, sem conta ou nuvem obrigatórias.

## Capacidades atuais (v0.1.0)

- **Leitura instantânea** de documentos CommonMark / GFM.
- **Fidelidade** — o arquivo-fonte é a única fonte de verdade. Sintaxe desconhecida, fins de linha e
  codificações são preservados intocados.
- **Edição inline F2** e **edição dividida F3** com pré-visualização ao vivo.
- **Destaque de código** (highlight.js), **matemática** (KaTeX).
- **Sumário (TOC)**, **workspace de pasta** com árvore de arquivos.
- **Temas**, tamanho de texto ajustável, **6 idiomas de interface**.
- **CLI** (`qvreader <arquivo>` / `qvreader .`).

## Multiplataforma

| Plataforma | Status |
|---|---|
| macOS (Apple Silicon + Intel, universal) | Principal, suportada |
| Windows (x64) | Suportada via CI |
| Linux (Debian / AppImage) | Avaliada após a estabilidade central |

## Explicitamente fora de escopo

A carta do projeto exclui o seguinte para proteger a identidade "rápido, pequeno, focado":

- Sincronização em nuvem, sincronização via hospedagem Git ou drives embutidos.
- Publicação de blog, layout de artigo WeChat ou CMS genérico.
- Tornar-se uma base de conhecimento / IDE para igualar Typora, Obsidian ou VS Code.
- Contas, pagamentos, códigos de ativação, assinaturas ou licenciamento multidispositivo.
- Forçar ou definir silenciosamente associações de arquivo padrão.
- Ecossistemas grandes e não verificados de plugins e temas.

Veja também [roadmap.md](roadmap.md) para o trabalho futuro candidato.
