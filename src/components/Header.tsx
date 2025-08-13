"use client";

import { AbsoluteCenter, Avatar, Box, Button, ButtonGroup, ButtonPropsProvider, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useUser } from "@/context/auth";

export default function Header() {
    const { user } = useUser();

    return (
        <header>
            <Box position={'absolute'} transform={'translate(0, -50%)'} top={"50px"} left={'5%'} direction={'row'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Text fontSize="3xl" fontWeight="bold">
                    Inspirat.I<Text as={"span"} color="yellow.400">O</Text>
                </Text>
            </Box>
            <AbsoluteCenter position={'absolute'} top={"50px"}>
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
                    <HStack>
                        <Avatar.Root boxShadow={'md'} cursor={"pointer"}>
                          <Avatar.Fallback name="Segun Adebayo" />
                          <Avatar.Image src={user?.user_metadata?.avatar_url} />
                        </Avatar.Root>
                        <Text>{user?.user_metadata?.name}</Text>
                    </HStack>
                </HStack>
            </AbsoluteCenter>
            <Box position={'absolute'} transform={'translate(0, -50%)'} top={"50px"} right={'5%'} direction={'row'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <ColorModeButton/>
            </Box>
        </header>
    )
}