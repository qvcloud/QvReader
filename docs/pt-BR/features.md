# Recursos e Capacidades

Uma visão concisa e transparente sobre o que o QvReader faz hoje e o que evita deliberadamente.

## Filosofia do Produto

O QvReader é um **leitor de Markdown ultraleve, de altíssima velocidade e focado no documento**, com a medida exata de poder de edição.
Ele atende à necessidade constante de "abrir rapidamente um README, documentação de código gerada por IA ou notas locais" — abrir, ler como uma página limpa da web, fazer ajustes no local quando necessário e fechar com `Esc`. **Não** é uma IDE pesada, um banco de dados complexo em nuvem ou um CMS intrincado.

Valores fundamentais (da constituição do projeto):

1. Inicialização rápida e binário compacto (~5MB nativo, inicialização a frio <50 ms).
2. Área de leitura limpa, sem anúncios ou distrações.
3. Leitura como padrão; edição é explícita para evitar alterações acidentais.
4. Edição poderosa para modificações diárias sem se tornar um editor pesado.
5. Arquivos locais e local-first: sem conexão obrigatória, 100% privado.

---

## Edições e Matriz de Recursos

### Edição Comunitária (Community Edition - Gratuita para Sempre)

- **Leitura instantânea de alto desempenho**: Suporte completo a CommonMark / GFM, inicialização <50 ms, consumo mínimo de memória. Rola suavemente documentos com mais de 50.000 linhas a 60 FPS.
- **Layout fluido adaptativo à tela**: Largura dinâmica (896px–1280px) com 3 modos selecionáveis (`adaptativo`, `padrão`, `largura total`) nas Configurações.
- **Fidelidade de bytes de origem**: O arquivo original é a única verdade. Quebras de linha (LF/CRLF) e codificações (UTF-8/BOM) são estritamente preservadas.
- **Edição no local com F2 (Recurso central, gratuito para sempre)**: Desenvolvido com CodeMirror 6, edição no próprio fluxo do texto sem limites ou paywalls.
- **Pré-visualização dividida sincronizada com F3**: Editor e pré-visualização em tempo real. Inclui 300 sessões de avaliação gratuitas; **nunca é bloqueado após o término da avaliação** (apenas um aviso suave de Pro é exibido ao trocar de arquivo), e **a edição e o salvamento de documentos nunca são bloqueados**.
- **Diagramas de engenharia e fórmulas**: Renderização nativa de diagramas Mermaid e fórmulas matemáticas KaTeX. Inclui **modal interativo de tela cheia para diagramas Mermaid** com suporte a arrastar, mover e ampliar com duplo clique.
- **Navegação de documentos**: Barra lateral de sumário (TOC), menu de clique direito, temas integrados e ajuste de escala de fonte.
- **Impressão nativa do sistema**: `Cmd/Ctrl+P` aciona a impressão com formatação otimizada para economia de tinta.
- **CLI multiplataforma**: Inicialização a partir do terminal (`qvreader <arquivo>` / `qvreader .`).
- **Internacionalização total**: Suporte a 6 idiomas (Português (Brasil), English, 简体中文, 日本語, 한국어, Español).

### Edição Pro (Pro Edition - $9.99 Compra Vitalícia)

- **Avaliação gratuita completa**: A Edição Comunitária inclui 300 usos de avaliação sem necessidade de compra antecipada.
- **Gerenciamento de espaço de trabalho**: Painel lateral e árvore de pastas (`Cmd/Ctrl+Shift+W`) para navegar por projetos com múltiplos arquivos.
- **Pipeline completo de exportação**:
  - **Exportação para PDF vetorial** (`Cmd/Ctrl+Shift+P`): Saída de alta fidelidade sem deformações.
  - **Exportação para imagem Retina** (`Cmd/Ctrl+Shift+E`): Captura 2x Retina copiada automaticamente para a área de transferência.
  - **Exportação para HTML independente** (`Cmd/Ctrl+Shift+H`): Arquivo HTML completo para distribuição offline.
- **Ativação 100% local e offline**: Licença perpétua válida para atualizações por toda a vida, compatível com ≥3 dispositivos pessoais e remoção definitiva de avisos Pro.

---

## Suporte a Plataformas

| Plataforma / Arquitetura | Status | Pacote de Distribuição |
|---|---|---|
| macOS (Apple Silicon / arm64) | Principal | `QvReader-0.1.4-arm64.dmg` |
| macOS (Intel / x64) | Principal | `QvReader-0.1.4-x64.dmg` |
| Windows (x64) | Suportado via CI | `QvReader-0.1.4-x64-setup.exe` / `.zip` |
| Linux (Debian / AppImage) | Avaliado após estabilidade | `QvReader-0.1.4-amd64.AppImage` |

---

## Recursos Deliberadamente Excluídos

- Contas obrigatórias na nuvem ou telemetria de documentos.
- Assinaturas periódicas recorrentes.
- Publicação de blogs ou integração com CMS.
- Recursos complexos de IDE ou bancos de dados pesados.
- Publicidade invasiva ou banners durante a leitura.

Consulte [roadmap.md](roadmap.md) para detalhes do roteiro e metas concluídas.
