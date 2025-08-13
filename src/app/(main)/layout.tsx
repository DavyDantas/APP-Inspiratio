
import { Provider } from "@/components/ui/provider";
import Header from "@/components/Header";
import { UserProvider } from "@/context/auth";
import { createClient } from '@/utils/supabase/server';

export default async function MainLayout(props: {
  children: React.ReactNode;
}) {
  const { children } = props;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Provider>
      <UserProvider user={user}>
        <Header />
        {children}
      </UserProvider>
    </Provider>
  );
}