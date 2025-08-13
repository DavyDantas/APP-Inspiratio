import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

// Interface que representa os dados vindos do Supabase
export interface SupabaseMemoriePost {
  id: number;
  title: string;
  user: string;
  created_at: string;
}

// Interface que os componentes esperam (formato atual)
export interface MemoriePostData {
  id: number;
  title: string;
  user: string;
  created_at: string;
  media: string[];
  comments: {
    text: string;
  }[];
}

export interface MidiaData {
    midia: string;
    note: string;
}

export const useMemoriePosts = () => {
  const [posts, setPosts] = useState<MemoriePostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      // Buscar posts com suas respectivas mídias seguindo a estrutura das tabelas
      const { data: memoriePostsData, error: postsError } = await supabase
        .from('MemoriePost')
        .select(`*, MidiaData (*)`)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error("Erro ao buscar posts:", postsError);
        throw postsError;
      }

      console.log("Dados brutos do Supabase:", memoriePostsData);

      // Transformar os dados para o formato esperado pelos componentes
      const transformedPosts: MemoriePostData[] = (memoriePostsData || []).map((post) => {
        // Extrair URLs das mídias da tabela MidiaData
        const mediaUrls = post.MidiaData?.map((midiaItem: MidiaData) => midiaItem.midia as string) || [];

        // Extrair notas da tabela MidiaData como comentários
        const comments = post.MidiaData?.map((midiaItem: MidiaData) => ({
          text: midiaItem.note || ''
        })) || [];

        const transformedPost = {
          id: post.id,
          title: post.title,
          user: post.user,
          created_at: post.created_at,
          media: mediaUrls,
          comments: comments
        };

        console.log(`Post transformado ${post.id}:`, transformedPost);
        return transformedPost;
      });

      console.log("Posts transformados finais:", transformedPosts);
      setPosts(transformedPosts);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar posts:', err);
      setError(err.message);
      setPosts([]); // Limpar posts em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { 
    posts, 
    loading, 
    error, 
    refetch: fetchPosts
  };
};
