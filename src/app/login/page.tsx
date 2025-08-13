'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/utils/supabase/client';
import { useColorMode } from '@/components/ui/color-mode';
import { ColorModeButton } from '@/components/ui/color-mode';
import { 
  Box, 
  VStack, 
  Text, 
  HStack, 
  Image,
  Container,
  Flex
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useTrail, animated } from "@react-spring/web";

const Trail: React.FC<{ open: boolean; children: React.ReactNode }> = ({ open, children }) => {
  const items = React.Children.toArray(children)
  const trail = useTrail(items.length, {
    config: { mass: 10, tension: 1000, friction: 100 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    from: { opacity: 0, x: 20 },
  })
  return (
    <div className="flex flex-col items-start justify-start">
      {trail.map((style, index) => (
          <animated.div
            key={index}
            style={{
              ...style,
              position: 'relative',
              height: 'clamp(30px, 50px, 60px)',
              fontWeight: '800',
              width: 'fit-content',
              fontSize: 'clamp(1.5em, 6vw, 4em)',
              alignItems: 'stretch',
              flexWrap: 'nowrap',
              lineHeight: '50px'
            }}
          >
            {items[index]}
          </animated.div>
      ))}
    </div>
  )
}

export default function LoginPage() {
    const supabase = createClient();
    const { colorMode } = useColorMode();
    const [open, setOpen] = useState(false);

    useEffect(() => {
      setOpen(true);
    }, []);

    return (
        <Box
          width="100%"
          minHeight="100vh"
          mt={{ base: '50px', md: '60px' }}
          pb={8}
          px={4}
        >
          <Container maxWidth="80%" mx="auto">
            <Flex
              direction={{ base: 'column', xl: 'row' }}
              alignItems={{ base: 'center', xl: 'flex-start' }}
              justifyContent="center"
              gap={10}
              mt="5%"
            >
              <VStack 
                gap={3} 
                align="stretch" 
                width={{ base: '100%', xl: '50%' }}
                maxWidth="500px"
              >
                <VStack gap={4} align="center">
                  <Link href="/">
                    <HStack gap={4} align="center">
                      <Text 
                        fontSize="4xl" 
                        fontWeight="800"
                        color="gray.emphasized"
                      >
                        Inspirat.I<Text as="span" color="yellow.400">O</Text>
                      </Text>
                    </HStack>
                  </Link>
                  <Text 
                    fontSize="lg" 
                    color="gray.500" 
                    textAlign="center"
                    maxWidth="400px"
                  >
                    Entre na sua conta e compartilhe suas memórias mais especiais
                  </Text>
                </VStack>

                {/* Botão de modo de cor */}
                <Flex justify="flex-end">
                  <ColorModeButton />
                </Flex>

                {/* Formulário de autenticação */}
                <Box 
                  p={8} 
                  borderRadius="2xl" 
                  boxShadow="2xl"
                  background={{ base: 'white', _dark: 'gray.800' }}
                  border="1px solid"
                  borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
                  position="relative"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706)',
                    borderRadius: '2xl',
                    zIndex: -1,
                    opacity: 0.1,
                  }}
                >
                  <Auth
                    supabaseClient={supabase}
                    view="magic_link"
                    appearance={{ 
                      theme: ThemeSupa,
                      style: {
                        button: {
                          borderRadius: '12px',
                          padding: '12px 24px',
                          fontSize: '16px',
                          fontWeight: '600',
                          backgroundColor: colorMode === 'dark' ? '#e7e7e7' : '#161616',
                          color: colorMode === 'dark' ? '#161616' : '#e7e7e7',
                        },
                        input: {
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '16px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: colorMode === 'dark' ? '#2d3748' : '#ffffff',
                        },
                        container: {
                          gap: '16px',
                        },
                        anchor: {
                          color: '#fbbf24',
                          textDecoration: 'none',
                        }
                      }
                    }}
                    theme={colorMode === 'dark' ? 'dark' : 'light'}
                    showLinks={true}
                    providers={['google']}
                    redirectTo={"http://localhost:3000"}
                  />
                </Box>
              </VStack>
              
              <Box 
                position="relative" 
                display={{ base: 'none', xl: 'block' }} 
                flex="1" 
                minWidth="300px"
                mt={20}
              >
                <Trail open={open}>
                  <Text as="span" color="gray.emphasized" whiteSpace="nowrap">Bem-vindo de</Text>
                  <Text as="span" color="gray.emphasized">volta à sua</Text>
                  <Text as="span" color="yellow.500">jornada de</Text>
                  <Text as="span" color="gray.emphasized">memórias!</Text>
                </Trail>
              </Box>
            </Flex>
          </Container>
        </Box>
    );
}