"use client"

import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  Text,
  HStack,
  AspectRatio,
  Image,
  AbsoluteCenter,
  Grid,
} from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useEffect, useRef, useState } from "react";
import { useTrail, animated, useSpring } from "@react-spring/web";

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
              height: 'clamp(50px, 80px, 90px)',
              fontWeight: '800',
              width: '100%',
              fontSize: 'clamp(2em, 8vw, 6em)',
              alignItems: 'stretch',
              lineHeight: '80px'
            }}
          >
            {items[index]}
          </animated.div>
      ))}
    </div>
  )
}

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ACCEPTED_MEDIA_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "video/mp4", "video/webm"];

const postSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres."),
  media: z
    .any()
    .refine((files: any) => files?.length >= 1, "Pelo menos um arquivo de imagem ou vídeo é obrigatório.")
    .refine((files: any) => files?.length <= 10, "Máximo de 10 arquivos permitidos.")
    .refine(
      (files: any) => Array.from(files || []).every((file: any) => file?.size <= MAX_FILE_SIZE),
      `O tamanho máximo de cada arquivo é 100MB.`
    )
    .refine(
      (files: any) => Array.from(files || []).every((file: any) => ACCEPTED_MEDIA_TYPES.includes(file?.type)),
      "Formato de arquivo inválido. Apenas .jpg, .png, .webp, .mp4, .webm são aceitos."
    ),
  comments: z.array(
    z.object({
      text: z.string().min(5, "O comentário deve ter no mínimo 5 caracteres."),
    })
  ).min(1, "É necessário adicionar pelo menos um comentário."),
});

// Inferir o tipo do formulário a partir do esquema Zod
type PostFormData = z.infer<typeof postSchema>;

