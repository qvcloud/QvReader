# Roadmap

Uma visão transparente do que o QvReader planeja e do que deliberadamente não está construindo.
Itens entram em desenvolvimento somente após serem especificados e demonstrarem que não prejudicam a
velocidade de inicialização, o tamanho do binário, a fidelidade do Markdown ou a experiência central de leitura.

## Candidatos de alta prioridade

- **Metas de desempenho para documentos grandes** — alvos quantificados de carregamento e rolagem,
  não apenas "ele abre".
- **Atualização ao vivo de arquivo externo** — quando outro editor / um agente de IA reescreve o arquivo,
  atualize sem perda de dados.
- **Destaque de vínculo de bloco fonte ↔ pré-visualização** — mais fino do que rolagem sincronizada simples.
- **Polimento nativo macOS** — UX de associação de arquivo, menus, atalhos por plataforma.

## Secundários / avaliados depois

- Exportação nativa em **PDF**, exportação **HTML** de arquivo único.
- Diagramas **Mermaid** e **matemática** mais rica como extensões opcionais de carregamento lento.
- Suporte a **Linux** — somente quando os recursos centrais estiverem estáveis e houver capacidade de teste.
- Compilação Windows portátil ("verde").
- Foco em tabela com reconhecimento de Markdown / leitura em tela cheia.

## Explicitamente fora de escopo

A carta fixa o limite. O QvReader não vai perseguir "ser tudo":

- Sincronização em nuvem / drives embutidos / sincronização via hospedagem Git.
- Publicação de blog ou CMS.
- Contas, pagamentos, ativação, licenciamento ou telemetria que leia seu conteúdo.
- Definir silenciosamente associações de arquivo padrão.
- Corridas de paridade de recursos com Typora / Obsidian / IDEs completos.

Cada item do roadmap é limitado pelas perguntas de revisão do processo de especificação: Ele atende a um
cenário real e frequente? Preserva "abrir rápido, ler bem, não interromper"? Qual é seu impacto mensurável
em tamanho/inicialização/memória? Ele toca o formato-fonte? Qual é a interação equivalente por plataforma?
Envolve rede/conta/pagamento/privacidade?

O trabalho candidato é discutido no [rastreador de issues](https://github.com/qvcloud/QvReader/issues).
