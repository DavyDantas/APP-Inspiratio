'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';

const UserContext = createContext<{ user: User | null }>({ user: null });

export const UserProvider = ({
  user,
  children,
}: {
  user: User | null;
  children: ReactNode;
}) => {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);