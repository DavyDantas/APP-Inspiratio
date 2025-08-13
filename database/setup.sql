-- Script SQL para criar as tabelas no Supabase

-- Tabela MemoriePost
CREATE TABLE IF NOT EXISTS public.MemoriePost (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    user UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela MidiaData
CREATE TABLE IF NOT EXISTS public.MidiaData (
    midia_id BIGSERIAL PRIMARY KEY,
    midia TEXT NOT NULL,
    note TEXT NOT NULL,
    memorie BIGINT REFERENCES public.MemoriePost(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.MemoriePost ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.MidiaData ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para MemoriePost
CREATE POLICY "Users can view their own posts" ON public.MemoriePost
    FOR SELECT USING (auth.uid() = "user");

CREATE POLICY "Users can insert their own posts" ON public.MemoriePost
    FOR INSERT WITH CHECK (auth.uid() = "user");

CREATE POLICY "Users can update their own posts" ON public.MemoriePost
    FOR UPDATE USING (auth.uid() = "user");

CREATE POLICY "Users can delete their own posts" ON public.MemoriePost
    FOR DELETE USING (auth.uid() = "user");

-- Políticas de segurança para MidiaData
CREATE POLICY "Users can view media from their posts" ON public.MidiaData
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.MemoriePost 
            WHERE MemoriePost.id = MidiaData.memorie 
            AND MemoriePost."user" = auth.uid()
        )
    );

CREATE POLICY "Users can insert media to their posts" ON public.MidiaData
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.MemoriePost 
            WHERE MemoriePost.id = MidiaData.memorie 
            AND MemoriePost."user" = auth.uid()
        )
    );

CREATE POLICY "Users can update media from their posts" ON public.MidiaData
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.MemoriePost 
            WHERE MemoriePost.id = MidiaData.memorie 
            AND MemoriePost."user" = auth.uid()
        )
    );

CREATE POLICY "Users can delete media from their posts" ON public.MidiaData
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.MemoriePost 
            WHERE MemoriePost.id = MidiaData.memorie 
            AND MemoriePost."user" = auth.uid()
        )
    );

-- Criar bucket para uploads (se não existir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Política para o bucket uploads
CREATE POLICY "Users can upload their own files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'uploads' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'uploads' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'uploads' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
