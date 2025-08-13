import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from "@/context/auth"

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
  const { user } = useUser();

  const fetchPosts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const supabase = createClient();
      
      const { data: memoriePostsData, error: postsError } = await supabase
        .from('MemoriePost')
        .select(`*, MidiaData (*)`)
        .eq('user', user.id)
        .order('created_at', { ascending: false });

      if (postsError) {
        throw postsError;
      }

      const transformedPosts: MemoriePostData[] = (memoriePostsData || []).map((post) => {
        const mediaUrls = post.MidiaData?.map((midiaItem: MidiaData) => midiaItem.midia as string) || [];

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
