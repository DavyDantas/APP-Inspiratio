import { Box, Text, VStack, Button } from "@chakra-ui/react";

interface ErrorMemoriesProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorMemories({ error, onRetry }: ErrorMemoriesProps) {
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
          color="red.500"
        >
          Ops! Algo deu errado
        </Text>
        <Text 
          color="gray.600"
          _dark={{ color: "gray.400" }}
          textAlign="center"
          fontSize="sm"
        >
          {error}
        </Text>
        {onRetry && (
          <Button
            onClick={onRetry}
            colorScheme="blue"
            size="md"
            rounded="lg"
            mt={4}
            variant="outline"
          >
            Tentar novamente
          </Button>
        )}
      </VStack>
    </Box>
  );
}
