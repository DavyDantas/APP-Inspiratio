"use client";

import { AbsoluteCenter, VStack, Text, Box, Image, HStack, Dialog, Portal, CloseButton, For } from "@chakra-ui/react";
import ModalViewMemorie from "@/components/ModalViewMemorie";
import { useUser } from "@/context/auth";

export default function Home() {
  const { user } = useUser();

  return (
    <VStack gap={'60px'} overflow={'hidden'}  className="relative w-full h-auto" top={'100px'}>
      <Box position={'relative'} width={'100%'} height={'250px'} maxWidth={'50%'} borderRadius={'2xl'}>
        <Box position={'relative'} zIndex={'10'} background={{ base: 'white', _dark: 'black' }} width={'100%'} height={'100%'} borderRadius={'2xl'} boxShadow={'2xl'} overflow={'hidden'}>
          <Box height={'100%'} left={'2%'} display={'flex'} flexDirection={'column'} alignItems={'start'} justifyContent={'center'} position={'absolute'} width={'50%'} zIndex={40}>
            <Text fontSize={'3xl'} fontWeight={'800'}>
              Guarde suas memórias na
            </Text>
            <Text lineHeight={'1'} fontSize={'5xl'} fontWeight={'800'}>
              Inspirat.I<Text as={"span"} color="yellow.400">O</Text>
            </Text>
            <Text fontSize={'sm'} marginTop={'5%'} color='gray.500'>
              Aqui você pode compartilhar suas memórias e se inspirar com as histórias de outras pessoas.
            </Text>
          </Box>
          <Box right={'0'} position={'absolute'} width={'60%'} height={'100%'} zIndex={20}>
            <Image src="/images/home-img.jpg" alt="Descrição da imagem" height='100%' width='100%' objectFit="cover" />
          </Box>
          <Box zIndex={30} width={'100%'} background={{ base: 'white', _dark: 'black' }} left={'60%'} top={'100%'} transform={'translate(-100%, -50%) rotate(-20deg)'} height={'200%'} position={'absolute'}></Box>
        </Box>
        <Box right={'-0.5%'} bottom={'-2%'} zIndex={'5'} position={'absolute'} backgroundColor={'yellow.500'} width={'100%'} height={'100%'} borderRadius={'2xl'}></Box>
        <Box className="bg-[#6b46018f]" right={'-1%'} bottom={'-4%'} zIndex={'1'} position={'absolute'} width={'100%'} height={'100%'} borderRadius={'2xl'}></Box>
      </Box>
      <Box className="flex flex-col items-center relative w-full" maxWidth={'80%'} gap={'70px'}>
          <Text color={'gray.emphasized'} fontSize={'4xl'} fontWeight={'bold'}>
            Minhas Memórias
          </Text>
          <ModalViewMemorie/>
      </Box>
      </VStack>
  );
}
