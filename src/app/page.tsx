import { AbsoluteCenter, VStack, Text, Box, Image, HStack, Dialog, Portal, CloseButton, For } from "@chakra-ui/react";
import MenuMiniPost from "./components/MenuMiniPost";
import Link from "next/link";

export default function Home() {

  var posts = [
    {
      title: "Título da Memória",
      imagesUrl: ["/images/home-img.jpg"]
    },
    {
      title: "Outra Memória",
      imagesUrl: ["/images/teste2.jpg", "/images/home-img.jpg"]
    },
    {
      title: "Mais uma Memória",
      imagesUrl: ["/images/home-img.jpg", "/images/teste2.jpg", "/images/teste1.jpg"]
    },
    {
      title: "Mais uma Memória",
      imagesUrl: ["/images/teste1.jpg", "/images/teste2.jpg", "/images/home-img.jpg", "/images/home-img.jpg"]
    }
  ];

  return (
    <VStack gap={'60px'} overflowX={'hidden'}  className="relative h-screen w-screen" marginTop={'100px'}>
      <Box position={'relative'} width={'100%'} height={'100%'} maxWidth={'50%'} maxHeight={'250px'} borderRadius={'2xl'}>
        <AbsoluteCenter zIndex={'10'} background={{ base: 'white', _dark: 'black' }} width={'100%'} height={'100%'} borderRadius={'2xl'} boxShadow={'2xl'} overflow={'hidden'}>
          <Box height={'100%'} left={'2%'} display={'flex'} flexDirection={'column'} alignItems={'start'} justifyContent={'center'} position={'absolute'} width={'50%'} zIndex={40}>
            <Text fontSize={'4xl'} fontWeight={'800'}>
              Guarde suas memórias na
            </Text>
            <Text lineHeight={'1'} fontSize={'6xl'} fontWeight={'800'}>
              Inspirat.I<Text as={"span"} color="yellow.400">O</Text>
            </Text>
            <Text marginTop={'5%'} color='gray.500'>
              Aqui você pode compartilhar suas memórias e se inspirar com as histórias de outras pessoas.
            </Text>
          </Box>
          <Box right={'0'} position={'absolute'} width={'60%'} height={'100%'} zIndex={20}>
            <Image src="/images/home-img.jpg" alt="Descrição da imagem" height='100%' width='100%' objectFit="cover" />
          </Box>
          <Box zIndex={30} width={'100%'} background={{ base: 'white', _dark: 'black' }} left={'60%'} top={'100%'} transform={'translate(-100%, -50%) rotate(-20deg)'} height={'200%'} position={'absolute'}></Box>
        </AbsoluteCenter>
        <Box right={'-0.5%'} bottom={'-2%'} zIndex={'5'} position={'absolute'} backgroundColor={'yellow.500'} width={'100%'} height={'100%'} borderRadius={'2xl'}></Box>
        <Box className="bg-[#6b46018f]" right={'-1%'} bottom={'-4%'} zIndex={'1'} position={'absolute'} width={'100%'} height={'100%'} borderRadius={'2xl'}></Box>
      </Box>
      <VStack className="relative h-screen w-screen" maxWidth={'80%'} gap={'70px'}>
          <Text color={'gray.emphasized'} fontSize={'4xl'} fontWeight={'bold'}>
            Minhas Memórias
          </Text>
          <HStack justifyContent={'flex-start'} gap={'40px'} width={'100%'}> 
            <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom">
              <For each={posts}>
                {(post) => (
                  <Dialog.Trigger key={posts.findIndex(p => p === post)} asChild>
                    <MenuMiniPost MemorePost={post} />
                  </Dialog.Trigger>
                )}
              </For>
              <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner >
                  <Dialog.Content background={{ base: '#e9e9e9eb', _dark: '#2b2b2be1'}}>
                    <Dialog.Header>
                      <Dialog.Title>Dialog Title</Dialog.Title>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="2xl" />
                      </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Dialog.Body>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
           
  
          </HStack>
        </VStack>
      </VStack>
  );
}
