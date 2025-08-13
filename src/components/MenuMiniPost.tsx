import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import Image from "next/image";
import imageVideo from "../../public/images/video-preview.svg"

interface Props {
  MemorePost : {
      title: string;
      media: string[];
      comments: {
        text: string;
      }[];
  }
}

// Função para verificar se o arquivo é um vídeo
function isVideo(filePath: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.m4v'];
  const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
  return videoExtensions.includes(extension);
}

// Função para processar a mídia (retorna URL da imagem ou thumbnail do vídeo)
function processMedia(mediaPath: string) {
  if (isVideo(mediaPath)) {  
    return imageVideo
  }
  return mediaPath; // Retorna a imagem diretamente
}

export default function MenuMiniPost({ MemorePost }: Props) {

const processedMedia = MemorePost.media.slice(0, 3).map((mediaPath) => processMedia(mediaPath));

  return (
    <VStack h={'auto'} maxWidth={'173px'} marginRight={MemorePost.media.length >= 2 ? '15px' : '0px'} marginLeft={MemorePost.media.length >= 3 ? '15px' : '0px'} position={'relative'} justifyContent={'center'} alignItems={'center'} className="hover:text-[#8d6f0c] hover:-translate-y-4 transition-all duration-500 ease-out" overflow="visible">
        {MemorePost.media.length === 1 ? (
        <Box position={'relative'} justifyContent={'center'} alignItems={'center'} height={'auto'} display="flex" flexDirection="column" width="fit-content">
            <HStack key={0} boxShadow="2xl" position="relative" w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                <Image src={processedMedia[0] as string} alt={`Imagem 1`} fill style={{ objectFit: "cover" }} />
            </HStack>
            <Text marginTop={'8px'} zIndex={'50'} textAlign={'center'} textJustify={'center'}>{MemorePost.title}</Text>
        </Box>
        ) : (
            MemorePost.media.length === 2 ? (
            <VStack width="125px">
                <HStack position={'relative'} display={'flex'} justifyContent={'flex-start'} alignItems={'center'} width="135px" overflow="visible">
                <Box key={0} boxShadow="2xl" position="relative" zIndex={'20'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                    <Image src={processedMedia[0] as string} alt={`Imagem 1`} fill style={{ objectFit: "cover" }} />
                </Box>
                <Box key={1} boxShadow="2xl" position="absolute" zIndex={'10'} right={'-10px'} top={'-10px'} w="120px" h="150px" overflow="hidden" borderRadius="lg">
                    <Image src={processedMedia[1]} alt={`Imagem 2`} fill style={{ objectFit: "cover" }} />
                </Box>
                </HStack>
                <Text zIndex={'50'} textAlign={'center'} textJustify={'center'}>{MemorePost.title}</Text>
            </VStack>
            ) : MemorePost.media.length === 3 ? (
            <VStack>
                <Box key={0} boxShadow="2xl" position="relative" zIndex={'20'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                <Image src={processedMedia[0] as string} alt={`Imagem 1`} fill style={{ objectFit: "cover" }} />
                </Box>
                <Box key={1} boxShadow="2xl" position="absolute" zIndex={'10'} right={'-10px'} top={'-10px'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                <Image src={processedMedia[1]} alt={`Imagem 2`} fill style={{ objectFit: "cover" }} />
                </Box>
                <Box key={2} boxShadow="2xl" position="absolute" zIndex={'5'} left={'-10px'} top={'-20px'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                <Image src={processedMedia[2]} alt={`Imagem 3`} fill style={{ objectFit: "cover" }} />
                </Box>
                <Text zIndex={'50'} textAlign={'center'} textJustify={'center'}>{MemorePost.title}</Text>
            </VStack>
            ) : (
            <VStack>
                <Box boxShadow="2xl" position="absolute" zIndex={'1'} backgroundColor={'yellow.500'} top={'-30px'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto"/>
                <Box key={0} boxShadow="2xl" position="relative" zIndex={'20'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                <Image src={processedMedia[0] as string} alt={`Imagem 1`} fill style={{ objectFit: "cover" }} />
                </Box>
                <Box key={1} boxShadow="2xl" position="absolute" zIndex={'10'} right={'-10px'} top={'-10px'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                <Image src={processedMedia[1] as string} alt={`Imagem 2`} fill style={{ objectFit: "cover" }} />
                </Box>
                <Box key={2} boxShadow="2xl" position="absolute" zIndex={'5'} left={'-10px'} top={'-20px'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                <Image src={processedMedia[2] as string} alt={`Imagem 3`} fill style={{ objectFit: "cover" }} />
                </Box>
                <Text zIndex={'50'} textAlign={'center'} textJustify={'center'}>{MemorePost.title}</Text>
            </VStack>
            )
        )}
    </VStack>
  );
}
