# Guia de Uso e Atalhos de Teclado

O QvReader foi projetado em torno de três visualizações principais. Você sempre iniciará no **modo de leitura** (o estado padrão e mais seguro: cliques e digitação comum nunca alteram os arquivos originais).

## Principais Atalhos de Teclado

| Ação / Modo | Atalho (macOS) | Atalho (Windows/Linux) | Descrição |
|---|---|---|---|
| Abrir arquivo | Duplo clique em `.md`, ou `qvreader file.md` | Mesmo | Inicialização instantânea |
| Abrir pasta como espaço de trabalho | `qvreader .` | Mesmo | Carrega o painel lateral de pastas |
| **Edição no local** | `F2` | `F2` | Edição direta no texto; **100% gratuita para sempre** |
| **Pré-visualização dividida** | `F3` | `F3` | Edição paralela; 300 usos de avaliação, sem travamento |
| Voltar à leitura / Sair da edição | `Esc` ou pressione `F2`/`F3` novamente | Mesmo | Retorno à visualização limpa |
| Salvar documento | `Cmd + S` | `Ctrl + S` | Preserva quebras de linha (LF/CRLF) e codificação UTF-8 |
| Imprimir documento | `Cmd + P` | `Ctrl + P` | Janela nativa de impressão com formatação econômica |
| Exportar para PDF | `Cmd + Shift + P` | `Ctrl + Shift + P` | Geração direta de PDF vetorial |
| Exportar para imagem Retina | `Cmd + Shift + E` | `Ctrl + Shift + E` | Captura 2x Retina copiada para a área de transferência |
| Exportar para HTML avulso | `Cmd + Shift + H` | `Ctrl + Shift + H` | Arquivo HTML autônomo completo para uso offline |
| Alternar barra de sumário (TOC) | `Cmd + Shift + O` | `Ctrl + Shift + O` | Navegação por títulos do documento |
| Alternar barra de espaço de trabalho | `Cmd + Shift + W` | `Ctrl + Shift + W` | Navegação na árvore de arquivos do projeto |
| Guia rápido de atalhos | `Cmd + /` | `Ctrl + /` | Janela suspensa com lista de atalhos |
| Zoom | `Cmd + Scroll` | `Ctrl + Scroll` | Escala a interface e o texto |
| Fechar janela / Sair | `Esc` (quando não modificado) | `Esc` | Fechamento imediato |
| Abrir Configurações | `Cmd + ,` | `Ctrl + ,` | Temas, modo de layout e tamanho da fonte |

---

## Modo de Leitura

- **Segurança padrão**: Leia, role, selecione texto, acesse links e veja imagens.
- **Layout fluido adaptativo**: Alterne entre `adaptativo` (896px–1280px fluido), `padrão` (896px fixo) ou `largura total` nas Configurações (`Cmd/Ctrl+,`).
- **Interação com diagramas Mermaid**: Dê duplo clique em qualquer diagrama Mermaid para abrir o modal interativo de tela cheia (suporta arraste e zoom pelo scroll do mouse).
- **Navegação pelo sumário**: A barra lateral (`Cmd/Ctrl+Shift+O`) destaca a seção ativa de leitura.
- **Impressão padrão**: `Cmd/Ctrl+P` abre a caixa nativa de impressão.

---

## Edição no Local (F2)

- **Recurso central, gratuito para sempre**: Sem limites de avaliação ou telas de pagamento.
- Edite diretamente sobre o fluxo do texto na posição atual do cursor, mantendo o contexto visual.
- Ideal para correções rápidas de digitação ou ajustes breves. Pressione `Esc` ou `F2` para retornar à leitura renderizada.
- Pressione `Cmd/Ctrl+S` para salvar, preservando estritamente quebras de linha e codificação.

---

## Visualização Dividida (F3)

- Painel esquerdo: editor Markdown; painel direito: pré-visualização sincronizada em tempo real.
- As alterações atualizam a visualização instantaneamente com debounce inteligente.
- A rolagem sincroniza os dois painéis; **a linha ativa fica destacada na pré-visualização**.
- **Política de avaliação**: Inclui 300 sessões de avaliação gratuitas. **Nunca trava após o término da avaliação**: Você pode continuar utilizando o modo F3 livremente (apenas um aviso suave de upgrade é exibido ao trocar de arquivo), e **a edição e o salvamento de documentos nunca são bloqueados**.

---

## Espaço de Trabalho e Exportação Avançada (Recursos Pro)

- **Painel de espaço de trabalho** (`Cmd/Ctrl+Shift+W`): Navegue por diretórios completos de arquivos Markdown.
- **Pipeline de exportação**: Exportação para PDF vetorial (`Cmd/Ctrl+Shift+P`), PNG 2x Retina (`Cmd/Ctrl+Shift+E`) e HTML autônomo (`Cmd/Ctrl+Shift+H`).
- A Edição Comunitária inclui 300 usos de avaliação; usuários Pro desfrutam de acesso ilimitado para toda a vida.

---

## Instruções de Instalação e Segurança

- **macOS**: Se surgir o aviso de desenvolvedor não identificado, clique com o botão direito no aplicativo e escolha "Abrir", ou execute no terminal `xattr -cr /Applications/QvReader.app`.
- **Windows**: Se surgir o SmartScreen, clique em "Mais informações" e selecione "Executar assim mesmo".
