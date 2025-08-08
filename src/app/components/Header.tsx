import { AbsoluteCenter, Avatar, Box, Button, ButtonGroup, ButtonPropsProvider, HStack, Text } from "@chakra-ui/react";

export default function Header() {
    return (
        <header>
            <AbsoluteCenter display={'fixed'} top={'5%'}>
                <HStack gap={4}>
                    <ButtonGroup>
                        <Button rounded='2xl' variant={'subtle'}>Home</Button>
                        <Button  rounded='2xl' alignItems={"center"} variant={"subtle"}> 
                            <Text
                                position={'relative'}
                                color={{ base: "blackAlpha.600", _dark: "whiteAlpha.600" }}
                                fontSize="30px"
                                top={'-2px'}
                            >
                                +
                            </Text> Nova Memória</Button>
                    </ButtonGroup>
                        <Avatar.Root>
                          <Avatar.Fallback name="Segun Adebayo" />
                          <Avatar.Image src="https://bit.ly/sage-adebayo" />
                        </Avatar.Root>
                </HStack>
            </AbsoluteCenter>
        </header>
    )
}