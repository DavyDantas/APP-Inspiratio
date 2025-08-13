import { Box, VStack, Text, Skeleton, SkeletonText } from "@chakra-ui/react";

interface LoadingMemoriesProps {
  count?: number;
}

export default function LoadingMemories({ count = 4 }: LoadingMemoriesProps) {
  return (
    <Box display="flex" flexWrap="wrap" gap="40px" width="100%">
      {Array.from({ length: count }).map((_, index) => (
        <VStack 
          key={index}
          maxWidth="173px" 
          gap={2}
          align="center"
        >
          <Skeleton 
            height="150px" 
            width="120px" 
            borderRadius="lg"
          />
          <SkeletonText 
            noOfLines={1} 
            width="100px"
          />
        </VStack>
      ))}
    </Box>
  );
}
