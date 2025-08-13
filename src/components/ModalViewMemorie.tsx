"use client"

import {
  Box,
  CloseButton,
  Dialog,
  For,
  HStack,
  Image,
  Portal,
  Text,
  VStack,
  Spinner,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { BiTrash, BiEdit } from "react-icons/bi";
import MenuMiniPost from "./MenuMiniPost";
import LoadingMemories from "./LoadingMemories";
import EmptyMemories from "./EmptyMemories";
import ErrorMemories from "./ErrorMemories";
import { useState, useEffect } from "react";
import { useMemoriePosts, MemoriePostData } from '@/hooks/useMemoriePosts';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// 1. Definição da interface de dados que o componente espera receber
interface PostDisplayData {
  title: string;
  media: string[];
  comments: {
    text: string;
  }[];
}

interface PostDisplayProps {
  post: PostDisplayData;
}



export default function ModalViewMemorie() {
  const [currentPost, setCurrentPost] = useState<PostDisplayData | null>(null);
  const { posts, loading, error, refetch } = useMemoriePosts();
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Função para deletar uma memória
  const handleDelete = async (postId: number) => {
    if (!confirm("Tem certeza que deseja deletar esta memória? Esta ação não pode ser desfeita.")) {
      return;
    }

    setIsDeleting(true);
    try {
      // 1. Buscar todas as mídias associadas ao post para deletar do storage
      const { data: midiaData, error: midiaError } = await supabase
        .from('MidiaData')
        .select('midia')
        .eq('memorie', postId);

      if (midiaError) {
        throw midiaError;
      }

      // 2. Deletar arquivos do storage
      if (midiaData && midiaData.length > 0) {
        const filePaths = midiaData.map(item => {
          // Extrair o caminho do arquivo da URL pública
          const url = new URL(item.midia);
          return url.pathname.replace('/storage/v1/object/public/Inspiratio/', '');
        });

        const { error: storageError } = await supabase.storage
          .from('Inspiratio')
          .remove(filePaths);

        if (storageError) {
          console.warn('Erro ao deletar arquivos do storage:', storageError);
          // Continuar mesmo se houver erro no storage
        }
      }

      // 3. Deletar o post (cascade irá deletar MidiaData automaticamente)
      const { error: deleteError } = await supabase
        .from('MemoriePost')
        .delete()
        .eq('id', postId);

      if (deleteError) {
        throw deleteError;
      }

      // 4. Atualizar a lista de posts
      refetch();
      
      // 5. Fechar o modal se o post deletado estava sendo visualizado
      if (currentPost && posts.find(p => p.id === postId)) {
        setCurrentPost(null);
      }

      alert("Memória deletada com sucesso!");
    } catch (error: any) {
      console.error('Erro ao deletar memória:', error);
      alert(`Erro ao deletar memória: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Função para editar uma memória
  const handleEdit = (postId: number) => {
    router.push(`/EditForm/${postId}`);
  };
  
  // Mostrar spinner de carregamento
  if (loading) {
    return <LoadingMemories />;
  }

  // Mostrar mensagem de erro se houver
  if (error) {
    return <ErrorMemories error={error} onRetry={refetch} />;
  }

  // Mostrar mensagem se não houver posts
  if (posts.length === 0) {
    return <EmptyMemories />;
  }

  return (
    <HStack flexWrap={'wrap'} alignItems={'start'} justifyContent={'flex-start'} gap={'40px'} width={'100%'}> 
            <Dialog.Root scrollBehavior="outside" modal size="cover" placement="top" motionPreset="slide-in-bottom">
              <For each={posts}>
                {(post) => (
                  <Dialog.Trigger key={post.id} asChild>
                    <Box onClick={() => setCurrentPost(post)}>
                      <MenuMiniPost MemorePost={post} />
                    </Box>
                  </Dialog.Trigger>
                )}
              </For>
              <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner >
                  <Dialog.Content height={'auto'} background={{ base: '#e9e9e9f4', _dark: '#2b2b2bf0'}}>
                    <Dialog.Header>
                      <HStack justify="space-between" align="center" width="auto">
                        <Dialog.Title fontSize={'2xl'} fontWeight={'700'}>{currentPost?.title}</Dialog.Title>
                        <HStack gap={2}>
                          <IconButton
                            aria-label="Editar memória"
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => {
                              const post = posts.find(p => p.title === currentPost?.title);
                              if (post) handleEdit(post.id);
                            }}
                          >
                            <BiEdit />
                          </IconButton>
                          <IconButton
                            aria-label="Deletar memória"
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            loading={isDeleting}
                            onClick={() => {
                              const post = posts.find(p => p.title === currentPost?.title);
                              if (post) handleDelete(post.id);
                            }}
                          >
                            <BiTrash />
                          </IconButton>
                          <Box>
                            <Dialog.CloseTrigger asChild>
                              <CloseButton size="2xl" />
                            </Dialog.CloseTrigger>
                          </Box>
                        </HStack>
                      </HStack>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Box width={'100%'} display="flex" flexWrap="wrap" gap="20px">
                        <Box flex={1} maxWidth="75%"  flexWrap="wrap" display="flex" gap="10px">
                          {currentPost?.media.length === 1 ? (
                            (() => {
                              const isVideo = currentPost?.media[0].endsWith('.mp4') || currentPost?.media[0].endsWith('.webm') || currentPost?.media[0].endsWith('.avi') || currentPost?.media[0].endsWith('.mov');
                              return isVideo ? (
                                <video src={currentPost?.media[0]} preload="metadata" controls width="100%" height="auto" />
                              ) : (
                                <Image src={currentPost?.media[0]} alt={currentPost?.title} borderRadius="md" width="100%" height="auto" objectFit="cover" />
                              );
                            })()
                          ) : (
                          <>
                          <VStack flex={'1 1 300px'}>
                            {currentPost?.media.slice(0,currentPost?.media.length/2).map((media, index) => {
                              const isVideo = media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.avi') || media.endsWith('.mov');

                              return (
                                <Box key={index} borderRadius="6px" width="100%" height="fit-content" overflow="hidden">
                                  {isVideo ? (
                                    <video src={media} preload="metadata" controls width="100%" height="auto" />
                                  ) : (
                                    <Image src={media} alt={currentPost?.title} borderRadius="md" width="100%" height="auto" objectFit="cover" />
                                  )}
                                </Box>
                              );
                            })}
                          </VStack>
                          <VStack flex={'1 1 300px'}>
                            {currentPost?.media.slice(currentPost?.media.length/2).map((media, index) => {
                              const isVideo = media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.avi') || media.endsWith('.mov');

                              return (
                                <Box key={index} borderRadius="6px" width="100%" height="fit-content" overflow="hidden">
                                  {isVideo ? (
                                    <video src={media} preload="metadata" controls width="100%" height="auto" />
                                  ) : (
                                    <Image src={media} alt={currentPost?.title} borderRadius="md" width="100%" height="auto" objectFit="cover" />
                                  )}
                                </Box>
                              );
                            })}
                          </VStack>
                        </>
                      )}
                    </Box>
                      <VStack flex="1" minWidth="200px" maxWidth="25%" gap="10px">
                          {currentPost?.comments.map((comment, index) => (
                            <Box rounded={'xl'} position={'relative'} width={'100%'} backgroundColor={{ base: '#fdfdfd', _dark: '#494949' }} key={index} padding={3}>
                              <Box 
                                boxShadow={'md'}
                                bgGradient="to-bl"
                                gradientFrom={'yellow.300'} 
                                gradientTo={'yellow.600'}
                                width={'15px'} 
                                height={'15px'} 
                                rounded={'full'} 
                                position={'absolute'} 
                                right={'-5px'} 
                                top={'-5px'}
                              ></Box>
                              <Text>{comment.text}</Text>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    </Dialog.Body>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </HStack>
  );
};