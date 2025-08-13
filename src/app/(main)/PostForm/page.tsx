"use client"

import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  Text,
  HStack,
  Image as ImageCH,
} from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useEffect, useRef, useState } from "react";
import { useTrail, animated, useSpring } from "@react-spring/web";
import Image from "next/image";
import { createClient } from '../../../utils/supabase/client';
import { useUser } from "@/context/auth";
import { useRouter } from 'next/navigation';

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
              height: 'clamp(50px, 80px, 90px)',
              fontWeight: '800',
              width: 'fit-content',
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
  mediaData: z.array(
    z.object({
      midia: z.string(),
      note: z.string().min(1, "A nota para esta mídia é obrigatória."),
    })
  ).min(1, "É necessário adicionar notas para todas as mídias."),
});

// Inferir o tipo do formulário a partir do esquema Zod
type PostFormData = z.infer<typeof postSchema>;

export default function PostForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setOpen(true);
  }, []);

  // Verificar se o usuário está logado
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Animação de flutuação suave da abelha
  const beeFloat = useSpring({
    from: { 
      transform: 'translateX(0px) translateY(0px) rotate(0deg)'
    },
    to: async (next) => {
      while (true) {
        await next({
          transform: 'translateX(8px) translateY(-6px) rotate(2deg)',
          config: { mass: 1, tension: 300, friction: 10, duration: 500 }
        });
        await next({
          transform: 'translateX(10px) translateY(4px) rotate(-1deg)',
          config: { mass: 1, tension: 300, friction: 10, duration: 500 }
        });
        await next({
          transform: 'translateX(8px) translateY(-2px) rotate(1deg)',
          config: { mass: 1, tension: 300, friction: 10, duration: 500 }
        });
        await next({
          transform: 'translateX(-8px) translateY(-8px) rotate(-2deg)',
          config: { mass: 1, tension: 300, friction: 10, duration: 500 }
        });
        await next({
          transform: 'translateX(-12px) translateY(2px) rotate(1deg)',
          config: { mass: 1, tension: 300, friction: 10, duration: 500 }
        });
        await next({
          transform: 'translateX(0px) translateY(0px) rotate(0deg)',
          config: { mass: 1, tension: 300, friction: 10, duration: 500 }
        });
      }
    },
    loop: true,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      mediaData: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mediaData",
  });

  interface MediaData {
    midia: string;
    note: string;
  }

  const [previews, setPreviews] = useState<string[]>([]);
  const mediaFiles = watch("media");
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [mediaData, setMediaData] = useState<MediaData[]>([]);

  // Função para sincronizar campos com arquivos
  const syncFieldsWithFiles = (fileCount: number) => {
    const currentFieldsLength = fields.length;
    
    if (fileCount > currentFieldsLength) {
      // Adicionar novos campos apenas para os arquivos extras
      for (let i = currentFieldsLength; i < fileCount; i++) {
        append({ midia: "", note: "" });
      }
    } else if (fileCount < currentFieldsLength) {
      // Remover campos extras de trás para frente
      for (let i = currentFieldsLength - 1; i >= fileCount; i--) {
        remove(i);
      }
    }
  };

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
      
      // Remove o campo correspondente do mediaData
      remove(indexToRemove);
    }
  };

  // Função para limpar todos os arquivos
  const clearAllFiles = () => {
    setValue("media", null);
    setValue("mediaData", []);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
    // Usar a função utilitária para limpar campos
    syncFieldsWithFiles(0);
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
        // Primeiro sincronizar o número de campos
        syncFieldsWithFiles(files.length);
        Promise.all(
          files.map(
            (file: any) =>
              new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
              })
          )
        ).then((results) => {
          setPreviews(results);
          // Atualizar as URLs das mídias nos campos existentes
          setTimeout(() => {
            results.forEach((preview, index) => {
              setValue(`mediaData.${index}.midia`, preview);
            });
          }, 0);
        });
      } else {
        setPreviews([]);
        // Limpar todos os campos
        syncFieldsWithFiles(0);
      }
    } else {
      setPreviews([]);
      // Limpar todos os campos
      syncFieldsWithFiles(0);
    }
  }, [mediaFiles]);

  const onSubmit = async (data: PostFormData) => {
    if (!user) {
      alert("Você precisa estar logado para criar uma postagem.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("User ID:", user.id);
      console.log("User object:", user);
      
      // 1. Primeiro, criar o MemoriePost
      const { data: memoriePost, error: postError } = await supabase
        .from('MemoriePost')
        .insert({
          title: data.title,
          user: user.id
        })
        .select('id')
        .single();

      if (postError) {
        console.error("Post error:", postError);
        throw postError;
      }

      const memoriePostId = memoriePost.id;
      
      // 2. Upload das mídias e criação dos MidiaData
      const files = Array.from(data.media) as File[];
      const uploadPromises = files.map(async (file: File, index: number) => {
        // Upload do arquivo para o storage
        const fileExtension = file.name.split('.').pop();
        const fileName = `${user.id}/${memoriePostId}/${Date.now()}-${index}.${fileExtension}`;
        
        const { error: uploadError } = await supabase.storage
          .from('Inspiratio')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        // Obter URL pública do arquivo
        const { data: { publicUrl } } = supabase.storage
          .from('Inspiratio')
          .getPublicUrl(fileName);

        // Criar registro MidiaData
        const { error: midiaError } = await supabase
          .from('MidiaData')
          .insert({
            midia: publicUrl,
            note: data.mediaData[index].note,
            memorie: memoriePostId,
          });

        if (midiaError) {
          throw midiaError;
        }

        return publicUrl;
      });

      await Promise.all(uploadPromises);

      alert("Postagem criada com sucesso!");
      router.push("/");
      
    } catch (error: any) {
      alert(`Erro ao criar postagem: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewClick = (index: number) => {
    setSelectedPreview(previews[index]);
  };

  // Loading state enquanto verifica autenticação
  if (!user) {
    return (
      <Box
        width="100%"
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>Carregando...</Text>
      </Box>
    );
  }

  return (
      <Box
        width="100%"
        minHeight="100vh"
        pt={{ base: '100px', md: '120px' }} // Espaçamento do topo para não cobrir o header
        pb={8}
        px={4}
      >
        <Box
          maxWidth="80%"
          mx="auto"
          display={'flex'}
          flexWrap={'wrap'}
          alignItems={'flex-start'}
          justifyContent={'center'}
          gap={6}
          mt={'5%'}
        >
        <VStack marginRight={'4%'} as="form" onSubmit={handleSubmit(onSubmit)} gap={6} align="stretch" width={{ base: '100%', xl: '50%' }}>
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
              <Box gap={'15px'} flexDirection={'row'} flexWrap={'wrap'} display={'flex'} maxHeight="auto" mt={4} p={2} borderWidth="1px" borderRadius="md">
                <Box width={'fit-content'} gap={'5px'} flexDirection={'column'} display={'flex'}>
                  <Text fontSize="sm" mb={2}>Pré-visualizações:</Text>
                  <HStack justifyContent={'flex-start'} alignItems={'flex-start'} maxWidth={'225px'} flexWrap={'wrap'} gap={'5px'}>
                    {previews.map((preview, index) => (
                      <Button onClick={() => handlePreviewClick(index)} variant="outline" padding={'5px'} rounded={'md'} key={index} mb={2}>
                        <Text>{index + 1}</Text>
                      </Button>
                    ))}
                  </HStack>
                </Box>
                {selectedPreview && ( 
                <VStack position="relative" flex={'1 1 200px'} > 
                   {(() => {
                     const index = previews.indexOf(selectedPreview);
                     const file = mediaFiles[index];
                     const preview = selectedPreview;
                     return (
                      <Box flex={'1'}>
                        <HStack display={'flex'} position="relative" justify="space-between" align="center" mb={1}>
                            <Box flex={'1'} position="relative">
                              <Text 
                              lineClamp={'1'} 
                              fontSize="xs" 
                              color="gray.500"
                              maxWidth="300px"
                              overflow="hidden"
                              whiteSpace="nowrap"
                              textOverflow="ellipsis"
                              >
                              {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : "Arquivo não encontrado"}
                              </Text>
                            </Box>
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
                        <Box borderRadius="md" maxHeight={'200px'} maxWidth={'100%'} overflowY={'auto'}>
                          {file?.type.startsWith("image/") ? (
                            <ImageCH 
                              src={preview} 
                              alt={`Pré-visualização ${index + 1}`} 
                              objectFit="cover"
                            />
                          ) : (
                            <Box borderRadius="md" overflow="hidden" width="100%" height="100%">
                              <video
                                src={preview}
                                controls
                                width="100%"
                                height="100%"
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                       );
                      })()}
                  </VStack>
                )}
              </Box> 
              
            )}
            {errors.media && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.media.message?.toString()}
              </Text>
            )}
          </Box>

          {/* Campo de Notas para cada arquivo */}
          {fields.length > 0 && (
            <Box>
              <Text mb={2} fontWeight="medium">Anote suas observações</Text>
              <VStack gap={3} align="stretch">
                {fields.map((field, index) => (
                  <Box key={field.id}>
                  <HStack align="start">
                    <VStack flex="1" align="stretch">
                      <Text fontSize="sm" color="gray.600">
                        Nota para arquivo {index + 1}:
                      </Text>
                      <Textarea
                        rounded={'lg'}
                        placeholder={`Escreva suas anotações...`}
                        {...register(`mediaData.${index}.note` as const)}
                        borderColor={errors.mediaData?.[index]?.note ? "red.500" : ""}
                        variant={'subtle'}
                      />
                      {errors.mediaData?.[index]?.note && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.mediaData?.[index]?.note?.message}
                        </Text>
                      )}
                    </VStack>
                    {previews[index] && (
                      <Box 
                        flexShrink={0} 
                        width="80px" 
                        height="80px" 
                        borderRadius="md" 
                        overflow="hidden"
                        border="1px solid"
                        borderColor="gray.200"
                      >
                        {mediaFiles && mediaFiles[index]?.type.startsWith("image/") ? (
                          <ImageCH 
                            src={previews[index]} 
                            alt={`Mídia ${index + 1}`} 
                            objectFit="cover"
                            width={120}
                            height={120}
                          />
                        ) : (
                          <Box 
                            width="100%" 
                            height="100%" 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="center"
                            bg="gray.100"
                          >
                            <Text fontSize="xs" color="gray.500">Vídeo</Text>
                          </Box>
                        )}
                      </Box>
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
            {errors.mediaData && !Array.isArray(errors.mediaData) && (
              <Text color="red.500" fontSize="sm" mt={2}>{errors.mediaData.message}</Text>
            )}
          </Box>
          )}

          {/* Botão de Envio */}
          <Button
            rounded={'2xl'}
            type="submit"
            colorScheme="blue"
            disabled={isSubmitting}
            variant={'subtle'}
            color={'white'}
            backgroundColor={'green.500'}
            _hover={{ backgroundColor: 'green.600' }}
            _disabled={{ backgroundColor: 'gray.400', cursor: 'not-allowed' }}
            >
            {isSubmitting ? "Enviando..." : "Enviar Postagem"}
          </Button>
        </VStack>
        
        <Box position={'relative'} display={{ base: 'none', xl: 'block' }} flex="1" minWidth="300px">
          <Trail open={open}>
            <Text as={'span'}>Qual foi</Text>
            <Box display={'flex'} flexWrap={'nowrap'} flexDirection={'row'}>
              <Text as={'span'}>a nossa</Text>
                <animated.div className="absolute right-[-90px] top-[-10px]">
              <animated.div
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
            </animated.div>
            </Box>
            <Text as={'span'}>aventura</Text>
            <Text as={'span'}> de hoje?</Text>
          </Trail>
        </Box>
        
      </Box>
      </Box>
  );
};