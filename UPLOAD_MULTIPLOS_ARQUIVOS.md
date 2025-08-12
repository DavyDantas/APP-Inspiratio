# Upload de Múltiplos Arquivos - Formulário de Post

## Alterações Implementadas

### 1. **Schema de Validação Atualizado**
- Agora aceita **múltiplos arquivos** (1 a 10 arquivos)
- Validação individual de cada arquivo (tamanho e tipo)
- Suporte para imagens: `.jpg`, `.jpeg`, `.png`, `.webp`
- Suporte para vídeos: `.mp4`, `.webm`
- Limite de **100MB por arquivo**

### 2. **Interface do Usuário Melhorada**
- **Input de arquivo múltiplo**: Permite selecionar vários arquivos de uma vez
- **Pré-visualização individual**: Cada arquivo selecionado é mostrado com:
  - Nome do arquivo
  - Tamanho em MB
  - Pré-visualização da imagem ou player de vídeo
  - Botão para remover arquivo individual
- **Contador de arquivos**: Mostra quantos arquivos foram selecionados

### 3. **Funcionalidades Adicionadas**
- **Remoção individual**: Usuário pode remover arquivos específicos sem afetar os outros
- **Validação em tempo real**: Feedback imediato sobre erros de validação
- **Pré-visualização responsiva**: Imagens e vídeos são exibidos com aspect ratio 16:9

## Como Usar

### 1. **Selecionando Arquivos**
- Clique no botão "Escolher Arquivos (Múltiplos)"
- Selecione um ou mais arquivos (máximo 10)
- Use Ctrl+clique (Windows) ou Cmd+clique (Mac) para seleção múltipla

### 2. **Gerenciando Arquivos**
- Visualize todos os arquivos selecionados na seção de pré-visualização
- Remova arquivos individuais clicando no ícone de lixeira
- Adicione mais arquivos selecionando novamente (substitui a seleção anterior)

### 3. **Validações Automáticas**
- **Quantidade**: Entre 1 e 10 arquivos
- **Tamanho**: Máximo 100MB por arquivo
- **Formato**: Apenas imagens e vídeos suportados
- **Feedback visual**: Bordas vermelhas e mensagens de erro quando necessário

## Tipos de Arquivo Suportados

### Imagens
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### Vídeos
- MP4 (.mp4)
- WebM (.webm)

## Limitações
- **Máximo de 10 arquivos** por upload
- **100MB por arquivo** individual
- **Formatos específicos** apenas (listados acima)
- **Substituição total** ao selecionar novos arquivos (não adiciona aos existentes)

## Melhorias Futuras Sugeridas
1. **Drag & Drop**: Arrastar e soltar arquivos na área de upload
2. **Adição incremental**: Adicionar arquivos aos já selecionados
3. **Compressão automática**: Reduzir tamanho de imagens grandes automaticamente
4. **Upload progressivo**: Barra de progresso durante o envio
5. **Pré-visualização de thumbnails**: Miniaturas para melhor organização
