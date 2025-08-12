import { AbsoluteCenter, Avatar, Box, Button, ButtonGroup, ButtonPropsProvider, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { ColorModeButton } from "@/components/ui/color-mode";

export default function Header() {
    return (
        <header>
            <Box position={'fixed'} transform={'translate(0, -50%)'} top={"5%"} left={'5%'} direction={'row'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Text fontSize="3xl" fontWeight="bold">
                    Inspirat.I<Text as={"span"} color="yellow.400">O</Text>
                </Text>
            </Box>
            <AbsoluteCenter position={'fixed'} top={'5%'}>
                <HStack gap={4}>
                    <ButtonGroup>
                         <Link href={"/"}> 
                            <Button fontWeight={'700'} color={'yellow.600'} rounded='2xl' variant={'subtle'}>Home</Button>
                        </Link>
                        <Link href={"/PostForm"}> <Button fontWeight={'700'} color={'yellow.600'} rounded='2xl' alignItems={"center"} variant={"subtle"}> 
                            <Text
                                position={'relative'}
                                color={{ base: "yellow.700", _dark: "yellow.400" }}
                                fontSize="30px"
                                top={'-2px'}
                                fontWeight={'600'}
                            >
                                +
                            </Text> Nova Memória</Button>
                        </Link>
                    </ButtonGroup>
                        <Avatar.Root cursor={"pointer"}>
                          <Avatar.Fallback name="Segun Adebayo" />
                          <Avatar.Image src="https://bit.ly/sage-adebayo" />
                        </Avatar.Root>
                </HStack>
            </AbsoluteCenter>
            <Box position={'fixed'} transform={'translate(0, -50%)'} top={"5%"} right={'5%'} direction={'row'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <ColorModeButton/>
            </Box>
        </header>
    )
}