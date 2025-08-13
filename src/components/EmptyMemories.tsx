import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface EmptyMemoriesProps {
  title?: string;
  description?: string;
  showCreateButton?: boolean;
}

export default function EmptyMemories({ 
  title = "Nenhuma memória encontrada", 
  description = "Que tal criar sua primeira memória especial?",
  showCreateButton = true 
}: EmptyMemoriesProps) {
  const router = useRouter();

  const handleCreateMemory = () => {
    router.push('/PostForm');
  };

  return (
    <Box 
      textAlign="center" 
      py={16} 
      px={8}
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack gap={4} maxWidth="400px">
        <Text 
          fontSize="xl" 
          fontWeight="semibold"
          color="gray.600"
          _dark={{ color: "gray.400" }}
        >
          {title}
        </Text>
        <Text 
          color="gray.500"
          _dark={{ color: "gray.500" }}
          textAlign="center"
        >
          {description}
        </Text>
        {showCreateButton && (
          <Button
            onClick={handleCreateMemory}
            colorScheme="yellow"
            size="lg"
            rounded="xl"
            mt={4}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg"
            }}
            transition="all 0.2s"
          >
            Criar minha primeira memória
          </Button>
        )}
      </VStack>
    </Box>
  );
}
