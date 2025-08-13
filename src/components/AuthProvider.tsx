"use client";

import { createClient } from '@/utils/supabase/client';
import { UserProvider } from '@/context/auth';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <UserProvider user={user}>
      {children}
    </UserProvider>
  );
}
