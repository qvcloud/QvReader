<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**Leitor e editor de Markdown ultraleve e instantâneo para macOS e Windows**

Abra um arquivo `.md` e leia como uma página da web limpa — inicialização a frio em menos de 50 ms, resposta instantânea. Sem distrações e focado no documento.  
Pressione `F2` para editar no próprio local, pressione `F3` para pré-visualização dividida sincronizada em tempo real. Pressione `Esc` ao concluir para fechar na hora.

[![Version](https://img.shields.io/badge/Desktop-v0.1.4-blue.svg)](https://github.com/qvcloud/QvReader/releases/tag/v0.1.4)
[![Website](https://img.shields.io/badge/Website-v1.0.8-emerald.svg)](https://qvreader.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-orange.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](#downloads-e-espelhos)

</div>

**Idiomas:** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md)

---

## Por que o QvReader?

A maioria das ferramentas Markdown é focada na escrita pesada ou em gerenciadores de conhecimento intrincados. O QvReader foi construído especificamente para **leitura instantânea e edição rápida de arquivos Markdown locais**: arquivos README, documentações geradas por IA, especificações técnicas, atas de reuniões e notas de lançamento.

- ⚡ **Desempenho Nativo Extremo**: Desenvolvido com Rust e Tauri, instalador de aproximadamente 5MB, bundle de entrada JS de 614KB e inicialização a frio em menos de 50 ms. Suporta documentos extensos com mais de 50.000 linhas com rolagem fluida a 60 FPS.
- 📐 **Layout Fluido Adaptativo à Tela**: Gerenciamento dinâmico de largura (896px–1280px) eliminando margens brancas excessivas em monitores ultrawide, com 3 modos de layout: `adaptativo`, `padrão` e `largura total`.
- 📊 **Modal de Zoom para Diagramas Mermaid**: Renderização nativa de fluxogramas, diagramas de sequência e arquitetura, com modal interativo de tela cheia acessível por duplo clique (arraste, panorâmica e zoom).
- 📤 **Pipeline de Exportação em 4 Vias**: Impressão econômica em tinta (`Cmd/Ctrl+P`), PDF vetorial de alta fidelidade (`Cmd/Ctrl+Shift+P`), imagem PNG 2x Retina copiada automaticamente para a área de transferência (`Cmd/Ctrl+Shift+E`), e HTML independente offline (`Cmd/Ctrl+Shift+H`).
- 🔒 **Local-First & Privacidade Pura**: Os documentos nunca saem do seu disco local. Sem necessidade de internet, sem telemetria de conteúdo e sem cadastros forçados.
- ⌨️ **Contrato de Interação Minimalista**: Duplo clique em `.md` para entrar na leitura instantânea; pressione `Esc` para fechar; pressione `F2` para edição no local; pressione `F3` para pré-visualização dividida.

---

## Downloads e Espelhos

Baixe o pacote v0.1.4 no GitHub Releases oficial ou através de espelhos CDN rápidos validados:

| Plataforma / Arquitetura | Arquivo | GitHub Releases Oficial | Espelho Rápido 1 (ghfast) | Espelho Rápido 2 (gh-proxy) |
|---|---|---|---|---|
| **macOS** (Apple Silicon) | `QvReader-0.1.4-arm64.dmg` | [Download](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [Download Rápido](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [Alternativo](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) |
| **macOS** (Intel x64) | `QvReader-0.1.4-x64.dmg` | [Download](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [Download Rápido](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [Alternativo](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) |
| **Windows** (Instalador x64) | `QvReader-0.1.4-x64-setup.exe` | [Download](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [Download Rápido](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [Alternativo](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) |
| **Windows** (Portátil x64) | `QvReader-0.1.4-windows-x64.zip` | [Download](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [Download Rápido](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [Alternativo](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) |
| **Linux** (AppImage x64) | `QvReader-0.1.4-amd64.AppImage` | [Download](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [Download Rápido](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [Alternativo](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) |

Versões anteriores e checksums estão disponíveis na [Página do GitHub Releases](https://github.com/qvcloud/QvReader/releases).

---

## Guia de Instalação e Confiança do Sistema

Os pacotes comunitários do QvReader são compilados de forma transparente via GitHub Actions CI com somas SHA256 públicas. Durante o período de aplicação de certificados comerciais de assinatura de código, o sistema operacional pode exibir um aviso. Siga as instruções abaixo para autorizar e executar:

### macOS (Apple Gatekeeper)

Se aparecer a mensagem: *"QvReader não pode ser aberto porque o desenvolvedor não pôde ser verificado"* ou *"O aplicativo está danificado e não pode ser aberto"*:

1. **Autorização Rápida na Interface**:
   - Arraste o `QvReader.app` para `/Applications`.
   - Clique com o **botão direito** (ou Control + clique) no `QvReader.app` e escolha **"Abrir"**.
   - Na janela de confirmação, clique novamente em **"Abrir"**. O aplicativo iniciará normalmente.
2. **Comando de Terminal (Recomendado)**:
   ```bash
   xattr -cr /Applications/QvReader.app
   ```

### Windows (Microsoft Defender SmartScreen)

Se aparecer uma janela azul informando: *"O Windows protegeu o seu computador"*:

1. Clique no link **"Mais informações"** (More info).
2. Clique no botão **"Executar assim mesmo"** (Run anyway) que aparece no canto inferior direito.

---

## Principais Atalhos de Teclado

| Ação / Modo | Atalho (macOS) | Atalho (Windows/Linux) | Descrição |
|---|---|---|---|
| **Edição no Local** | `F2` | `F2` | Edição instantânea no próprio texto, **100% gratuita para sempre** |
| **Pré-visualização Dividida** | `F3` | `F3` | Código-fonte à esquerda e pré-visualização sincronizada à direita |
| **Sair / Fechar** | `Esc` | `Esc` | Sai do modo edição; fecha a janela instantaneamente se não houver alterações |
| **Salvar Arquivo** | `Cmd + S` | `Ctrl + S` | Preserva quebras de linha (LF/CRLF) e codificação (UTF-8) |
| **Imprimir Documento** | `Cmd + P` | `Ctrl + P` | Diálogo nativo do sistema com estilo otimizado para economia de tinta |
| **Exportar para PDF** | `Cmd + Shift + P` | `Ctrl + Shift + P` | Exportação vetorial em PDF de alta fidelidade |
| **Exportar para Imagem Retina** | `Cmd + Shift + E` | `Ctrl + Shift + E` | Captura 2x Retina copiada automaticamente para a área de transferência |
| **Exportar para HTML Avulso** | `Cmd + Shift + H` | `Ctrl + Shift + H` | Arquivo HTML autônomo e completo para uso offline |
| **Central de Configurações** | `Cmd + ,` | `Ctrl + ,` | Temas, modo de layout (adaptativo/padrão/total) e tamanho de fonte |

---

## Edições e Modelo Comercial

O QvReader adota um modelo comercial transparente e local-first:

- **Edição Comunitária (Community Edition, Gratuita para Sempre)**:
  - Leitura completa de documentos 100% gratuita, sem anúncios e sem limites de tempo.
  - Edição no local com `F2` 100% gratuita e sem travas.
  - A pré-visualização dividida `F3` e recursos avançados incluem 300 sessões de avaliação.
  - **Não trava após o término da avaliação**: Você pode continuar utilizando o modo F3 livremente (apenas um aviso suave de upgrade é exibido ao trocar de arquivo), e **a edição e o salvamento de documentos nunca são bloqueados**.
- **Edição Pro (Pro Edition, $9.99 Compra Vitalícia)**:
  - Pagamento único com atualizações para toda a vida, sem assinaturas periódicas.
  - Suporta **mais de 3 dispositivos pessoais** (macOS e Windows combinados).
  - **Ativação 100% local e offline**, removendo permanentemente todos os avisos do Pro.
  - Garantia de reembolso de 14 dias em [qvreader.com](https://qvreader.com).

---

## Documentação e Comunidade

- [Guia Detalhado de Recursos](docs/pt-BR/features.md)
- [Manual de Uso e Atalhos](docs/pt-BR/usage.md)
- [Roteiro de Desenvolvimento (Roadmap)](docs/pt-BR/roadmap.md)
- [Compilação a partir do Código-Fonte](docs/pt-BR/development.md)
- [Guia de Contribuição (em inglês)](CONTRIBUTING.md)
- [Código de Conduta (em inglês)](CODE_OF_CONDUCT.md)
- [Política de Segurança (em inglês)](SECURITY.md)
- [Governança (em inglês)](GOVERNANCE.md)
- [Política de Suporte (em inglês)](SUPPORT.md)
- [Processo de Lançamento](docs/pt-BR/release-process.md)
- [Histórico de Alterações (Changelog)](CHANGELOG.md)

---

## Licença e Marcas

- **Código-Fonte**: Distribuído sob a [Licença Apache 2.0](LICENSE). Consulte [NOTICE](NOTICE) e [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- **Marcas**: O nome "QvReader" e os logotipos oficiais são regidos por [TRADEMARKS.md](TRADEMARKS.md). Versões da comunidade devem ser identificadas como "Community Build".
