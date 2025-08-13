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
} from "@chakra-ui/react";
import MenuMiniPost from "../../components/MenuMiniPost";
import { useState, useEffect } from "react";
import { createClient } from '../../utils/supabase/client'

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
  const [supabaseData, setSupabaseData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.from('MemoriePost').select('*');
      if (error) {
        console.error('Erro ao buscar dados:', error);
      } else {
        setSupabaseData(data || []);
        console.log(data ? data : 'Nenhum dado encontrado');
      }
    };

    fetchData();
  }, []);

    var posts = [ 
      {
        title: "Título da Memória",
        media: ["/images/home-img.jpg"],
        comments: [
          { text: "Comentário 1" },
          { text: "Comentário 2" },
        ],
      },
      {
        title: "Outra Memória",
        media: ["/images/teste2.jpg", "/images/home-img.jpg"],
        comments: [
          { text: "Comentário 1" },
          { text: "Comentário 2" },
        ],
      },
      {
        title: "Mais uma Memória nova nova",
        media: ["/images/home-img.jpg", "/videos/video-teste.mp4", "/images/teste1.jpg"],
        comments: [
          { text: "Comentário 1" },
          { text: "Comentário 2" },
        ],
      },
      {
        title: "Mais uma Memória",
        media: ["/videos/video-teste.mp4", "/images/teste2.jpg", "/videos/video-teste.mp4", "/images/home-img.jpg"],
        comments: [
          { text: "Comentário 1 Comentário 1 Comentário 1 Comentário 1Comentário 1Comentário 1Comentário 1vComentário 1 Comentário 1Comentário 1Comentário 1vComentário 1" },
          { text: "Comentário 2 Comentário 1 Comentário 1 Comentário 1Comentário 1Comentário 1" },
          { text: "Comentário 3 Comentário 1 Comentário 1 Comentário 1Comentário 1Comentário 1" },
          { text: "Comentário 4 Comentário 1 Comentário 1 Comentário 1Comentário 1Comentário 1" },

        ],
      }
    ];

  return (
    <HStack flexWrap={'wrap'} alignItems={'start'} justifyContent={'flex-start'} gap={'40px'} width={'100%'}> 
            <Dialog.Root scrollBehavior="outside" modal size="cover" placement="top" motionPreset="slide-in-bottom">
              <For each={posts}>
                {(post) => (
                  <Dialog.Trigger key={posts.findIndex(p => p === post)} asChild>
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
                      <Dialog.Title fontSize={'2xl'} fontWeight={'700'}>{currentPost?.title}</Dialog.Title>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="2xl" />
                      </Dialog.CloseTrigger>
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