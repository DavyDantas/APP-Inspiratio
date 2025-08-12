// components/PostDisplay.tsx

import {
  Box,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";

// 1. Definição da interface de dados que o componente espera receber
interface PostDisplayData {
  title: string;
  media: {
    url: string;
  };
  comments: {
    text: string;
  }[];
}

interface PostDisplayProps {
  post: PostDisplayData;
}

export const PostDisplay = ({ post }: PostDisplayProps) => {
  return (
    // 2. Usamos o Grid para criar o layout principal de 2 colunas.
    // 'templateColumns' divide a tela em 10 partes: 8 para a mídia e 2 para os comentários (80%/20%).
    // 'h="100vh"' faz o grid ocupar a altura inteira da tela.
    <Grid
      templateColumns="repeat(10, 1fr)"
      h="100vh"
      width="100%"
      bg="gray.50" // Fundo sutil para a página
    >
      {/* Coluna da Esquerda: Mídia (Imagem ou Vídeo) */}
      <GridItem
        colSpan={8} // Ocupa 8 das 10 colunas
        bg="black"
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100vh" // Ocupa a altura inteira
        overflow="hidden" // Garante que nada saia fora do container
      >
        {post.media.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
          <Image
            src={post.media.url}
            alt={post.title}
            maxH="100%"
            maxW="100%"
            objectFit="contain" // Garante que a imagem inteira seja visível
          />
        ) : (
          <video
            src={post.media.url}
            controls // Adiciona controles de play, pause, volume, etc.
            height="100%"
            width="100%"
          />
        )}
      </GridItem>

      {/* Coluna da Direita: Título e Comentários */}
      <GridItem
        colSpan={2} // Ocupa 2 das 10 colunas
        p={6}
        display="flex"
        flexDirection="column" // Organiza o título e os comentários verticalmente
        h="100vh"
      >
        {/* Título */}
        <Box mb={4}>
          <Heading as="h1" size="lg">
            {post.title}
          </Heading>
          <Box my={4} />
        </Box>

        {/* 3. Área de Comentários com Scroll Independente */}
        <Box
          flex="1" // Permite que a Box cresça para ocupar o espaço disponível
          overflowY="auto" // A MÁGICA ACONTECE AQUI! Adiciona o scroll vertical apenas nesta área
          gap={4}
          pr={2} // Espaçamento para não colar a scrollbar no texto
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f7fafc',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#cbd5e0',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a0aec0',
            },
          }}
        >
          {post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <Box key={index} bg="white" p={3} borderRadius="md" boxShadow="sm">
                <Text fontSize="md">{comment.text}</Text>
              </Box>
            ))
          ) : (
            <Text color="gray.500">Nenhum comentário ainda.</Text>
          )}
        </Box>
      </GridItem>
    </Grid>
  );
};