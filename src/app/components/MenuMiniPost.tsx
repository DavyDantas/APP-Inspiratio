import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import Image from "next/image";

interface Props {
  MemorePost : {
    title: string
    imagesUrl: string[]
  }
}

export default function MenuMiniPost({ MemorePost }: Props) {
  return (
    <VStack marginRight={MemorePost.imagesUrl.length >= 2 ? '15px' : '0px'} marginLeft={MemorePost.imagesUrl.length >= 3 ? '15px' : '0px'} position={'relative'} justifyContent={'center'} alignItems={'center'} className="hover:scale-110 transition-transform duration-300 ease-in-out" overflow="visible">
            {MemorePost.imagesUrl.length === 1 ? (
            <Box position={'relative'} justifyContent={'center'} alignItems={'center'} height={'auto'} display="flex" flexDirection="column" width="fit-content">
                <Box key={0} boxShadow="2xl" position="relative" w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                    <Image src={MemorePost.imagesUrl[0]} alt={`Imagem 1`} fill style={{ objectFit: "cover" }} />
                </Box>
                <Text>{MemorePost.title}</Text>
            </Box>
            ) : (
                MemorePost.imagesUrl.length === 2 ? (
                    <VStack width="125px">
                        <HStack position={'relative'} display={'flex'} justifyContent={'flex-start'} alignItems={'center'} width="135px" overflow="visible">
                            <Box key={0} boxShadow="2xl" position="relative" zIndex={'20'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                                <Image src={MemorePost.imagesUrl[0]} alt={`Imagem 1`} fill style={{ objectFit: "cover" }} />
                            </Box>
                            <Box key={1} boxShadow="2xl" position="absolute" zIndex={'10'} right={'-10px'} top={'-10px'} w="120px" h="150px" overflow="hidden" borderRadius="lg">
                                <Image src={MemorePost.imagesUrl[1]} alt={`Imagem 2`} fill style={{ objectFit: "cover" }} />
                            </Box>
                        </HStack>
                        <Text>{MemorePost.title}</Text>
                    </VStack>
                ) : MemorePost.imagesUrl.length === 3 ? (
                    <VStack>
                        <Box key={0} boxShadow="2xl" position="relative" zIndex={'20'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                            <Image src={MemorePost.imagesUrl[0]} alt={`Imagem 1`} fill style={{ objectFit: "cover" }} />
                        </Box>
                        <Box key={1} boxShadow="2xl" position="absolute" zIndex={'10'} right={'-10px'} top={'-10px'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                            <Image src={MemorePost.imagesUrl[1]} alt={`Imagem 2`} fill style={{ objectFit: "cover" }} />
                        </Box>
                        <Box key={2} boxShadow="2xl" position="absolute" zIndex={'5'} left={'-10px'} top={'-20px'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                            <Image src={MemorePost.imagesUrl[2]} alt={`Imagem 3`} fill style={{ objectFit: "cover" }} />
                        </Box>
                        <Text>{MemorePost.title}</Text>
                    </VStack>
                ) : (
                    <VStack>
                        <Box boxShadow="2xl" position="absolute" zIndex={'1'} backgroundColor={'yellow.500'} top={'-30px'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto"/>
                        <Box key={0} boxShadow="2xl" position="relative" zIndex={'20'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                            <Image src={MemorePost.imagesUrl[0]} alt={`Imagem 1`} fill style={{ objectFit: "cover" }} />
                        </Box>
                        <Box key={1} boxShadow="2xl" position="absolute" zIndex={'10'} right={'-10px'} top={'-10px'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                            <Image src={MemorePost.imagesUrl[1]} alt={`Imagem 2`} fill style={{ objectFit: "cover" }} />
                        </Box>
                        <Box key={2} boxShadow="2xl" position="absolute" zIndex={'5'} left={'-10px'} top={'-20px'} w="120px" h="150px" overflow="hidden" borderRadius="lg" flex="0 0 auto">
                            <Image src={MemorePost.imagesUrl[2]} alt={`Imagem 3`} fill style={{ objectFit: "cover" }} />
                        </Box>
                        <Text>{MemorePost.title}</Text>
                    </VStack>
                )
            )}
    </VStack>
  );
}