export default function PostForm() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  // Animação de flutuação horizontal da abelha
  const beeFloat = useSpring({
    from: { transform: 'translateX(-8px)' },
    to: { transform: 'translateX(8px)' },
    loop: { loop: true },
    config: { duration: 1600 },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      comments: [{ text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "comments",
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const mediaFiles = watch("media");
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  // Função para remover um arquivo específico
  const removeFile = (indexToRemove: number) => {
    if (mediaFiles && mediaFiles.length > 0) {
      const fileList = Array.from(mediaFiles);
      fileList.splice(indexToRemove, 1);
      
      // Criar um novo FileList
      const dataTransfer = new DataTransfer();
      fileList.forEach(file => dataTransfer.items.add(file as File));
      
      // Atualiza o valor do formulário usando setValue
      setValue("media", dataTransfer.files);
    }
  };

  // Função para limpar todos os arquivos
  const clearAllFiles = () => {
    setValue("media", null);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const addFile = (event: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const newFiles = event.target.files;
    if (newFiles && newFiles.length > 0) {
      const incomingFiles = Array.from(newFiles);
      const existingFiles = mediaFiles ? Array.from(mediaFiles) : [];
      
      // Combina arquivos existentes com novos arquivos
      const combinedFiles = [...existingFiles, ...incomingFiles];
      
      // Verifica se não excede o limite de 10 arquivos
      if (combinedFiles.length > 10) {
        alert(`Limite de 10 arquivos excedido. Você tentou adicionar ${incomingFiles.length} arquivo(s), mas já possui ${existingFiles.length} arquivo(s) selecionado(s).`);
        return;
      }
      
      // Criar um novo FileList com todos os arquivos
      const dataTransfer = new DataTransfer();
      combinedFiles.forEach(file => dataTransfer.items.add(file as File));
      
      // Atualiza o campo do formulário
      field.onChange(dataTransfer.files);
      
      // Limpa o valor do input para permitir selecionar os mesmos arquivos novamente
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  };

  // Atualiza as pré-visualizações quando arquivos são selecionados
  useEffect(() => {
    if (mediaFiles) {
      const files = Array.from(mediaFiles);
      if (files.length > 0) {
        Promise.all(
          files.map(
            (file: any) =>
              new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
              })
          )
        ).then((results) => setPreviews(results));
      } else {
        setPreviews([]);
      }
    } else {
      setPreviews([]);
    }
  }, [mediaFiles]);

  const onSubmit = (data: PostFormData) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(data, null, 2));
        console.log(data);
        resolve();
      }, 2000);
    });
  };

  return (
      <AbsoluteCenter
        alignItems={'start'}
        width="100%"
        maxWidth="90%"
        display={'flex'}
        overflowX="hidden"
        px={4}
        flexWrap={'wrap'}
        mx="auto"
        p={6}
        marginTop={{ base: '20px', 1210: '0' }}
      >
        <VStack marginRight={'4%'} as="form" onSubmit={handleSubmit(onSubmit)} gap={6} align="stretch" width={'50%'}>
          {/* Campo de Título */}
          <Box>
            <Text mb={2} fontWeight="medium">Título</Text>
            <Input
              rounded={'lg'} 
              id="title" 
              placeholder="Digite o título da sua postagem" 
              {...register("title")}
              borderColor={errors.title ? "red.500" : ""}
              variant={'subtle'}
              />
            {errors.title && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.title.message}
              </Text>
            )}
          </Box>

          {/* Campo de Mídia */}
          <Box>
            <Text mb={2} fontWeight="medium">Imagens ou Vídeos (máximo 10 arquivos)</Text>
            <Controller
              name="media"
              control={control}
              render={({ field }: { field: any }) => (
                <>
                  <Input
                    type="file"
                    accept={ACCEPTED_MEDIA_TYPES.join(",")}
                    multiple
                    ref={inputFileRef}
                    onChange={(e) => addFile(e, field)}
                    style={{ display: 'none' }}
                    />
                  <VStack align="start" gap={2}>
                    <Button
                      rounded={'lg'}
                      onClick={() => inputFileRef.current?.click()}
                      variant="outline"
                      borderColor={errors.media ? "red.500" : "gray.200"}
                      size="sm"
                      >
                      {mediaFiles && mediaFiles.length > 0 ? "Adicionar mais arquivos" : "Escolher Arquivos"}
                    </Button>
                    
                    {mediaFiles && mediaFiles.length > 0 && (
                      <HStack gap={2}>
                        <Text fontSize="sm" color="gray.600">
                          {mediaFiles.length} arquivo(s) selecionado(s)
                        </Text>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={clearAllFiles}
                          color={'red.500'}
                          rounded={'lg'}
                        >
                          Limpar todos
                        </Button>
                      </HStack>
                    )}
                  </VStack>
                </>
              )}
              />
            {previews.length > 0 && mediaFiles && (
              <Box overflowY="auto" flexDirection={'column'} display={'flex'} overflowX={'auto'} maxHeight="200px" mt={4} p={2} borderWidth="1px" borderRadius="md">
                <Text fontSize="sm" mb={2}>Pré-visualizações:</Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                  {previews.map((preview, index) => {
                    const file = mediaFiles[index];
                    return (
                      <Box key={index} position="relative">
                        <HStack justify="space-between" align="center" mb={1}>
                          <Text fontSize="xs" color="gray.500">
                            {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : "Arquivo não encontrado"}
                          </Text>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => removeFile(index)}
                            aria-label={`Remover ${file?.name}`}
                          >
                            <BiTrash className="text-[#d82e2e]" />
                          </Button>
                        </HStack>
                        <AspectRatio ratio={16/9}>
                          {file?.type.startsWith("image/") ? (
                            <Image 
                              src={preview} 
                              alt={`Pré-visualização ${index + 1}`} 
                              objectFit="cover"
                              borderRadius="md"
                            />
                          ) : (
                            <Box borderRadius="md" overflow="hidden" width="100%" height="100%">
                              <video src={preview} controls width="100%" height="100%" />
                            </Box>
                          )}
                        </AspectRatio>
                      </Box>
                    );
                  })}
                </Grid>
              </Box>
            )}
            {errors.media && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.media.message?.toString()}
              </Text>
            )}
          </Box>

          {/* Campo de Comentários */}
          <Box>
            <Text mb={2} fontWeight="medium">Notas</Text>
            <VStack gap={3} align="stretch">
              {fields.map((field, index) => (
                <Box key={field.id}>
                  <HStack>
                    <Textarea
                      rounded={'lg'}
                      placeholder={`${index + 1}ª Nota`}
                      {...register(`comments.${index}.text` as const)}
                      borderColor={errors.comments?.[index]?.text ? "red.500" : ""}
                      variant={'subtle'}
                      />
                    {fields.length > 1 && (
                      <Button
                      aria-label="Remover comentário"
                      variant="ghost"
                      onClick={() => remove(index)}
                      >
                        <BiTrash className="text-[#d82e2e]"/>
                      </Button>
                    )}
                  </HStack>
                  {errors.comments?.[index]?.text && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.comments?.[index]?.text?.message}
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
            <Button
              mt={4}
              onClick={() => append({ text: "" })}
              size="sm"
              rounded={'2xl'}
              backgroundColor={'blue.500'}
              variant={'subtle'}
              color={'white'}
              >
            Nova nota
            </Button>
            {errors.comments && !Array.isArray(errors.comments) && (
              <Text color="red.500" fontSize="sm" mt={2}>{errors.comments.message}</Text>
            )}
          </Box>

          {/* Botão de Envio */}
          <Button
            rounded={'2xl'}
            type="submit"
            colorScheme="blue"
            loading={isSubmitting}
            variant={'subtle'}
            color={'white'}
            backgroundColor={'green.500'}
            >
            {isSubmitting ? "Enviando..." : "Enviar Postagem"}
          </Button>
        </VStack>
      <Box position={'relative'} display={{ base: 'none', xl: 'block' }} >
        <Trail open={open}>
          <Text as={'span'}>Qual foi</Text>
          <Text as={'span'}> a nossa</Text>
          <Text as={'span'}>aventura</Text>
          <Text as={'span'}> de hoje?</Text>
        </Trail>
        <animated.div
          className="absolute top-[60px] right-[-40px]"
          style={beeFloat}
        >
          <Image 
            src="/images/bee.png" 
            alt="Abelha flutuante" 
            width={120} 
            height={120}
            loading="lazy"
          />
        </animated.div>
      </Box>
      </AbsoluteCenter>
  );
};