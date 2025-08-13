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
  Spinner,
} from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useEffect, useRef, useState } from "react";
import { useTrail, animated, useSpring } from "@react-spring/web";
import Image from "next/image";
import { createClient } from '../../../../utils/supabase/client';
import { useUser } from "@/context/auth";
import { useRouter, useParams } from 'next/navigation';

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

const editSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres."),
  mediaData: z.array(
    z.object({
      id: z.number().optional(),
      midia: z.string(),
      note: z.string().min(1, "A nota para esta mídia é obrigatória."),
      isNew: z.boolean().optional(),
      file: z.any().optional(), // Para armazenar o arquivo original
    })
  ).min(1, "É necessário ter pelo menos uma mídia."),
});

type EditFormData = z.infer<typeof editSchema>;

export default function EditForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalPost, setOriginalPost] = useState<any>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const supabase = createClient();
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const inputFileRef = useRef<HTMLInputElement | null>(null);

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
    reset,
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: "",
      mediaData: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mediaData",
  });

  // Função para adicionar novos arquivos
  const addNewFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    
    // Verificar se não excede o limite total
    if (fields.length + fileList.length > 10) {
      alert(`Limite de 10 mídias excedido. Você já possui ${fields.length} mídia(s).`);
      return;
    }

    // Validar cada arquivo
    for (const file of fileList) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`O arquivo ${file.name} é muito grande. Tamanho máximo: 100MB.`);
        return;
      }
      
      if (!ACCEPTED_MEDIA_TYPES.includes(file.type)) {
        alert(`Formato do arquivo ${file.name} não é aceito. Use apenas: .jpg, .png, .webp, .mp4, .webm`);
        return;
      }
    }

    // Processar cada arquivo para preview
    for (const file of fileList) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          append({
            midia: e.target.result as string, // Apenas para preview
            note: "",
            isNew: true,
            file: file, // Armazenar o arquivo original
          });
        }
      };
      reader.readAsDataURL(file);
    }

    // Limpar o input
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  // Carregar dados do post para edição
  useEffect(() => {
    const loadPost = async () => {
      if (!postId || !user) return;

      try {
        setIsLoading(true);
        
        const { data: postData, error: postError } = await supabase
          .from('MemoriePost')
          .select(`
            id,
            title,
            user,
            MidiaData (
              id,
              midia,
              note
            )
          `)
          .eq('id', postId)
          .eq('user', user.id)
          .single();

        if (postError) {
          throw postError;
        }

        if (!postData) {
          alert("Post não encontrado ou você não tem permissão para editá-lo.");
          router.push('/');
          return;
        }

        setOriginalPost(postData);
        
        // Preencher o formulário com os dados existentes
        reset({
          title: postData.title,
          mediaData: postData.MidiaData.map((media: any) => ({
            id: media.id,
            midia: media.midia,
            note: media.note,
            isNew: false,
          })),
        });

      } catch (error: any) {
        console.error('Erro ao carregar post:', error);
        alert(`Erro ao carregar post: ${error.message}`);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId, user, supabase, router, reset]);

  const onSubmit = async (data: EditFormData) => {
    if (!user || !originalPost) {
      alert("Erro: dados não carregados.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Atualizar o título do post
      const { error: titleError } = await supabase
        .from('MemoriePost')
        .update({ title: data.title })
        .eq('id', postId);

      if (titleError) {
        throw titleError;
      }

      // 2. Upload das novas mídias
      let newMediaIndex = 0;
      for (const mediaItem of data.mediaData) {
        if (mediaItem.isNew && mediaItem.file) {
          // Upload do arquivo para o storage (usando a mesma lógica do PostForm)
          const fileExtension = mediaItem.file.name.split('.').pop();
          const fileName = `${user.id}/${postId}/${Date.now()}-${newMediaIndex}.${fileExtension}`;
          
          const { error: uploadError } = await supabase.storage
            .from('Inspiratio')
            .upload(fileName, mediaItem.file);

          if (uploadError) {
            throw new Error(`Erro ao fazer upload do arquivo: ${uploadError.message}`);
          }

          // Obter URL pública do arquivo
          const { data: { publicUrl } } = supabase.storage
            .from('Inspiratio')
            .getPublicUrl(fileName);

          // Criar registro na MidiaData
          const { error: insertError } = await supabase
            .from('MidiaData')
            .insert({
              midia: publicUrl,
              note: mediaItem.note,
              memorie: parseInt(postId),
            });

          if (insertError) {
            throw insertError;
          }
          
          newMediaIndex++;
        } else if (!mediaItem.isNew && mediaItem.id) {
          // Mídia existente - atualizar apenas a nota
          const { error: updateError } = await supabase
            .from('MidiaData')
            .update({ note: mediaItem.note })
            .eq('id', mediaItem.id);

          if (updateError) {
            throw updateError;
          }
        }
      }

      // 3. Remover mídias que foram deletadas
      const currentMediaIds = data.mediaData
        .filter(item => !item.isNew && item.id)
        .map(item => item.id);
      
      const originalMediaIds = originalPost.MidiaData.map((media: any) => media.id);
      const deletedMediaIds = originalMediaIds.filter((id: number) => !currentMediaIds.includes(id));

      if (deletedMediaIds.length > 0) {
        // Deletar arquivos do storage
        const { data: mediaToDelete, error: fetchError } = await supabase
          .from('MidiaData')
          .select('midia')
          .in('id', deletedMediaIds);

        if (!fetchError && mediaToDelete) {
          const filePaths = mediaToDelete.map(item => {
            const url = new URL(item.midia);
            return url.pathname.replace('/storage/v1/object/public/Inspiratio/', '');
          });

          await supabase.storage.from('Inspiratio').remove(filePaths);
        }

        // Deletar registros do banco
        const { error: deleteError } = await supabase
          .from('MidiaData')
          .delete()
          .in('id', deletedMediaIds);

        if (deleteError) {
          throw deleteError;
        }
      }

      alert("Memória atualizada com sucesso!");
      router.push("/");
      
    } catch (error: any) {
      console.error('Erro ao atualizar:', error);
      alert(`Erro ao atualizar memória: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para remover uma mídia
  const removeMedia = (index: number) => {
    remove(index);
  };

  // Loading state
  if (isLoading || !user) {
    return (
      <Box
        width="100%"
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={4}>
          <Spinner size="xl" />
          <Text>Carregando dados para edição...</Text>
        </VStack>
      </Box>
    );
  }

  return (
      <Box
        width="100%"
        minHeight="100vh"
        pt={{ base: '100px', md: '120px' }}
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

          {/* Mídia e Notas existentes */}
          {fields.length > 0 && (
            <Box>
              <Text mb={2} fontWeight="medium">Suas mídias e anotações</Text>
              <VStack gap={3} align="stretch">
                {fields.map((field, index) => (
                  <Box key={field.id} p={4} borderWidth="1px" borderRadius="lg">
                    <HStack align="start" gap={4}>
                      <VStack flex="1" align="stretch">
                        <Text fontSize="sm" color="gray.600">
                          Nota para mídia {index + 1}:
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
                      
                      {/* Preview da mídia */}
                      <VStack>
                        <Box 
                          width="120px" 
                          height="120px" 
                          borderRadius="md" 
                          overflow="hidden"
                          border="1px solid"
                          borderColor="gray.200"
                        >
                          {field.midia.includes('.mp4') || field.midia.includes('.webm') || field.midia.includes('video') ? (
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
                          ) : (
                            <ImageCH 
                              src={field.midia} 
                              alt={`Mídia ${index + 1}`} 
                              objectFit="cover"
                              width="100%"
                              height="100%"
                            />
                          )}
                        </Box>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => removeMedia(index)}
                        >
                          <BiTrash />
                        </Button>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

          {/* Adicionar novas mídias */}
          <Box>
            <Text mb={2} fontWeight="medium">Adicionar novas mídias</Text>
            <Input
              ref={inputFileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={addNewFiles}
              variant="subtle"
              p={1}
              placeholder="Selecione novos arquivos"
            />
          </Box>

          {/* Botões de Ação */}
          <HStack gap={4}>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              Cancelar
            </Button>
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
              flex={1}
              >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </HStack>
        </VStack>
        
        <Box position={'relative'} display={{ base: 'none', xl: 'block' }} flex="1" minWidth="300px">
          <Trail open={open}>
            <Text as={'span'}>Edite sua</Text>
            <Box display={'flex'} flexWrap={'nowrap'} flexDirection={'row'}>
              <Text as={'span'}>memória</Text>
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
            <Text as={'span'}>especial</Text>
          </Trail>
        </Box>
        
      </Box>
      </Box>
  );
};
