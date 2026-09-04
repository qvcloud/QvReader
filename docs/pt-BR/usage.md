# Uso e atalhos de teclado

O QvReader é projetado em torno de três estados. Você sempre começa no **modo de leitura** (o padrão,
e a única visão segura — cliques e digitação comuns nunca alteram sua fonte).

## Interações principais

| Ação | macOS | Windows / Linux |
|---|---|---|
| Abrir um arquivo | Clique duplo em `.md`, ou `qvreader file.md`, ou Arquivo → Abrir | igual |
| Abrir pasta como workspace | `qvreader .` | igual |
| Entrar na **visão dividida** | `F3` | `F3` |
| Entrar na **edição inline** | `F2` | `F2` |
| Voltar à leitura | `F3` / `F2` (alternar) | igual |
| Salvar | `Cmd + S` | `Ctrl + S` |
| Zoom | `Cmd + rolagem` | `Ctrl + rolagem` |
| Fechar / sair | `Esc` (quando limpo) | `Esc` |
| Configurações | `Cmd + ,` | `Ctrl + ,` |

## Modo de leitura

- Ler, rolar, selecionar texto, seguir links, ver imagens.
- Barra lateral **Sumário**: navegue por títulos; a seção atual é destacada.
- Barra lateral **Workspace**: navegue e alterne entre arquivos Markdown em uma pasta.
- **Temas** e tamanho do texto ficam em Configurações (`Cmd/Ctrl+,`).

## Visão dividida (F3)

- Esquerda: fonte Markdown. Direita: pré-visualização renderizada ao vivo.
- A edição atualiza a pré-visualização (com debounce para a digitação permanecer suave).
- O painel que você rola conduz o outro; sua **linha ativa é destacada** na pré-visualização e mantida alinhada.
- Salve com `Cmd/Ctrl+S`. Fins de linha e codificação originais são preservados.

## Edição inline (F2)

- Edite diretamente na tela de leitura, na posição atual.
- Bom para erros de digitação rápidos, links quebrados ou um ajuste de uma linha sem abrir um painel dividido.
- Mesmas regras de fidelidade de fonte da visão dividida.

## Salvar e segurança

- O QvReader preserva os **bytes originais** do arquivo: fins de linha (LF/CRLF) e codificação
  (UTF-8, com/sem BOM) são detectados e gravados inalterados.
- Se o arquivo mudar no disco fora do QvReader, você é avisado antes de sobrescrever.
- Fechar ou alternar modos com edições não salvas pergunta se você quer salvar, descartar ou permanecer.

## Idioma

Alterne o idioma da interface em Configurações → Geral → Idioma. Suportados: English, 简体中文,
日本語, 한국어, Português (Brasil), Español.
