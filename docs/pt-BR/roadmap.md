# Roteiro de Desenvolvimento (Roadmap)

Uma visão transparente do que o QvReader está planejando, o que já foi entregue e o que evita deliberadamente.
Apenas recursos que atendem a critérios rigorosos de especificação e comprovadamente não prejudicam a velocidade de inicialização, o tamanho do arquivo binário, a integridade do Markdown ou a experiência de leitura são construídos.

---

## Metas Concluídas (v0.1.0 ~ v0.1.4)

- [x] **Desempenho Extremo e Otimização de Pacote (v0.1.4)**: Binário nativo de aproximadamente 5MB, bundle de entrada JS de 614KB, fontes matemáticas 100% WOFF2, inicialização a frio <50 ms, rolagem fluida a 60 FPS em documentos com mais de 50.000 linhas.
- [x] **Motor de Layout Fluido Adaptativo à Tela (v0.1.3)**: Largura dinâmica (896px–1280px) eliminando margens vazias em monitores ultrawide, com 3 modos (`adaptativo`, `padrão`, `largura total`).
- [x] **Modal Interativo de Zoom para Diagramas Mermaid (v0.1.3)**: Renderização nativa de fluxogramas, diagramas de sequência e arquitetura, com modal de tela cheia acessível por duplo clique (arraste, panorâmica e zoom).
- [x] **Pipeline de Exportação em 4 Vias (v0.1.3)**: Impressão nativa econômica em tinta, PDF vetorial de alta fidelidade, imagem 2x Retina copiada para a área de transferência e HTML autônomo offline.
- [x] **Contrato de Interação Minimalista (v0.1.0)**: Leitura instantânea com duplo clique em `.md`, `Esc` para fechar, `F2` para edição no local, `F3` para pré-visualização dividida sincronizada.
- [x] **Fidelidade de Bytes de Origem e Salvamento Seguro (v0.1.0)**: Preservação de quebras de linha LF/CRLF e codificação UTF-8, detecção de conflitos externos e proteção contra perda de dados.
- [x] **Localização Completa em 6 Idiomas (v0.1.0 ~ v0.1.3)**: Simetria total em Português (Brasil), English, 简体中文, 日本語, 한국어 e Español.

---

## Próximos Candidatos (v0.1.5+)

- 🔄 **Assinatura de Código e Notarização**: Assinatura e notarização oficial Apple Developer ID (eliminando avisos do Gatekeeper) e certificados de código aberto Windows com SignPath.
- 🔄 **Notificações de Atualização Automática**: Verificação silenciosa na inicialização com o GitHub Releases, exibindo notas de versão de forma amigável.
- 🔄 **Aprimoramentos em Blocos de Código**: Alternância de números de linha, animação ao copiar e recolhimento de blocos longos de código.
- 🔄 **Pacotes para o Ecossistema Linux**: Expansão dos canais de distribuição oficiais Flatpak e Snap.

---

## Recursos Deliberadamente Excluídos

- Sincronização obrigatória na nuvem ou gerenciamento remoto de Git (princípio Local-First estrito).
- Assinaturas periódicas mensais (compra única vitalícia).
- Publicação de blogs ou integração com CMS.
- Recursos pesados de IDE ou bancos de dados em grafo complexos.
- Publicidade invasiva ou avisos visuais incômodos durante a leitura.

Discussões de funcionalidades ocorrem abertamente no [rastreador de problemas do GitHub](https://github.com/qvcloud/QvReader/issues).
